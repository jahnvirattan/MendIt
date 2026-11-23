import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class FeedbackDAO {

    public boolean saveFeedback(
            int studentId,
            int complaintId,
            int rating,
            String comments
    ) throws SQLException {

        String sql = """
                INSERT INTO feedback (complaint_id, rating, comments)
                SELECT c.complaint_id, ?, ?
                FROM complaints c
                WHERE c.complaint_id = ?
                  AND c.student_id = ?
                  AND c.status = 'RESOLVED'
                  AND NOT EXISTS (
                      SELECT 1
                      FROM feedback f
                      WHERE f.complaint_id = c.complaint_id
                  )
                """;

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, rating);
            statement.setString(2, comments);
            statement.setInt(3, complaintId);
            statement.setInt(4, studentId);

            return statement.executeUpdate() == 1;
        }
    }
}