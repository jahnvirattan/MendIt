import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.UUID;

public class ComplaintPhotoStorage {

    private static final long MAX_PHOTO_SIZE = 5L * 1024 * 1024;
    private static final String RELATIVE_FOLDER = "uploads/complaints/";

    private static final Path UPLOAD_DIRECTORY = Path.of(
            System.getProperty("user.dir"),
            "uploads",
            "complaints").toAbsolutePath().normalize();

    public String savePhoto(String dataUrl) throws IOException {
        if (dataUrl == null || dataUrl.isBlank()) {
            return null;
        }

        int commaIndex = dataUrl.indexOf(",");

        if (commaIndex < 0) {
            throw new IllegalArgumentException("Invalid photo data.");
        }

        String metadata = dataUrl.substring(0, commaIndex);
        String extension;

        switch (metadata) {
            case "data:image/png;base64":
                extension = ".png";
                break;
            case "data:image/jpeg;base64":
                extension = ".jpg";
                break;
            case "data:image/webp;base64":
                extension = ".webp";
                break;
            default:
                throw new IllegalArgumentException(
                        "Only PNG, JPEG, or WEBP photos are allowed.");
        }

        byte[] imageBytes;

        try {
            imageBytes = Base64.getDecoder().decode(
                    dataUrl.substring(commaIndex + 1));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("The selected photo is invalid.");
        }

        if (imageBytes.length == 0 || imageBytes.length > MAX_PHOTO_SIZE) {
            throw new IllegalArgumentException(
                    "Photo size must be between 1 byte and 5 MB.");
        }

        Files.createDirectories(UPLOAD_DIRECTORY);

        String fileName = UUID.randomUUID() + extension;
        Path destination = UPLOAD_DIRECTORY.resolve(fileName).normalize();

        Files.write(destination, imageBytes);

        return RELATIVE_FOLDER + fileName;
    }

    public void deletePhoto(String relativePath) throws IOException {
        if (relativePath == null
                || !relativePath.startsWith(RELATIVE_FOLDER)) {
            return;
        }

        String fileName = relativePath.substring(RELATIVE_FOLDER.length());

        if (fileName.contains("/")
                || fileName.contains("\\")
                || fileName.contains("..")) {
            return;
        }

        Path photo = UPLOAD_DIRECTORY.resolve(fileName).normalize();

        if (photo.startsWith(UPLOAD_DIRECTORY)) {
            Files.deleteIfExists(photo);
        }
    }

    public static Path getUploadDirectory() {
        return UPLOAD_DIRECTORY;
    }
}