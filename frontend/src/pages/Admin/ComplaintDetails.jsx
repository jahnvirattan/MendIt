
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ComplaintDetails.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [status, setStatus] = useState("SUBMITTED");
  const [priority, setPriority] = useState("MEDIUM");
  const [adminNote, setAdminNote] = useState("");

  const [saving, setSaving] = useState(false);

  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  // Fetch the complete complaint using its ID from the URL
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/admin/complaints"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to fetch complaints."
          );
        }

        // Remove MD prefix if the URL contains an ID like MD12
        const requestedId = String(id).replace(/^MD/i, "");

        const foundComplaint = result.data.find(
          (item) => String(item.complaintId) === requestedId
        );

        if (!foundComplaint) {
          throw new Error("Complaint not found.");
        }

        // Convert backend field names into frontend field names
        const mappedComplaint = {
          complaint_id: foundComplaint.complaintId,
          student_id: foundComplaint.studentId,
          student_name: foundComplaint.studentName || "Unknown Student",
          title: foundComplaint.title,
          description: foundComplaint.description,
          category: foundComplaint.category,
          building: foundComplaint.building,
          room_or_area: foundComplaint.room,
          priority: foundComplaint.priority || "MEDIUM",
          status: foundComplaint.status || "SUBMITTED",
          admin_note: foundComplaint.adminNote || "",
          floor: foundComplaint.floor,
          photo_path: foundComplaint.photo_path,
          submitted_at: foundComplaint.submitted_at,
        };

        setComplaint(mappedComplaint);

        // Initialize the form values when the complaint is fetched
        setStatus(mappedComplaint.status);
        setPriority(mappedComplaint.priority);
        setAdminNote(mappedComplaint.admin_note);
      } catch (error) {
        console.error("Error fetching complaint:", error);
        setLoadError(error.message || "Unable to load complaint.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  // Fetch feedback after the complaint has loaded
  useEffect(() => {
    if (!complaint?.complaint_id) {
      return;
    }

    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/complaints/feedback?complaintId=${complaint.complaint_id}`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to fetch feedback."
          );
        }

        setFeedback(result.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackError(error.message || "Unable to fetch feedback.");
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedback();
  }, [complaint?.complaint_id]);

  const formatStatus = (value) => {
    return String(value || "SUBMITTED")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // Save status, priority and admin remarks
  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      // 1. Update complaint status
      const statusResponse = await fetch(
        "http://localhost:8080/api/admin/complaints/status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintId: complaint.complaint_id,
            status: status,
          }),
        }
      );

      const statusResult = await statusResponse.json();

      if (!statusResponse.ok || !statusResult.success) {
        throw new Error(
          statusResult.message || "Status update failed."
        );
      }

      // 2. Update complaint priority
      const priorityResponse = await fetch(
        "http://localhost:8080/api/admin/complaints/priority",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintId: complaint.complaint_id,
            priority: priority,
          }),
        }
      );

      const priorityResult = await priorityResponse.json();

      if (!priorityResponse.ok || !priorityResult.success) {
        throw new Error(
          priorityResult.message || "Priority update failed."
        );
      }

      // 3. Save admin remarks
      const noteResponse = await fetch(
        "http://localhost:8080/api/admin/complaints/note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaintId: complaint.complaint_id,
            adminNote: adminNote,
          }),
        }
      );

      const noteResult = await noteResponse.json();

      if (!noteResponse.ok || !noteResult.success) {
        throw new Error(
          noteResult.message || "Admin note update failed."
        );
      }

      // Update the complaint data for navigation
      const updatedComplaint = {
        ...complaint,
        status: status,
        priority: priority,
        admin_note: adminNote,
      };

      alert("Complaint details updated successfully!");

      navigate("/admin/complaints", {
        state: { updatedComplaint },
      });
    } catch (error) {
      console.error("Error updating complaint:", error);

      alert(
        error.message || "Something went wrong while saving changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="details-page">
        <div className="details-not-found">
          <h2>Loading complaint...</h2>
        </div>
      </div>
    );
  }

  // Complaint not found or loading failed
  if (!complaint) {
    return (
      <div className="details-page">
        <div className="details-not-found">
          <h2>Complaint not found</h2>
          <p>
            {loadError ||
              "Please open a complaint from the All Complaints page."}
          </p>

          <button onClick={() => navigate("/admin/complaints")}>
            Back to All Complaints
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <div className="details-container">
        <button
          className="back-button"
          onClick={() => navigate("/admin/complaints")}
        >
          ← Back to All Complaints
        </button>

        <header className="details-header">
          <div>
            <span className="details-tag">MENDIT · ADMIN PORTAL</span>
            <h1>Complaint Details</h1>
            <p>Review the complaint and update its progress.</p>
          </div>

          <span className="complaint-id">
            #{complaint.complaint_id}
          </span>
        </header>

        <div className="details-layout">
          <section className="details-card">
            <div className="details-card-heading">
              <div>
                <h2>{complaint.title}</h2>
                <p>Submitted by {complaint.student_name}</p>
              </div>

              <span
                className={`status-badge status-${status.toLowerCase()}`}
              >
                {formatStatus(status)}
              </span>
            </div>

            <div className="details-divider"></div>

            <h3>Complaint Information</h3>

            <div className="details-info-grid">
              <div className="info-item">
                <span>Complaint ID</span>
                <strong>#{complaint.complaint_id}</strong>
              </div>

              <div className="info-item">
                <span>Student Name</span>
                <strong>{complaint.student_name}</strong>
              </div>

              <div className="info-item">
                <span>Category</span>
                <strong>{complaint.category}</strong>
              </div>

              <div className="info-item">
                <span>Building</span>
                <strong>{complaint.building}</strong>
              </div>

              <div className="info-item">
                <span>Floor</span>
                <strong>{complaint.floor || "Not specified"}</strong>
              </div>

              <div className="info-item">
                <span>Room / Area</span>
                <strong>{complaint.room_or_area || "Not specified"}</strong>
              </div>

              <div className="info-item">
                <span>Submitted On</span>
                <strong>
                  {complaint.submitted_at || "Not available"}
                </strong>
              </div>

              <div className="info-item">
                <span>Priority</span>
                <strong>{priority}</strong>
              </div>
            </div>

            <div className="details-divider"></div>

            <h3>Problem Description</h3>

            <p className="complaint-description">
              {complaint.description || "No description provided."}
            </p>

            {complaint.photo_path && (
              <div className="complaint-photo-section">
                <h3>Attached Photo</h3>

                <img
                  src={`http://localhost:8080/${complaint.photo_path}`}
                  alt="Complaint attachment"
                  className="complaint-photo"
                />
              </div>
            )}

            <div className="student-feedback-section">
              <div className="details-divider"></div>

              <h3>Student Feedback</h3>

              {feedbackLoading ? (
                <p>Loading student feedback...</p>
              ) : feedbackError ? (
                <p>{feedbackError}</p>
              ) : feedback ? (
                <div className="feedback-content">
                  <div className="feedback-rating">
                    <span>Rating</span>

                    <strong>
                      {"★".repeat(
                        Math.max(0, Math.min(5, Number(feedback.rating) || 0))
                      )}
                      {"☆".repeat(
                        5 -
                          Math.max(
                            0,
                            Math.min(5, Number(feedback.rating) || 0)
                          )
                      )}
                    </strong>

                    <span>{feedback.rating}/5</span>
                  </div>

                  <div className="feedback-comment">
                    <span>Student Comment</span>
                    <p>
                      {feedback.comments?.trim() ||
                        "No written comment provided."}
                    </p>
                  </div>

                  <div className="feedback-date">
                    <span>Feedback Submitted On</span>
                    <strong>
                      {feedback.submittedAt || "Not available"}
                    </strong>
                  </div>
                </div>
              ) : (
                <p>No feedback submitted by the student yet.</p>
              )}
            </div>
          </section>

          <aside className="update-card">
            <div className="update-card-heading">
              <span className="update-icon">⚙</span>

              <div>
                <h2>Manage Complaint</h2>
                <p>Update complaint progress.</p>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="update-form-group">
                <label htmlFor="complaint-status">
                  Complaint Status
                </label>

                <select
                  id="complaint-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div className="update-form-group">
                <label htmlFor="complaint-priority">
                  Complaint Priority
                </label>

                <select
                  id="complaint-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="update-form-group">
                <label htmlFor="admin-note">
                  Admin Remarks
                </label>

                <textarea
                  id="admin-note"
                  rows="5"
                  placeholder="Write an update or remarks for this complaint..."
                  value={adminNote}
                  onChange={(event) => setAdminNote(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="save-details-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}

                {!saving && (
                  <i className="fa-solid fa-arrow-right"></i>
                )}
              </button>
            </form>

            <p className="update-note">
              Your changes are saved to the MendIt database.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;