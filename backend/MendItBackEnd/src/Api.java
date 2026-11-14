
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class Api implements HttpHandler {

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

        exchange.getResponseHeaders().set(
                "Content-Type", "application/json; charset=UTF-8"
        );

        String method = exchange.getRequestMethod();

        // Handle browser CORS preflight requests
        if (method.equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
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
