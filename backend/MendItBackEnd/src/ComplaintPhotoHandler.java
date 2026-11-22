import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;

public class ComplaintPhotoHandler implements HttpHandler {

    private static final String URL_PREFIX = "/uploads/complaints/";
    private static final Path UPLOAD_DIRECTORY =
            ComplaintPhotoStorage.getUploadDirectory();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            sendMessage(exchange, 405, "Method not allowed.");
            return;
        }

        String requestPath = exchange.getRequestURI().getPath();
        String fileName = requestPath.substring(URL_PREFIX.length());

        if (fileName.isBlank()
                || fileName.contains("/")
                || fileName.contains("\\")
                || fileName.contains("..")) {
            sendMessage(exchange, 404, "Photo not found.");
            return;
        }

        Path photo = UPLOAD_DIRECTORY.resolve(fileName).normalize();

        if (!photo.startsWith(UPLOAD_DIRECTORY)
                || !Files.isRegularFile(photo)) {
            sendMessage(exchange, 404, "Photo not found.");
            return;
        }

        String extension = fileName.substring(
                fileName.lastIndexOf(".") + 1
        ).toLowerCase(Locale.ROOT);

        String contentType;

        switch (extension) {
            case "png":
                contentType = "image/png";
                break;
            case "jpg":
                contentType = "image/jpeg";
                break;
            case "webp":
                contentType = "image/webp";
                break;
            default:
                sendMessage(exchange, 404, "Photo not found.");
                return;
        }

        try {
            byte[] imageBytes = Files.readAllBytes(photo);

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.getResponseHeaders().set(
                    "X-Content-Type-Options",
                    "nosniff"
            );

            exchange.sendResponseHeaders(200, imageBytes.length);

            try (OutputStream output = exchange.getResponseBody()) {
                output.write(imageBytes);
            }
        } catch (IOException e) {
            sendMessage(exchange, 500, "Unable to load photo.");
        }
    }

    private void sendMessage(
            HttpExchange exchange,
            int statusCode,
            String message
    ) throws IOException {
        byte[] response = message.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "text/plain; charset=UTF-8"
        );

        exchange.sendResponseHeaders(statusCode, response.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(response);
        }
    }
}