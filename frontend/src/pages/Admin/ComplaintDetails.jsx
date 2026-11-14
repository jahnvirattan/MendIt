
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ComplaintDetails.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
function ComplaintDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const complaint = location.state?.complaint;

  const [status, setStatus] = useState(complaint?.status || "SUBMITTED");
  const [priority, setPriority] = useState(complaint?.priority || "MEDIUM");
  const [adminNote, setAdminNote] = useState(complaint?.admin_note || "");

  if (!complaint) {
    return (
      <div className="details-page">
        <div className="details-not-found">
          <h2>Complaint not found</h2>
          <p>Please open a complaint from the All Complaints page.</p>
          <button onClick={() => navigate("/admin/complaints")}>
            Back to All Complaints
          </button>
        </div>
      </div>
    );
  }

  const formatStatus = (value) =>
    value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  const handleSave = (event) => {
    event.preventDefault();

    // Temporary frontend save.
    // Later, this will update the complaint through the Java backend.
    alert("Complaint details updated successfully!");
  };

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

          {/* Complaint information */}
          <section className="details-card">
            <div className="details-card-heading">
              <div>
                <h2>{complaint.title}</h2>
                <p>Submitted by {complaint.student_name}</p>
              </div>

              <span className={`status-badge status-${status.toLowerCase()}`}>
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
                <strong>{complaint.room_or_area}</strong>
              </div>

              <div className="info-item">
                <span>Submitted On</span>
                <strong>{complaint.submitted_at}</strong>
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
                  src={complaint.photo_path}
                  alt="Complaint attachment"
                  className="complaint-photo"
                />
              </div>
            )}
          </section>

          {/* Admin update panel */}
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

              <button type="submit" className="save-details-button">
                Save Changes <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>

            <p className="update-note">
              Changes are currently temporary and will be connected to the
              database during backend integration.
            </p>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default ComplaintDetails;
