
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/mendit_db";

    public static Connection getConnection() throws SQLException {

        String user = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");

        if (user == null || password == null) {
            throw new SQLException("Database credentials are not configured.");
        }

        return DriverManager.getConnection(URL, user, password);
    }
}


