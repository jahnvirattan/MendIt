
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AdminDAO {

    public static class AdminData {
        public int userId;
        public String fullName;
        public String email;
        public String hashedPassword;
        public String role;
    }

    // Check whether email already exists
    public boolean checkEmailExists(String email) throws SQLException {

        String sql = "SELECT user_id FROM users WHERE email = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    // Register a new admin
    public boolean registerAdmin(
            String fullName,
            String adminId,
            String email,
            String mobile,
            String designation,
            String hashedPassword) throws SQLException {

        String sql = "INSERT INTO users "
                + "(full_name, admin_id, email, mobile, designation, password, role) "
                + "VALUES (?, ?, ?, ?, ?, ?, 'ADMIN')";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, fullName);
            ps.setString(2, adminId);
            ps.setString(3, email);
            ps.setString(4, mobile);
            ps.setString(5, designation);
            ps.setString(6, hashedPassword);

            return ps.executeUpdate() == 1;
        }
    }

    // Find admin using email
    public AdminData findAdminByEmail(String email) throws SQLException {

        String sql = "SELECT user_id, full_name, email, password, role "
                + "FROM users WHERE email = ? AND role = 'ADMIN'";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {

                    AdminData admin = new AdminData();

                    admin.userId = rs.getInt("user_id");
                    admin.fullName = rs.getString("full_name");
                    admin.email = rs.getString("email");
                    admin.hashedPassword = rs.getString("password");
                    admin.role = rs.getString("role");

                    return admin;
                }
            }
        }

        return null;
    }
}
