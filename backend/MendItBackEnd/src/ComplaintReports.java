
import java.sql.*;
import java.util.*;

public class ComplaintReports {

    // Category-wise complaint count
    public List<Map<String, Object>> getCategoryReports()
            throws SQLException {

        List<Map<String, Object>> reports = new ArrayList<>();

        Connection con = DBConnection.getConnection();

        String sql = "SELECT category, COUNT(*) AS total " +
                     "FROM complaints GROUP BY category";

        Statement st = con.createStatement();
        ResultSet rs = st.executeQuery(sql);

        while (rs.next()) {

            Map<String, Object> report = new HashMap<>();

            report.put("name", rs.getString("category"));
            report.put("count", rs.getInt("total"));

            reports.add(report);
        }

        con.close();

        return reports;
    }

    // Status-wise complaint count
    public List<Map<String, Object>> getStatusReports()
            throws SQLException {

        List<Map<String, Object>> reports = new ArrayList<>();

        Connection con = DBConnection.getConnection();

        String sql = "SELECT status, COUNT(*) AS total " +
                     "FROM complaints GROUP BY status";

        Statement st = con.createStatement();
        ResultSet rs = st.executeQuery(sql);

        while (rs.next()) {

            Map<String, Object> report = new HashMap<>();

            report.put("status", rs.getString("status"));
            report.put("count", rs.getInt("total"));

            reports.add(report);
        }

        con.close();

        return reports;
    }
}