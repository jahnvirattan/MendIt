
import com.sun.net.httpserver.HttpExchange;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class StudentAuthHandler {

    // Converts incoming JSON into Java objects
    // and Java objects into JSON responses.
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Handles student registration and login logic.
    private final StudentAuth studentAuth = new StudentAuth();


    // --------------------------------------------------
    // STUDENT REGISTRATION
    // --------------------------------------------------

    public void handleStudentRegistration(
            HttpExchange exchange
    ) throws IOException {

        try {

            // Read the JSON request sent by React.
            JsonNode request = objectMapper.readTree(
                    exchange.getRequestBody()
            );

            // Extract student details.
            String role = getText(request, "role");
            String fullName = getText(request, "fullName");
            String rollNumber = getText(request, "rollNumber");
            String email = getText(request, "email");
            String mobile = getText(request, "mobile");
            String department = getText(request, "department");
            String password = getText(request, "password");

            // Extract and validate semester.
            // React may send semester as a string, such as "3".
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

            // This endpoint is only for student registration.
            if (!"student".equalsIgnoreCase(role)) {
                sendError(exchange, 400, "Invalid registration role.");
                return;
            }

            // Call StudentAuth to validate and register the student.
            boolean registered = studentAuth.registerStudent(
                    fullName,
                    rollNumber,
                    email,
                    mobile,
                    department,
                    semester,
                    password
            );

            // Send success response.
            if (registered) {
                sendResponse(exchange, 201, """
                        {
                            "success": true,
                            "message": "Student registered successfully."
                        }
                        """);
            } else {
                sendError(exchange, 500, "Student registration failed.");
            }

        } catch (IllegalArgumentException e) {

            // Handle invalid input and duplicate student details.
            sendError(exchange, 400, e.getMessage());

        } catch (Exception e) {

            // Handle unexpected database or server errors.
            e.printStackTrace();
            sendError(exchange, 500, "Registration failed. Please try again.");
        }
    }


    // --------------------------------------------------
    // STUDENT LOGIN
    // --------------------------------------------------

    public void handleStudentLogin(
            HttpExchange exchange
    ) throws IOException {

        try {

            // Read the JSON login request.
            JsonNode request = objectMapper.readTree(
                    exchange.getRequestBody()
            );

            // Extract roll number and password.
            String rollNumber = getText(request, "rollNumber");
            String password = getText(request, "password");

            // Verify student credentials.
            StudentDAO.StudentLoginData student =
                    studentAuth.loginStudent(rollNumber, password);

            // Create a safe user object.
            // Never send the password hash to React.
            var user = objectMapper.createObjectNode();

            user.put("userId", student.userId);
            user.put("fullName", student.fullName);
            user.put("email", student.email);
            user.put("rollNumber", student.rollNumber);
            user.put("mobile", student.mobile);
            user.put("department", student.department);
            user.put("semester", student.semester);
            user.put("role", student.role);

            // Create the response in the format expected by React.
            var response = objectMapper.createObjectNode();

            response.put("success", true);
            response.put("message", "Login successful.");

            response.set(
                    "data",
                    objectMapper.createObjectNode().set("user", user)
            );

            sendResponse(
                    exchange,
                    200,
                    objectMapper.writeValueAsString(response)
            );

        } catch (IllegalArgumentException e) {

            // Invalid roll number or password.
            sendError(exchange, 401, e.getMessage());

        } catch (Exception e) {

            // Handle unexpected server errors.
            e.printStackTrace();
            sendError(exchange, 500, "Login failed. Please try again.");
        }
    }


    // --------------------------------------------------
    // HELPER METHODS
    // --------------------------------------------------

    // Extract a text value safely from a JSON request.
    private String getText(JsonNode request, String field) {

        JsonNode value = request.get(field);

        if (value == null || value.isNull()) {
            return null;
        }

        return value.asText();
    }


    // Create a consistent JSON error response.
    private void sendError(
            HttpExchange exchange,
            int statusCode,
            String message
    ) throws IOException {

        var error = objectMapper.createObjectNode();

        error.put("success", false);
        error.put("message", message);

        sendResponse(
                exchange,
                statusCode,
                objectMapper.writeValueAsString(error)
        );
    }


    // Send JSON response to the React frontend.
    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response
    ) throws IOException {

        byte[] responseBytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(
                statusCode,
                responseBytes.length
        );

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}
