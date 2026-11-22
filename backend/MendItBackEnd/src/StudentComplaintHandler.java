import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class StudentComplaintHandler {

    private final ComplaintSubmissionDAO submissionDAO =
            new ComplaintSubmissionDAO();

    private final StudentComplaintHistory complaintHistory =
            new StudentComplaintHistory();

    private final ObjectMapper mapper = new ObjectMapper();

    public void handleSubmit(HttpExchange exchange)
            throws IOException {

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
            sendResponse(exchange, 405, Map.of(
                    "success", false,
                    "message", "Method not allowed."
            ));
            return;
        }

        Map<String, Object> request;

        try {
            request = mapper.readValue(
                    exchange.getRequestBody(),
                    new TypeReference<Map<String, Object>>() {}
            );
        } catch (IOException e) {
            sendResponse(exchange, 400, Map.of(
                    "success", false,
                    "message", "Invalid JSON request."
            ));
            return;
        }

        try {
            int studentId = Integer.parseInt(
                    String.valueOf(request.get("studentId"))
            );

            String title = getText(request, "title");
            String description = getText(request, "description");
            String category = getText(request, "category");
            String building = getText(request, "building");
            String floor = getText(request, "floor");
            String roomOrArea = getText(request, "roomOrArea");

            if (studentId <= 0
                    || title.isEmpty()
                    || description.isEmpty()
                    || category.isEmpty()
                    || building.isEmpty()
                    || roomOrArea.isEmpty()) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Please provide all required complaint details."
                ));
                return;
            }

            StudentComplaint complaint = new StudentComplaint(
                    studentId,
                    title,
                    description,
                    category,
                    building,
                    floor.isEmpty() ? null : floor,
                    roomOrArea,
                    null
            );

            int complaintId = submissionDAO.saveComplaint(complaint);

            sendResponse(exchange, 201, Map.of(
                    "success", true,
                    "message", "Complaint submitted successfully.",
                    "complaintId", complaintId
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
                    "message", "Unable to save the complaint."
            ));
        }
    }

    public void handleStudentComplaints(HttpExchange exchange)
            throws IOException {

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            sendResponse(exchange, 405, Map.of(
                    "success", false,
                    "message", "Method not allowed."
            ));
            return;
        }

        String studentIdValue = getQueryParameter(
                exchange.getRequestURI().getQuery(),
                "studentId"
        );

        if (studentIdValue == null || studentIdValue.isBlank()) {
            sendResponse(exchange, 400, Map.of(
                    "success", false,
                    "message", "Student ID is required."
            ));
            return;
        }

        try {
            int studentId = Integer.parseInt(studentIdValue);

            if (studentId <= 0) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Invalid student ID."
                ));
                return;
            }

            List<StudentComplaint> complaints =
                    complaintHistory.getComplaintsByStudent(studentId);

            sendResponse(exchange, 200, Map.of(
                    "success", true,
                    "complaints", complaints
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
                    "message", "Unable to load complaints."
            ));
        }
    }

    private String getText(
            Map<String, Object> request,
            String key
    ) {
        Object value = request.get(key);
        return value == null ? "" : value.toString().trim();
    }

    private String getQueryParameter(
            String query,
            String parameterName
    ) {
        if (query == null || query.isBlank()) {
            return null;
        }

        for (String part : query.split("&")) {
            String[] pair = part.split("=", 2);

            if (pair.length == 2 && pair[0].equals(parameterName)) {
                return pair[1];
            }
        }

        return null;
    }

    private void sendResponse(
            HttpExchange exchange,
            int statusCode,
            Map<String, Object> response
    ) throws IOException {

        byte[] responseBytes = mapper.writeValueAsBytes(response);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(statusCode, responseBytes.length);

        try (OutputStream output = exchange.getResponseBody()) {
            output.write(responseBytes);
        }
    }
}