
import java.sql.*;
import java.util.*;

public class AdminDashboard {

    // Get dashboard statistics
    public Map<String, Integer> getStatistics() throws SQLException {

        Map<String, Integer> stats = new HashMap<>();

        Connection con = DBConnection.getConnection();

        String sql = "SELECT " +
                "COUNT(*) AS total, " +
                "SUM(UPPER(status) = 'PENDING') AS pending, " +
                "SUM(UPPER(status) = 'IN PROGRESS') AS progress, " +
                "SUM(UPPER(status) = 'RESOLVED') AS resolved, " +
                "SUM(UPPER(priority) = 'HIGH' AND UPPER(status) != 'RESOLVED') AS highPriority, " +
                "SUM(UPPER(priority) = 'MEDIUM' AND UPPER(status) != 'RESOLVED') AS mediumPriority, " +
                "SUM(UPPER(priority) = 'LOW' AND UPPER(status) != 'RESOLVED') AS lowPriority, " +
                "SUM(UPPER(priority) = 'URGENT' AND UPPER(status) != 'RESOLVED') AS urgentPriority " +
                "FROM complaints";

        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();

        if (rs.next()) {

            stats.put("total", rs.getInt("total"));
            stats.put("pending", rs.getInt("pending"));
            stats.put("progress", rs.getInt("progress"));
            stats.put("resolved", rs.getInt("resolved"));

            stats.put("highPriority", rs.getInt("highPriority"));
            stats.put("mediumPriority", rs.getInt("mediumPriority"));
            stats.put("lowPriority", rs.getInt("lowPriority"));
            stats.put("urgentPriority", rs.getInt("urgentPriority"));
        }

        rs.close();
        ps.close();
        con.close();

        return stats;
    }


    // Get recent complaints
    public List<Map<String, Object>> getRecentComplaints()
            throws SQLException {

        List<Map<String, Object>> complaints = new ArrayList<>();

        Connection con = DBConnection.getConnection();

        String sql = "SELECT complaint_id, title, category, building, " +
                "floor, room_or_area, priority, status " +
                "FROM complaints ORDER BY submitted_at DESC LIMIT 5";

        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();

        while (rs.next()) {

            Map<String, Object> complaint = new HashMap<>();

            complaint.put("id", "MD" + rs.getInt("complaint_id"));
            complaint.put("title", rs.getString("title"));
            complaint.put("category", rs.getString("category"));

            String location = rs.getString("building");

            if (rs.getString("floor") != null
                    && !rs.getString("floor").isEmpty()) {
                location += " - " + rs.getString("floor");
            }

            location += " - " + rs.getString("room_or_area");

            complaint.put("location", location);
            complaint.put("priority", rs.getString("priority"));
            complaint.put("status", rs.getString("status"));

            complaints.add(complaint);
        }

        rs.close();
        ps.close();
        con.close();

        return complaints;
    }
}