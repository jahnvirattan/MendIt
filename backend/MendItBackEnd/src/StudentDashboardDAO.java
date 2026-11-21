import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StudentDashboardDAO {

    public Map<String, Object> getDashboardStats(int studentId)
            throws SQLException {

        Map<String, Object> stats = new HashMap<>();

        String sql = """
                SELECT
                    COUNT(*) AS total_complaints,
                    SUM(CASE
                        WHEN status IN ('SUBMITTED', 'UNDER_REVIEW', 'ON_HOLD')
                        THEN 1 ELSE 0
                    END) AS pending,
                    SUM(CASE
                        WHEN status = 'IN_PROGRESS'
                        THEN 1 ELSE 0
                    END) AS in_progress,
                    SUM(CASE
                        WHEN status = 'RESOLVED'
                        THEN 1 ELSE 0
                    END) AS resolved
                FROM complaints
                WHERE student_id = ?
                """;

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql)) {

            statement.setInt(1, studentId);

            try (ResultSet result = statement.executeQuery()) {
                if (result.next()) {
                    stats.put("totalComplaints",
                            result.getInt("total_complaints"));
                    stats.put("pending",
                            result.getInt("pending"));
                    stats.put("inProgress",
                            result.getInt("in_progress"));
                    stats.put("resolved",
                            result.getInt("resolved"));
                }
            }
        }

        return stats;
    }
    public Map<String, Object> getStudentDetails(int studentId)
        throws SQLException {

    Map<String, Object> student = new HashMap<>();

    String sql = """
            SELECT user_id, full_name, email, roll_number,
                   department, mobile, semester
            FROM users
            WHERE user_id = ?
            """;

    try (Connection connection = DBConnection.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {

        statement.setInt(1, studentId);

        try (ResultSet result = statement.executeQuery()) {
            if (result.next()) {
                student.put("userId", result.getInt("user_id"));
                student.put("fullName", result.getString("full_name"));
                student.put("email", result.getString("email"));
                student.put("rollNumber", result.getString("roll_number"));
                student.put("department", result.getString("department"));
                student.put("mobile", result.getString("mobile"));
                student.put("semester", result.getInt("semester"));
            }
        }
    }

    return student;
}
public List<Map<String, Object>> getRecentComplaints(int studentId)
        throws SQLException {

    List<Map<String, Object>> complaints = new ArrayList<>();

    String sql = """
            SELECT complaint_id, title, category, building,
                   floor, room_or_area, status, submitted_at
            FROM complaints
            WHERE student_id = ?
            ORDER BY submitted_at DESC
            LIMIT 3
            """;

    try (Connection connection = DBConnection.getConnection();
         PreparedStatement statement = connection.prepareStatement(sql)) {

        statement.setInt(1, studentId);

        try (ResultSet result = statement.executeQuery()) {
            while (result.next()) {
                Map<String, Object> complaint = new HashMap<>();

                int complaintId = result.getInt("complaint_id");

                complaint.put("complaintId", complaintId);
                complaint.put("complaintCode",
                        String.format("MEND-%04d", complaintId));
                complaint.put("title", result.getString("title"));
                complaint.put("category", result.getString("category"));
                complaint.put("building", result.getString("building"));
                complaint.put("floor", result.getString("floor"));
                complaint.put("roomOrArea",
                        result.getString("room_or_area"));
                complaint.put("status", result.getString("status"));
                complaint.put("submittedAt",
                        result.getTimestamp("submitted_at").toString());

                complaints.add(complaint);
            }
        }
    }

    return complaints;
}
}