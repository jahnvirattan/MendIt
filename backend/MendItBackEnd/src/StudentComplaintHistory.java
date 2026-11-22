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
                SELECT complaint_id, student_id, title, description,
                       category, building, floor, room_or_area,
                       photo_path, priority, status, admin_note,
                       submitted_at, updated_at, resolved_at
                FROM complaints
                WHERE student_id = ?
                ORDER BY submitted_at DESC
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
                SELECT complaint_id, student_id, title, description,
                       category, building, floor, room_or_area,
                       photo_path, priority, status, admin_note,
                       submitted_at, updated_at, resolved_at
                FROM complaints
                WHERE student_id = ? AND complaint_id = ?
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

        return complaint;
    }
}