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

    private final FeedbackDAO feedbackDAO = new FeedbackDAO();

    private final StudentComplaintHistory complaintHistory =
            new StudentComplaintHistory();

    private final ObjectMapper mapper = new ObjectMapper();

    private final ComplaintPhotoStorage photoStorage =
        new ComplaintPhotoStorage();

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
                byte[] requestBytes = exchange.getRequestBody()
                .readNBytes(7 * 1024 * 1024 + 1);

        if (requestBytes.length > 7 * 1024 * 1024) {
        sendResponse(exchange, 413, Map.of(
                "success", false,
                "message", "Request is too large. Photo limit is 5 MB."
        ));
        return;
        }

        request = mapper.readValue(
                requestBytes,
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
            String photoData = getText(request, "photoData");

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
            String photoPath = photoStorage.savePhoto(photoData);

            StudentComplaint complaint = new StudentComplaint(
                    studentId,
                    title,
                    description,
                    category,
                    building,
                    floor.isEmpty() ? null : floor,
                    roomOrArea,
                    photoPath
            );

            int complaintId;

                try {
                complaintId = submissionDAO.saveComplaint(complaint);
                } catch (SQLException e) {
                try {
                        photoStorage.deletePhoto(photoPath);
                } catch (IOException cleanupError) {
                        cleanupError.printStackTrace();
                }

                throw e;
                }

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

        }        catch (IllegalArgumentException e) {
                sendResponse(exchange, 400, Map.of(
                         "success", false,
                         "message", e.getMessage()
        ));
        }
        catch (SQLException e) {
            e.printStackTrace();

            sendResponse(exchange, 500, Map.of(
                    "success", false,
                    "message", "Unable to save the complaint."
            ));
        }
         catch (IOException e) {
                e.printStackTrace();

                sendResponse(exchange, 500, Map.of(
                        "success", false,
                        "message", "Unable to save the complaint photo."
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
    public void handleFeedbackSubmit(HttpExchange exchange)
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

                int complaintId = Integer.parseInt(
                        String.valueOf(request.get("complaintId"))
                );

                int rating = Integer.parseInt(
                        String.valueOf(request.get("rating"))
                );

                String comments = getText(request, "comments");

                if (studentId <= 0
                        || complaintId <= 0
                        || rating < 1
                        || rating > 5
                        || comments.length() > 500) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message", "Please provide valid feedback details."
                ));
                return;
                }

                boolean saved = feedbackDAO.saveFeedback(
                        studentId,
                        complaintId,
                        rating,
                        comments
                );

                if (!saved) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message",
                        "The complaint must belong to you, be resolved, and have no previous feedback."
                ));
                return;
                }

                sendResponse(exchange, 201, Map.of(
                        "success", true,
                        "message", "Feedback submitted successfully."
                ));

        } catch (NumberFormatException e) {
                sendResponse(exchange, 400, Map.of(
                        "success", false,
                        "message",
                        "Student ID, complaint ID, and rating must be numbers."
                ));

        } catch (SQLException e) {
                e.printStackTrace();
                sendResponse(exchange, 500, Map.of(
                        "success", false,
                        "message", "Unable to save feedback."
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