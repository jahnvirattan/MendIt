public class StudentComplaint {

    private int complaintId;
    private int studentId;
    private String title;
    private String description;
    private String category;
    private String building;
    private String floor;
    private String roomOrArea;
    private String photoPath;
    private String priority;
    private String status;
    private String adminNote;
    private String submittedAt;
    private String updatedAt;
    private String resolvedAt;
    private boolean feedbackSubmitted;
    private Integer feedbackRating;

    public StudentComplaint() {
    }

    public StudentComplaint(
            int studentId,
            String title,
            String description,
            String category,
            String building,
            String floor,
            String roomOrArea,
            String photoPath
    ) {
        this.studentId = studentId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.building = building;
        this.floor = floor;
        this.roomOrArea = roomOrArea;
        this.photoPath = photoPath;
    }

    public int getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(int complaintId) {
        this.complaintId = complaintId;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getRoomOrArea() {
        return roomOrArea;
    }

    public void setRoomOrArea(String roomOrArea) {
        this.roomOrArea = roomOrArea;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(String resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public boolean isFeedbackSubmitted() {
        return feedbackSubmitted;
    }

    public void setFeedbackSubmitted(boolean feedbackSubmitted) {
        this.feedbackSubmitted = feedbackSubmitted;
    }

    public Integer getFeedbackRating() {
        return feedbackRating;
    }

    public void setFeedbackRating(Integer feedbackRating) {
        this.feedbackRating = feedbackRating;
    }
}