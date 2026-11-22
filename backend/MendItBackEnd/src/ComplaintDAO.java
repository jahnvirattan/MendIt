
import java.sql.*;
import java.util.*;

public class ComplaintDAO {

    // Get all student complaints with actual student names
    public List<Map<String, Object>> getAllComplaints() {

        List<Map<String, Object>> complaints = new ArrayList<>();

        String sql = """
                SELECT c.*, u.full_name AS student_name
                FROM complaints c
                LEFT JOIN users u ON c.student_id = u.user_id
                ORDER BY c.submitted_at DESC
                """;

        try (
                Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> complaint = new HashMap<>();

                complaint.put("complaintId", rs.getInt("complaint_id"));
                complaint.put("studentId", rs.getInt("student_id"));
                complaint.put("studentName", rs.getString("student_name"));
                complaint.put("title", rs.getString("title"));
                complaint.put("description", rs.getString("description"));
                complaint.put("category", rs.getString("category"));
                complaint.put("building", rs.getString("building"));
                complaint.put("room", rs.getString("room_or_area"));
                complaint.put("priority", rs.getString("priority"));
                complaint.put("status", rs.getString("status"));
                complaint.put("adminNote", rs.getString("admin_note"));
                complaint.put("floor", rs.getString("floor"));
                complaint.put("photo_path", rs.getString("photo_path"));
                complaint.put("submitted_at",
                        rs.getTimestamp("submitted_at").toString());

                complaints.add(complaint);
            }

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
        }

        return complaints;
    }

    // Update complaint status
    public boolean updateStatus(int complaintId, String status) {
        String sql = "UPDATE complaints SET status=? WHERE complaint_id=?";

        try (
                Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, complaintId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }
    }

    // Update complaint priority
    public boolean updatePriority(int complaintId, String priority) {
        String sql = "UPDATE complaints SET priority=? WHERE complaint_id=?";

        try (
                Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, priority);
            ps.setInt(2, complaintId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }
    }

    // Add admin note
    public boolean addAdminNote(int complaintId, String note) {
        String sql = "UPDATE complaints SET admin_note=? WHERE complaint_id=?";

        try (
                Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, note);
            ps.setInt(2, complaintId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }
    }
}
