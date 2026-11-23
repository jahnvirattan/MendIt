import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class StudentComplaintHistory {

    public List<StudentComplaint> getComplaintsByStudent(int studentId)
            throws SQLException {

        List<StudentComplaint> complaints = new ArrayList<>();

       String sql = """
        SELECT c.complaint_id, c.student_id, c.title, c.description,
               c.category, c.building, c.floor, c.room_or_area,
               c.photo_path, c.priority, c.status, c.admin_note,
               c.submitted_at, c.updated_at, c.resolved_at,
               (f.feedback_id IS NOT NULL) AS feedback_submitted,
               f.rating AS feedback_rating
               FROM complaints c
               LEFT JOIN feedback f ON f.complaint_id = c.complaint_id
               WHERE c.student_id = ?
               ORDER BY c.submitted_at DESC
               """;

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, studentId);

            try (ResultSet result = statement.executeQuery()) {
                while (result.next()) {
                    complaints.add(mapComplaint(result));
                }
            }
        }

        return complaints;
    }

    public StudentComplaint getComplaintByIdForStudent(
            int studentId,
            int complaintId
    ) throws SQLException {

        String sql = """
        SELECT c.complaint_id, c.student_id, c.title, c.description,
               c.category, c.building, c.floor, c.room_or_area,
               c.photo_path, c.priority, c.status, c.admin_note,
               c.submitted_at, c.updated_at, c.resolved_at,
               (f.feedback_id IS NOT NULL) AS feedback_submitted,
               f.rating AS feedback_rating
                FROM complaints c
                LEFT JOIN feedback f ON f.complaint_id = c.complaint_id
                WHERE c.student_id = ? AND c.complaint_id = ?
                """;

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, studentId);
            statement.setInt(2, complaintId);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    return mapComplaint(result);
                }
            }
        }

        return null;
    }

    private StudentComplaint mapComplaint(ResultSet result)
            throws SQLException {

        StudentComplaint complaint = new StudentComplaint();

        complaint.setComplaintId(result.getInt("complaint_id"));
        complaint.setStudentId(result.getInt("student_id"));
        complaint.setTitle(result.getString("title"));
        complaint.setDescription(result.getString("description"));
        complaint.setCategory(result.getString("category"));
        complaint.setBuilding(result.getString("building"));
        complaint.setFloor(result.getString("floor"));
        complaint.setRoomOrArea(result.getString("room_or_area"));
        complaint.setPhotoPath(result.getString("photo_path"));
        complaint.setPriority(result.getString("priority"));
        complaint.setStatus(result.getString("status"));
        complaint.setAdminNote(result.getString("admin_note"));
        complaint.setSubmittedAt(result.getString("submitted_at"));
        complaint.setUpdatedAt(result.getString("updated_at"));
        complaint.setResolvedAt(result.getString("resolved_at"));
        complaint.setFeedbackSubmitted(
                result.getBoolean("feedback_submitted")
        );

        int feedbackRating = result.getInt("feedback_rating");
        complaint.setFeedbackRating(
                result.wasNull() ? null : feedbackRating
        );

        return complaint;
    }
}