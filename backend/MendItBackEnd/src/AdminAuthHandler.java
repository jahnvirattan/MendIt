
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.net.httpserver.HttpExchange;

public class AdminAuthHandler {

    private final ObjectMapper mapper = new ObjectMapper();
    private final AdminAuth adminAuth = new AdminAuth();

    public void handleAdminRegistration(HttpExchange exchange)
            throws IOException {
        handleRequest(exchange, true);
    }

    public void handleAdminLogin(HttpExchange exchange)
            throws IOException {
        handleRequest(exchange, false);
    }

    private void handleRequest(
            HttpExchange exchange, boolean isRegistration)
            throws IOException {

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, false, "Method not allowed.");
            return;
        }

        try {
            JsonNode request = mapper.readTree(exchange.getRequestBody());

            if (request == null || !request.isObject()) {
                sendResponse(exchange, 400, false, "Invalid JSON request.");
                return;
            }

            String email = getText(request, "email");
            String password = getText(request, "password");

            Map<String, Object> result;

            if (isRegistration) {
                String fullName = getText(request, "fullName");
                String adminId = getText(request, "adminId");
                String mobile = getText(request, "mobile");
                String designation = getText(request, "designation");
                String invitationCode = getText(request, "invitationCode");

                result = adminAuth.register(
                        fullName,
                        adminId,
                        email,
                        mobile,
                        designation,
                        invitationCode,
                        password
                );
            } else {
                result = adminAuth.login(email, password);
            }

            int status = (int) result.get("httpStatus");

            ObjectNode response = mapper.valueToTree(result);
            response.remove("httpStatus");

            sendJson(exchange, status, response);

        } catch (Exception e) {
            e.printStackTrace();
            sendResponse(exchange, 500, false,
                    "Request failed. Please try again.");
        }
    }

    private String getText(JsonNode request, String field) {
        JsonNode value = request.get(field);

        if (value == null || value.isNull()) {
            return null;
        }

        return value.asText();
    }

    private void sendResponse(
            HttpExchange exchange,
            int status,
            boolean success,
            String message) throws IOException {

        ObjectNode response = mapper.createObjectNode();
        response.put("success", success);
        response.put("message", message);

        sendJson(exchange, status, response);
    }

    private void sendJson(
            HttpExchange exchange,
            int status,
            ObjectNode response) throws IOException {

        byte[] data = mapper.writeValueAsBytes(response);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(status, data.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(data);
        }
    }
}