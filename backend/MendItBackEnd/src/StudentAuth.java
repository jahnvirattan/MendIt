import org.mindrot.jbcrypt.BCrypt;

public class StudentAuth {

    private final StudentDAO studentDAO;

    public StudentAuth() {
        this.studentDAO = new StudentDAO();
    }

    // Register a new student
    public boolean registerStudent(
            String fullName,
            String rollNumber,
            String email,
            String mobile,
            String department,
            int semester,
            String password
    ) throws Exception {

        // Validate required fields
        if (fullName == null || fullName.trim().isEmpty()
                || rollNumber == null || rollNumber.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || mobile == null || mobile.trim().isEmpty()
                || department == null || department.trim().isEmpty()
                || password == null || password.length() < 8) {

            throw new IllegalArgumentException(
                    "Please provide valid student details."
            );
        }

        if (semester < 1 || semester > 8) {
            throw new IllegalArgumentException(
                    "Semester must be between 1 and 8."
            );
        }

        if (!email.matches("^\\S+@\\S+\\.\\S+$")) {
            throw new IllegalArgumentException(
                    "Invalid email address."
            );
        }

        if (!mobile.matches("^\\d{10}$")) {
            throw new IllegalArgumentException(
                    "Mobile number must contain 10 digits."
            );
        }

        // Check duplicate email
        if (studentDAO.checkEmailExists(email.trim())) {
            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }

        // Check duplicate roll number
        if (studentDAO.checkRollNumberExists(rollNumber.trim())) {
            throw new IllegalArgumentException(
                    "Roll number is already registered."
            );
        }

        // Hash password using BCrypt
        String hashedPassword = BCrypt.hashpw(
                password,
                BCrypt.gensalt(12)
        );

        // Save student in database
        return studentDAO.registerStudent(
                fullName.trim(),
                email.trim(),
                hashedPassword,
                rollNumber.trim(),
                department,
                mobile,
                semester
        );
    }

    // Student Login
    public StudentDAO.StudentLoginData loginStudent(
            String rollNumber,
            String password
    ) throws Exception {

        // Validate input
        if (rollNumber == null || rollNumber.trim().isEmpty()
                || password == null || password.isEmpty()) {

            throw new IllegalArgumentException(
                    "Roll number and password are required."
            );
        }

        // Find student using roll number
        StudentDAO.StudentLoginData student =
                studentDAO.findStudentByRollNumber(rollNumber.trim());

        // Check whether student exists
        if (student == null) {
            throw new IllegalArgumentException(
                    "Invalid roll number or password."
            );
        }

        // Verify password using BCrypt
        boolean passwordMatches = BCrypt.checkpw(
                password,
                student.hashedPassword
        );

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid roll number or password."
            );
        }

        // Return student details after successful login
        return student;
    }

}