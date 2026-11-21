
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sun.net.httpserver.HttpExchange;

public class StudentAuthHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final StudentAuth studentAuth = new StudentAuth();

    // --------------------------------------------------
    // STUDENT REGISTRATION
    // --------------------------------------------------

    public void handleStudentRegistration(HttpExchange exchange)
            throws IOException {

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendError(exchange, 405, "Method not allowed.");
            return;
        }

        try {
            JsonNode request = objectMapper.readTree(
                    exchange.getRequestBody()
            );

            if (request == null || !request.isObject()) {
                sendError(exchange, 400, "Invalid JSON request.");
                return;
            }

            String role = getText(request, "role");
            String fullName = getText(request, "fullName");
            String rollNumber = getText(request, "rollNumber");
            String email = getText(request, "email");
            String mobile = getText(request, "mobile");
            String department = getText(request, "department");
            String password = getText(request, "password");

            JsonNode semesterNode = request.get("semester");

            int semester;

            try {
                if (semesterNode == null || semesterNode.isNull()) {
                    throw new NumberFormatException();
                }

                semester = Integer.parseInt(semesterNode.asText());

            } catch (NumberFormatException e) {
                sendError(exchange, 400, "Please provide a valid semester.");
                return;
            }

            if (!"student".equalsIgnoreCase(role)) {
                sendError(exchange, 400, "Invalid registration role.");
                return;
            }

            boolean registered = studentAuth.registerStudent(
                    fullName,
                    rollNumber,
                    email,
                    mobile,
                    department,
                    semester,
                    password
            );

            if (registered) {
                sendResponse(
                        exchange,
                        201,
                        "{\"success\":true,\"message\":\"Student registered successfully.\"}"
                );
            } else {
                sendError(exchange, 500, "Student registration failed.");
            }

        } catch (IllegalArgumentException e) {
            sendError(exchange, 400, e.getMessage());

        } catch (IOException e) {
            sendError(exchange, 400, "Invalid JSON request.");

        } catch (Exception e) {
            e.printStackTrace();
            sendError(exchange, 500, "Registration failed. Please try again.");
        }
    }

    // --------------------------------------------------
    // STUDENT LOGIN
    // --------------------------------------------------

    public void handleStudentLogin(HttpExchange exchange)
            throws IOException {

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendError(exchange, 405, "Method not allowed.");
            return;
        }

        try {
            JsonNode request = objectMapper.readTree(
                    exchange.getRequestBody()
            );

            if (request == null || !request.isObject()) {
                sendError(exchange, 400, "Invalid JSON request.");
                return;
            }

            String rollNumber = getText(request, "rollNumber");
            String password = getText(request, "password");

            StudentDAO.StudentLoginData student =
                    studentAuth.loginStudent(rollNumber, password);

            // Create a safe user object.
            // Never send the password hash to React.
            ObjectNode user = objectMapper.createObjectNode();

            user.put("userId", student.userId);
            user.put("fullName", student.fullName);
            user.put("email", student.email);
            user.put("rollNumber", student.rollNumber);
            user.put("mobile", student.mobile);
            user.put("department", student.department);
            user.put("semester", student.semester);
            user.put("role", student.role);

            // Create the response expected by React.
            ObjectNode response = objectMapper.createObjectNode();

            response.put("success", true);
            response.put("message", "Login successful.");

            ObjectNode data = objectMapper.createObjectNode();
            data.set("user", user);

            response.set("data", data);

            sendResponse(
                    exchange,
                    200,
                    objectMapper.writeValueAsString(response)
            );

        } catch (IllegalArgumentException e) {
            sendError(exchange, 401, e.getMessage());

        } catch (IOException e) {
            sendError(exchange, 400, "Invalid JSON request.");

        } catch (Exception e) {
            e.printStackTrace();
            sendError(exchange, 500, "Login failed. Please try again.");
        }
    }

    // --------------------------------------------------
    // HELPER METHODS
    // --------------------------------------------------

    private String getText(JsonNode request, String field) {

        JsonNode value = request.get(field);

        if (value == null || value.isNull()) {
            return null;
        }

        return value.asText();
    }

    private void sendError(
            HttpExchange exchange,
            int statusCode,
            String message
    ) throws IOException {

        ObjectNode error = objectMapper.createObjectNode();

        error.put("success", false);
        error.put("message", message);

        sendResponse(
                exchange,
                statusCode,
                objectMapper.writeValueAsString(error)
        );
    }

    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response
    ) throws IOException {

        byte[] responseBytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(
                statusCode,
                responseBytes.length
        );

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}
