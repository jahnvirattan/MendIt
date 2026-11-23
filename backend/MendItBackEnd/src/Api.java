import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class Api implements HttpHandler {

    // Student authentication
    private final StudentAuthHandler studentAuthHandler = new StudentAuthHandler();

    // Admin authentication
    private final AdminAuthHandler adminAuthHandler = new AdminAuthHandler();

    // Student dashboard
    private final StudentDashboardHandler studentDashboardHandler = new StudentDashboardHandler();

    // Student complaint submission and history -a
    private final StudentComplaintHandler studentComplaintHandler = new StudentComplaintHandler();

    // Admin dashboard
    private final AdminDashboard adminDashboard = new AdminDashboard();

    // Complaint reports
    private final ComplaintReports complaintReports = new ComplaintReports();

    // Admin complaint management
    private final ComplaintHandler complaintHandler = new ComplaintHandler();

    // Convert Java data into JSON
    private final ObjectMapper mapper = new ObjectMapper();

    // Admin profile
    private final AdminProfileHandler adminProfileHandler = new AdminProfileHandler();

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        // CORS settings
        String origin = exchange.getRequestHeaders().getFirst("Origin");

        if ("http://localhost:5173".equals(origin)
                || "http://localhost:5174".equals(origin)) {

            exchange.getResponseHeaders().set(
                    "Access-Control-Allow-Origin", origin);
        }

        exchange.getResponseHeaders().set(
                "Vary", "Origin");

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS");

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers", "Content-Type");

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Credentials", "true");

        exchange.getResponseHeaders().set(
                "Content-Type", "application/json; charset=UTF-8");

        String method = exchange.getRequestMethod();
        String path = exchange.getRequestURI().getPath();

        // CORS preflight
        if (method.equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        // STUDENT REGISTRATION
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/auth/register")) {

            studentAuthHandler.handleStudentRegistration(exchange);
            return;
        }

        // STUDENT LOGIN
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/auth/login")) {

            studentAuthHandler.handleStudentLogin(exchange);
            return;
        }

        // ADMIN REGISTRATION
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/admin/register")) {

            adminAuthHandler.handleAdminRegistration(exchange);
            return;
        }

        // ADMIN LOGIN
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/admin/login")) {

            adminAuthHandler.handleAdminLogin(exchange);
            return;
        }

        // STUDENT DASHBOARD
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/student/dashboard")) {

            studentDashboardHandler.handleDashboard(exchange);
            return;
        }
        // added route for student profile update - a
        if (method.equalsIgnoreCase("PUT")
                && path.equals("/api/student/profile")) {

            studentDashboardHandler.handleUpdateProfile(exchange);
            return;
        }
        // ADMIN PROFILE - FETCH DETAILS
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/admin/profile")) {

            adminProfileHandler.handleGetProfile(exchange);
            return;
        }

        // ADMIN PROFILE - UPDATE DETAILS
        if (method.equalsIgnoreCase("PUT")
                && path.equals("/api/admin/profile")) {

            adminProfileHandler.handleUpdateProfile(exchange);
            return;
        }
        // added route for student complaints handle
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/student/complaints")) {

            studentComplaintHandler.handleSubmit(exchange);
            return;
        }

        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/student/complaints")) {

            studentComplaintHandler.handleStudentComplaints(exchange);
            return;
        }
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/student/feedback")) {

            studentComplaintHandler.handleFeedbackSubmit(exchange);
            return;
        }

        // ADMIN DASHBOARD STATISTICS
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/admin/dashboard")) {

            try {
                Map<String, Object> response = new HashMap<>();

                response.put("success", true);
                response.put("data", adminDashboard.getStatistics());

                sendJson(exchange, 200, response);

            } catch (SQLException e) {
                e.printStackTrace();
                sendError(exchange);
            }

            return;
        }

        // RECENT COMPLAINTS
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/admin/recent-complaints")) {

            try {
                Map<String, Object> response = new HashMap<>();

                response.put("success", true);
                response.put("data",
                        adminDashboard.getRecentComplaints());

                sendJson(exchange, 200, response);

            } catch (SQLException e) {
                e.printStackTrace();
                sendError(exchange);
            }

            return;
        }

        // CATEGORY REPORTS
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/admin/reports/categories")) {

            try {
                Map<String, Object> response = new HashMap<>();

                response.put("success", true);
                response.put("data",
                        complaintReports.getCategoryReports());

                sendJson(exchange, 200, response);

            } catch (SQLException e) {
                e.printStackTrace();
                sendError(exchange);
            }

            return;
        }

        // STATUS REPORTS
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/admin/reports/status")) {

            try {
                Map<String, Object> response = new HashMap<>();

                response.put("success", true);
                response.put("data",
                        complaintReports.getStatusReports());

                sendJson(exchange, 200, response);

            } catch (SQLException e) {
                e.printStackTrace();
                sendError(exchange);
            }

            return;
        }

        // =====================================
        // ADMIN COMPLAINT MANAGEMENT
        // =====================================

        // GET ALL STUDENT COMPLAINTS
        if (method.equalsIgnoreCase("GET")
                && path.equals("/api/admin/complaints")) {

            complaintHandler.getAllComplaints(exchange);
            return;
        }

        // UPDATE COMPLAINT STATUS
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/admin/complaints/status")) {

            complaintHandler.updateStatus(exchange);
            return;
        }

        // UPDATE COMPLAINT PRIORITY
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/admin/complaints/priority")) {

            complaintHandler.updatePriority(exchange);
            return;
        }

        // ADD ADMIN NOTE
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/admin/complaints/note")) {

            complaintHandler.addAdminNote(exchange);
            return;
        }

        // DEFAULT RESPONSE
        if (method.equalsIgnoreCase("GET")) {

            String response = """
                    {
                        "success": true,
                        "message": "Welcome to MendIt API!"
                    }
                    """;

            sendResponse(exchange, 200, response);

        } else {

            String response = """
                    {
                        "success": false,
                        "message": "This API request is not supported yet."
                    }
                    """;

            sendResponse(exchange, 405, response);
        }
    }

    // Send Java objects as JSON
    private void sendJson(
            HttpExchange exchange,
            int statusCode,
            Object data) throws IOException {

        byte[] responseBytes = mapper.writeValueAsBytes(data);

        exchange.sendResponseHeaders(
                statusCode, responseBytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }

    // Send database error
    private void sendError(HttpExchange exchange)
            throws IOException {

        Map<String, Object> response = new HashMap<>();

        response.put("success", false);
        response.put("message", "Unable to fetch dashboard data.");

        sendJson(exchange, 500, response);
    }

    // Send normal text response
    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response) throws IOException {

        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(
                statusCode, responseBytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}
