
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import io.github.cdimascio.dotenv.Dotenv;

public class DBConnection {

    // Load .env from the parent folder of src
    private static final Dotenv dotenv = Dotenv.configure()
            .directory("backend/MendItBackEnd")
            .ignoreIfMissing()
            .load();

    private static final String URL = "jdbc:mysql://localhost:3306/mendit_db";

    public static Connection getConnection() throws SQLException {

        String user = dotenv.get("DB_USER");
        String password = dotenv.get("DB_PASSWORD");

        if (user == null || password == null) {
            throw new SQLException("Database credentials are not configured in .env");
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC driver not found.", e);
        }

        return DriverManager.getConnection(URL, user, password);
    }
}
