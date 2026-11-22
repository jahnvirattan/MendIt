
import java.sql.*;

public class AdminProfileDAO {

    public static class AdminProfileData {
        public int userId;
        public String fullName;
        public String adminId;
        public String email;
        public String mobile;
        public String designation;
    }

    // Fetch admin details from database
    public AdminProfileData getAdminDetails(int userId)
            throws SQLException {

        String sql = "SELECT user_id, full_name, admin_id, email, mobile, designation "
                + "FROM users WHERE user_id = ? AND role = 'ADMIN'";

        try (Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {
                    AdminProfileData admin = new AdminProfileData();

                    admin.userId = rs.getInt("user_id");
                    admin.fullName = rs.getString("full_name");
                    admin.adminId = rs.getString("admin_id");
                    admin.email = rs.getString("email");
                    admin.mobile = rs.getString("mobile");
                    admin.designation = rs.getString("designation");

                    return admin;
                }
            }
        }

        return null;
    }

    // Update editable admin details
    public boolean updateAdminProfile(
            int userId,
            String fullName,
            String mobile,
            String designation) throws SQLException {

        String sql = "UPDATE users "
                + "SET full_name = ?, mobile = ?, designation = ? "
                + "WHERE user_id = ? AND role = 'ADMIN'";

        try (Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, fullName);
            ps.setString(2, mobile);
            ps.setString(3, designation);
            ps.setInt(4, userId);

            int rowsUpdated = ps.executeUpdate();

            return rowsUpdated > 0;
        }
    }
}
