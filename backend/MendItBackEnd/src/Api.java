
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class Api implements HttpHandler {

    // Student authentication
    private final StudentAuthHandler studentAuthHandler =
            new StudentAuthHandler();

    // Admin authentication
    private final AdminAuthHandler adminAuthHandler =
            new AdminAuthHandler();

    // Student dashboard
    private final StudentDashboardHandler studentDashboardHandler =
            new StudentDashboardHandler();

    @Override
    public void handle(HttpExchange exchange) throws IOException {

        // Allow React frontend to communicate with Java backend
        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin", "http://localhost:5173");

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

        // Handle browser CORS preflight requests
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

        // DEFAULT RESPONSE
        String response;

        if (method.equalsIgnoreCase("GET")) {

            response = """
                    {
                        "success": true,
                        "message": "Welcome to MendIt API!"
                    }
                    """;

            sendResponse(exchange, 200, response);

        } else {

            response = """
                    {
                        "success": false,
                        "message": "This API request is not supported yet."
                    }
                    """;

            sendResponse(exchange, 405, response);
        }
    }

    // Send response to frontend
    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response
    ) throws IOException {

        byte[] responseBytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(
                statusCode, responseBytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}