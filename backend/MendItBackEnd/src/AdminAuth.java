
import java.util.HashMap;
import java.util.Map;

import org.mindrot.jbcrypt.BCrypt;

public class AdminAuth {

    private final AdminDAO adminDAO = new AdminDAO();

    private static final String INVITATION_CODE = "MENDIT-ADMIN-2026";

    public Map<String, Object> register(
            String fullName,
            String adminId,
            String email,
            String mobile,
            String designation,
            String invitationCode,
            String password) throws Exception {

        if (fullName == null || fullName.isBlank()
                || adminId == null || adminId.isBlank()
                || email == null || email.isBlank()
                || mobile == null || mobile.isBlank()
                || designation == null || designation.isBlank()
                || invitationCode == null || invitationCode.isBlank()
                || password == null || password.isBlank()) {

            return createResponse(400, false,
                    "Please fill all required fields.");
        }

        if (!INVITATION_CODE.equals(invitationCode)) {
            return createResponse(403, false,
                    "Invalid admin invitation code.");
        }

        if (adminDAO.checkEmailExists(email)) {
            return createResponse(409, false,
                    "Email is already registered.");
        }

        String hashedPassword =
                BCrypt.hashpw(password, BCrypt.gensalt());

        boolean registered = adminDAO.registerAdmin(
                fullName,
                adminId,
                email,
                mobile,
                designation,
                hashedPassword
        );

        if (registered) {
            return createResponse(201, true,
                    "Admin registered successfully.");
        }

        return createResponse(500, false,
                "Admin registration failed.");
    }

    public Map<String, Object> login(
            String email, String password) throws Exception {

        if (email == null || email.isBlank()
                || password == null || password.isBlank()) {
            return createResponse(400, false,
                    "Please enter email and password.");
        }

        AdminDAO.AdminData admin =
                adminDAO.findAdminByEmail(email);

        if (admin == null) {
            return createResponse(401, false,
                    "Invalid email or password.");
        }

        if (!BCrypt.checkpw(password, admin.hashedPassword)) {
            return createResponse(401, false,
                    "Invalid email or password.");
        }

        Map<String, Object> response = createResponse(
                200, true, "Admin login successful.");

        response.put("userId", admin.userId);
        response.put("fullName", admin.fullName);
        response.put("email", admin.email);
        response.put("role", admin.role);

        return response;
    }

    private Map<String, Object> createResponse(
            int status, boolean success, String message) {

        Map<String, Object> response = new HashMap<>();

        response.put("httpStatus", status);
        response.put("success", success);
        response.put("message", message);

        return response;
    }
}