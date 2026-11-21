import com.sun.net.httpserver.HttpExchange;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

public class ComplaintHandler {
    ComplaintDAO complaintDAO = new ComplaintDAO();
    ObjectMapper mapper = new ObjectMapper();

    // GET ALL COMPLAINTS
    public void getAllComplaints(HttpExchange exchange) throws IOException {
        var complaints = complaintDAO.getAllComplaints();
        sendResponse(exchange, 200,
                Map.of("success", true, "data", complaints));
    }

    // UPDATE COMPLAINT STATUS
    public void updateStatus(HttpExchange exchange) throws IOException {
        Map<String, Object> data = mapper.readValue(exchange.getRequestBody(), Map.class);

        int complaintId = Integer.parseInt(data.get("complaintId").toString());
        String status = data.get("status").toString();
        boolean result = complaintDAO.updateStatus(complaintId, status);
        if (result) {
            sendResponse(exchange, 200,
                    Map.of("success", true, "message", "Status updated"));
        } else {
            sendResponse(exchange, 400,
                    Map.of("success", false, "message", "Update failed"));
        }
    }

    // UPDATE COMPLAINT PRIORITY
    public void updatePriority(HttpExchange exchange) throws IOException {
        Map<String, Object> data = mapper.readValue(exchange.getRequestBody(), Map.class);

        int complaintId = Integer.parseInt(data.get("complaintId").toString());
        String priority = data.get("priority").toString();
        boolean result = complaintDAO.updatePriority(complaintId, priority);
        if (result) {
            sendResponse(exchange, 200,
                    Map.of("success", true, "message", "Priority updated"));
        } else {
            sendResponse(exchange, 400,
                    Map.of("success", false, "message", "Update failed"));
        }
    }

    // ADD ADMIN NOTE
    public void addAdminNote(HttpExchange exchange) throws IOException {
        Map<String, Object> data = mapper.readValue(exchange.getRequestBody(), Map.class);

        int complaintId = Integer.parseInt(data.get("complaintId").toString());
        String note = data.get("adminNote").toString();
        boolean result = complaintDAO.addAdminNote(complaintId, note);
        if (result) {
            sendResponse(exchange, 200,
                    Map.of("success", true, "message", "Note added"));
        } else {
            sendResponse(exchange, 400,
                    Map.of("success", false, "message", "Update failed"));
        }
    }

    // SEND JSON RESPONSE
    private void sendResponse(HttpExchange exchange, int status, Map<String, Object> response) throws IOException {
        byte[] responseBytes = mapper.writeValueAsBytes(response);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }
}
