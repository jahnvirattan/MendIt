
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

public class Server {

    public static void main(String[] args) {

        try {
            HttpServer server = HttpServer.create(
                    new InetSocketAddress(8080), 0
            );

            server.createContext("/api", new Api());

            server.setExecutor(null);

            server.start();

            System.out.println("================================");
            System.out.println("       MENDIT BACKEND STARTED");
            System.out.println("================================");
            System.out.println("Server running at: http://localhost:8080");
            System.out.println("API available at: http://localhost:8080/api");
            System.out.println("================================");

        } catch (IOException e) {
            System.out.println("Could not start MendIt server.");
            e.printStackTrace();
        }
    }
}
