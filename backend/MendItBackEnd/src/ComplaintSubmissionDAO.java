import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class ComplaintSubmissionDAO {

    public int saveComplaint(StudentComplaint complaint)
            throws SQLException {

        if (complaint == null) {
            throw new IllegalArgumentException(
                    "Complaint details are required."
            );
        }

        String sql = """
                INSERT INTO complaints (
                    student_id,
                    title,
                    description,
                    category,
                    building,
                    floor,
                    room_or_area,
                    photo_path,
                    priority,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        complaint.setPriority("MEDIUM");
        complaint.setStatus("SUBMITTED");

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(
                     sql,
                     Statement.RETURN_GENERATED_KEYS
             )) {

            statement.setInt(1, complaint.getStudentId());
            statement.setString(2, complaint.getTitle());
            statement.setString(3, complaint.getDescription());
            statement.setString(4, complaint.getCategory());
            statement.setString(5, complaint.getBuilding());
            statement.setString(6, complaint.getFloor());
            statement.setString(7, complaint.getRoomOrArea());
            statement.setString(8, complaint.getPhotoPath());
            statement.setString(9, complaint.getPriority());
            statement.setString(10, complaint.getStatus());

            int rowsInserted = statement.executeUpdate();

            if (rowsInserted != 1) {
                throw new SQLException("Complaint was not saved.");
            }

            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                if (!generatedKeys.next()) {
                    throw new SQLException(
                            "Complaint ID was not generated."
                    );
                }

                int complaintId = generatedKeys.getInt(1);
                complaint.setComplaintId(complaintId);
                return complaintId;
            }
        }
    }
}
