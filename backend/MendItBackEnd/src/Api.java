
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class Api implements HttpHandler {
    // Handles student registration and login API requests.
    private final StudentAuthHandler studentAuthHandler =
            new StudentAuthHandler();
            // Handles student dashboard requests.
private final StudentDashboardHandler studentDashboardHandler =
        new StudentDashboardHandler();
    @Override
    public void handle(HttpExchange exchange) throws IOException {

        // Allow React frontend to communicate with Java backend
        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin", "http://localhost:5173"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers", "Content-Type"
        );
// Allow credentialed requests from the React frontend
        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Credentials", "true"
        );
        exchange.getResponseHeaders().set(
                "Content-Type", "application/json; charset=UTF-8"
        );

        String method = exchange.getRequestMethod();
        // Get the requested API URL.
        String path = exchange.getRequestURI().getPath();
// Handle browser CORS preflight requests
        if (method.equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }
// Handle student registration requests.
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/auth/register")) {

            studentAuthHandler.handleStudentRegistration(exchange);
            return;
        }

// Handle student login requests.
        if (method.equalsIgnoreCase("POST")
                && path.equals("/api/auth/login")) {

            studentAuthHandler.handleStudentLogin(exchange);
            return;
        }
// Fetches dashboard details, complaint statistics,
// and recent complaints for the requested student.
if (method.equalsIgnoreCase("GET")
        && path.equals("/api/student/dashboard")) {

    studentDashboardHandler.handleDashboard(exchange);
    return;
}


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

    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response
    ) throws IOException {

        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(statusCode, responseBytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}
