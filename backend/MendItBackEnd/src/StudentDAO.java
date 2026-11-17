
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class StudentDAO {

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

    // Check whether roll number already exists
    public boolean checkRollNumberExists(String rollNumber)
            throws SQLException {

        String sql = "SELECT user_id FROM users WHERE roll_number = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, rollNumber);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    // Register a new student
    public boolean registerStudent(
            String fullName,
            String email,
            String hashedPassword,
            String rollNumber,
            String department,
            String mobile,
            int semester) throws SQLException {

        String sql = "INSERT INTO users "
                + "(full_name, email, password, role, roll_number, "
                + "department, mobile, semester) "
                + "VALUES (?, ?, ?, 'STUDENT', ?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, fullName);
            ps.setString(2, email);
            ps.setString(3, hashedPassword);
            ps.setString(4, rollNumber);
            ps.setString(5, department);
            ps.setString(6, mobile);
            ps.setInt(7, semester);

            return ps.executeUpdate() == 1;
        }
    }
}
