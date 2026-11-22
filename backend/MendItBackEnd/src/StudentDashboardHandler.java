import com.sun.net.httpserver.HttpExchange;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.IOException;
import java.io.OutputStream;
//import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class StudentDashboardHandler {

    private final StudentDashboardDAO dashboardDAO =
            new StudentDashboardDAO();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void handleDashboard(HttpExchange exchange)
            throws IOException {

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            sendResponse(exchange, 405, Map.of(
                    "success", false,
                    "message", "Method not allowed."
            ));
            return;
        }

        try {
            String query = exchange.getRequestURI().getQuery();

            if (query == null || !query.startsWith("studentId=")) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Student ID is required."
                ));
                return;
            }

            int studentId = Integer.parseInt(
                    query.substring("studentId=".length())
            );

            if (studentId <= 0) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Invalid student ID."
                ));
                return;
            }

            Map<String, Object> student =
                    dashboardDAO.getStudentDetails(studentId);

            if (student.isEmpty()) {
                sendResponse(exchange, 404, Map.of(
                        "success", false,
                        "message", "Student not found."
                ));
                return;
            }

            Map<String, Object> responseData = new HashMap<>();

            responseData.put("student", student);
            responseData.put("stats",
                    dashboardDAO.getDashboardStats(studentId));
            responseData.put("recentComplaints",
                    dashboardDAO.getRecentComplaints(studentId));

            sendResponse(exchange, 200, Map.of(
                    "success", true,
                    "data", responseData
            ));

        } catch (NumberFormatException e) {
            sendResponse(exchange, 400, Map.of(
                    "success", false,
                    "message", "Student ID must be a valid number."
            ));

        } catch (SQLException e) {
            e.printStackTrace();

            sendResponse(exchange, 500, Map.of(
                    "success", false,
                    "message", "Unable to load dashboard data."
            ));
        }
    }
//     added method to handle profile update -a
    public void handleUpdateProfile(HttpExchange exchange)
        throws IOException {

        if (!exchange.getRequestMethod().equalsIgnoreCase("PUT")) {
                sendResponse(exchange, 405, Map.of(
                        "success", false,
                        "message", "Method not allowed."
                ));
                return;
        }

        try {
                Map<String, Object> request =
                        objectMapper.readValue(
                                exchange.getRequestBody(),
                                new TypeReference<Map<String, Object>>() {}
                        );

                Object studentIdValue = request.get("studentId");
                String fullName = String.valueOf(
                        request.getOrDefault("full_name", "")
                ).trim();
                String department = String.valueOf(
                        request.getOrDefault("department", "")
                ).trim();

                if (studentIdValue == null || fullName.isEmpty()) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Student ID and full name are required."
                ));
                return;
                }

                int studentId = Integer.parseInt(studentIdValue.toString());

                if (studentId <= 0 || fullName.length() > 100
                        || department.length() > 100) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "The profile details are invalid."
                ));
                return;
                }

                boolean updated = dashboardDAO.updateStudentProfile(
                        studentId, fullName, department
                );

                if (!updated) {
                sendResponse(exchange, 404, Map.of(
                        "success", false,
                        "message", "Student profile was not updated."
                ));
                return;
                }

                sendResponse(exchange, 200, Map.of(
                        "success", true,
                        "message", "Profile updated successfully."
                ));

        } catch (NumberFormatException e) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Student ID must be a valid number."
                ));

        } catch (SQLException e) {
                e.printStackTrace();
                sendResponse(exchange, 500, Map.of(
                        "success", false,
                        "message", "Unable to update profile."
                ));
        }
        }

    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            Map<String, Object> response
    ) throws IOException {

        byte[] responseBytes =
                objectMapper.writeValueAsBytes(response);

        exchange.getResponseHeaders().set(
                "Content-Type", "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(statusCode, responseBytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}