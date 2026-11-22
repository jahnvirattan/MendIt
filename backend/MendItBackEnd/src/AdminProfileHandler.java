
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class AdminProfileHandler {

    private final AdminProfileDAO profileDAO = new AdminProfileDAO();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // GET /api/admin/profile?userId=1
    public void handleGetProfile(HttpExchange exchange)
            throws IOException {

        Map<String, Object> response = new HashMap<>();

        try {
            String query = exchange.getRequestURI().getQuery();
            int userId = getUserIdFromQuery(query);

            if (userId <= 0) {
                response.put("success", false);
                response.put("message", "Invalid admin ID.");
                sendResponse(exchange, 400, response);
                return;
            }

            AdminProfileDAO.AdminProfileData admin = profileDAO.getAdminDetails(userId);

            if (admin == null) {
                response.put("success", false);
                response.put("message", "Admin profile not found.");
                sendResponse(exchange, 404, response);
                return;
            }

            Map<String, Object> adminData = new HashMap<>();

            adminData.put("userId", admin.userId);
            adminData.put("fullName", admin.fullName);
            adminData.put("adminId", admin.adminId);
            adminData.put("email", admin.email);
            adminData.put("mobile", admin.mobile);
            adminData.put("designation", admin.designation);

            Map<String, Object> data = new HashMap<>();
            data.put("admin", adminData);

            response.put("success", true);
            response.put("data", data);

            sendResponse(exchange, 200, response);

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid admin ID.");
            sendResponse(exchange, 400, response);

        } catch (SQLException e) {
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Database error while loading profile.");
            sendResponse(exchange, 500, response);
        }
    }

    // PUT /api/admin/profile
    public void handleUpdateProfile(HttpExchange exchange)
            throws IOException {

        Map<String, Object> response = new HashMap<>();

        try {
            InputStream input = exchange.getRequestBody();

            Map<String, Object> request = objectMapper.readValue(
                    input,
                    Map.class);

            int userId = Integer.parseInt(
                    String.valueOf(request.get("userId")));

            String fullName = String.valueOf(
                    request.getOrDefault("full_name", "")).trim();

            String mobile = String.valueOf(
                    request.getOrDefault("mobile", "")).trim();

            String designation = String.valueOf(
                    request.getOrDefault("designation", "")).trim();

            if (userId <= 0 || fullName.isEmpty()) {
                response.put("success", false);
                response.put("message", "Admin ID and full name are required.");
                sendResponse(exchange, 400, response);
                return;
            }

            boolean updated = profileDAO.updateAdminProfile(
                    userId,
                    fullName,
                    mobile,
                    designation);

            if (!updated) {
                response.put("success", false);
                response.put("message", "Admin profile not found.");
                sendResponse(exchange, 404, response);
                return;
            }

            response.put("success", true);
            response.put("message", "Profile updated successfully.");

            sendResponse(exchange, 200, response);

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid admin ID.");
            sendResponse(exchange, 400, response);

        } catch (SQLException e) {
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Database error while updating profile.");
            sendResponse(exchange, 500, response);
        }
    }

    private int getUserIdFromQuery(String query) {
        if (query == null || query.isEmpty()) {
            return -1;
        }

        for (String parameter : query.split("&")) {
            String[] parts = parameter.split("=", 2);

            if (parts.length == 2 && parts[0].equals("userId")) {
                return Integer.parseInt(parts[1]);
            }
        }

        return -1;
    }

    private void sendResponse(
            HttpExchange exchange,
            int status,
            Map<String, Object> response) throws IOException {

        byte[] output = objectMapper.writeValueAsString(response)
                .getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json");

        exchange.sendResponseHeaders(status, output.length);

        try (OutputStream os = exchange.getResponseBody()) {
            os.write(output);
        }
    }
}
