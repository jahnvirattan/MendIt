import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./MyComplaints.css";

const API_URL = "http://localhost:8080/api/student/complaints";

const statusLabels = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  IN_PROGRESS: "In Progress",
  ON_HOLD: "On Hold",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function getStudentId() {
  try {
    const student = JSON.parse(sessionStorage.getItem("student") || "null");
    return student?.user_id ?? student?.userId ?? student?.id ?? null;
  } catch {
    return null;
  }
}

function formatStatus(status) {
  return String(status || "SUBMITTED")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function normalizeComplaint(row) {
  return {
    id: row.complaintId ?? row.complaint_id ?? row.id,
    title: row.title || "",
    category: row.category || "",
    description: row.description || "",
    building: row.building || "",
    floor: row.floor || "",
    roomOrArea: row.roomOrArea || row.room_or_area || "",
    location: row.location || "",
    priority: String(row.priority || "MEDIUM").toUpperCase(),
    status: formatStatus(row.status),
    adminNote: row.adminNote || row.admin_note || "",
    submittedAt: row.submittedAt || row.submitted_at || "",
    updatedAt: row.updatedAt || row.updated_at || "",
    resolvedAt: row.resolvedAt || row.resolved_at || "",
  };
}

function getLocation(complaint) {
  if (complaint.location) {
    return complaint.location;
  }

  return [
    complaint.building,
    complaint.floor ? `${complaint.floor} Floor` : "",
    complaint.roomOrArea,
  ]
    .filter(Boolean)
    .join(" · ");
}

function getTimeline(complaint) {
  let steps = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED"];

  if (complaint.status === "ON_HOLD") {
    steps = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "IN_PROGRESS",
      "ON_HOLD",
      "RESOLVED",
    ];
  }

  if (complaint.status === "REJECTED") {
    steps = ["SUBMITTED", "UNDER_REVIEW", "REJECTED"];
  }

  const foundIndex = steps.indexOf(complaint.status);
  const currentIndex = foundIndex < 0 ? 0 : foundIndex;

  return steps.map((step, index) => {
    let state = "upcoming";

    if (index < currentIndex) {
      state = "done";
    } else if (index === currentIndex) {
      state = "current";
    }

    let date = "";

    if (step === "SUBMITTED") {
      date = formatDate(complaint.submittedAt);
    } else if (index === currentIndex) {
      date = formatDate(
        complaint.status === "RESOLVED"
          ? complaint.resolvedAt || complaint.updatedAt
          : complaint.updatedAt,
      );
    }

    return {
      label: statusLabels[step] || step,
      state,
      date,
    };
  });
}

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isPageOpen = true;

    async function loadComplaints() {
      setLoading(true);
      setError("");

      const studentId = getStudentId();

      if (!studentId) {
        if (isPageOpen) {
          setComplaints([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}?studentId=${encodeURIComponent(studentId)}`,
        );

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Could not load complaints.");
        }

        if (!Array.isArray(data.complaints)) {
          throw new Error("The complaints service is not available yet.");
        }

        if (isPageOpen) {
          setComplaints(data.complaints.map(normalizeComplaint));
        }
      } catch (requestError) {
        if (isPageOpen) {
          setError(requestError.message || "Could not load complaints.");
        }
      } finally {
        if (isPageOpen) {
          setLoading(false);
        }
      }
    }

    loadComplaints();

    return () => {
      isPageOpen = false;
    };
  }, [retryCount]);

  const visibleComplaints = complaints.filter((complaint) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Open" &&
        complaint.status !== "RESOLVED" &&
        complaint.status !== "REJECTED") ||
      (activeFilter === "Resolved" && complaint.status === "RESOLVED");

    const searchableText = [
      complaint.id,
      complaint.title,
      complaint.category,
      getLocation(complaint),
    ]
      .join(" ")
      .toLowerCase();

    return (
      matchesFilter &&
      searchableText.includes(searchText.trim().toLowerCase())
    );
  });

  const selectedComplaint =
    visibleComplaints.find(
      (complaint) => String(complaint.id) === String(selectedId),
    ) || visibleComplaints[0];

  const openCount = complaints.filter(
    (complaint) =>
      complaint.status !== "RESOLVED" && complaint.status !== "REJECTED",
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "RESOLVED",
  ).length;

  function getStatusClass(complaint) {
    return `status-${complaint.status.toLowerCase().replaceAll("_", "-")}`;
  }

  return (
    <main className="my-complaints-page">
      <div className="my-complaints-container">
        <header className="my-complaints-heading">
          <div>
            <span className="my-complaints-tag">STUDENT PORTAL</span>
            <h1>My Complaints</h1>
            <p>Follow your reports and check their latest status.</p>
          </div>

          <button
            className="my-complaints-new-button"
            type="button"
            onClick={() => navigate("/submitComplaint")}
          >
            <i className="fa-solid fa-plus"></i>
            Raise a Complaint
          </button>
        </header>

        <section className="complaint-summary">
          <div className="summary-card">
            <span className="summary-icon total-icon">
              <i className="fa-solid fa-clipboard-list"></i>
            </span>
            <div>
              <p>Total Complaints</p>
              <strong>{complaints.length}</strong>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon open-icon">
              <i className="fa-regular fa-clock"></i>
            </span>
            <div>
              <p>Open</p>
              <strong>{openCount}</strong>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon resolved-icon">
              <i className="fa-solid fa-circle-check"></i>
            </span>
            <div>
              <p>Resolved</p>
              <strong>{resolvedCount}</strong>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="complaints-message">
            <span className="loading-spinner"></span>
            <p>Loading your complaints…</p>
          </div>
        ) : error ? (
          <div className="complaints-message error-message">
            <i className="fa-solid fa-cloud-arrow-down"></i>
            <h2>We couldn’t load your complaints</h2>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <section className="complaints-empty-state">
            <span className="empty-state-icon">
              <i className="fa-regular fa-folder-open"></i>
            </span>
            <h2>No complaints yet</h2>
            <p>Your submitted complaints will appear here.</p>
          </section>
        ) : (
          <section className="complaints-workspace">
            <div className="complaints-list-panel">
              <div className="list-panel-heading">
                <div>
                  <span className="section-kicker">YOUR REPORTS</span>
                  <h2>Complaint history</h2>
                </div>
                <span className="record-count">
                  {visibleComplaints.length} shown
                </span>
              </div>

              <label className="complaint-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search title, category or ID"
                />
              </label>

              <div className="complaint-filters">
                {["All", "Open", "Resolved"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={activeFilter === filter ? "filter-active" : ""}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="complaint-list">
                {visibleComplaints.length === 0 ? (
                  <p className="empty-search">
                    No complaints match your search or filter.
                  </p>
                ) : (
                  visibleComplaints.map((complaint) => (
                    <button
                      key={complaint.id}
                      type="button"
                      className={`complaint-list-item ${
                        String(selectedComplaint?.id) === String(complaint.id)
                          ? "complaint-selected"
                          : ""
                      }`}
                      onClick={() => setSelectedId(complaint.id)}
                    >
                      <span className="complaint-item-icon">
                        <i className="fa-solid fa-screwdriver-wrench"></i>
                      </span>

                      <span className="complaint-item-info">
                        <span className="complaint-item-title">
                          {complaint.title}
                        </span>
                        <span className="complaint-item-meta">
                          #{complaint.id} · {complaint.category}
                        </span>
                        <span className="complaint-item-location">
                          <i className="fa-solid fa-location-dot"></i>
                          {getLocation(complaint)}
                        </span>
                      </span>

                      <span
                        className={`status-badge ${getStatusClass(complaint)}`}
                      >
                        {statusLabels[complaint.status] || complaint.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {selectedComplaint && (
              <aside className="complaint-detail-panel">
                <div className="detail-topline">
                  <span className="section-kicker">COMPLAINT DETAILS</span>
                  <span className="complaint-id">#{selectedComplaint.id}</span>
                </div>

                <div className="detail-title-row">
                  <div>
                    <h2>{selectedComplaint.title}</h2>
                    <p>{selectedComplaint.category}</p>
                  </div>
                  <span
                    className={`status-badge ${getStatusClass(selectedComplaint)}`}
                  >
                    {statusLabels[selectedComplaint.status] ||
                      selectedComplaint.status}
                  </span>
                </div>

                <div className="detail-facts">
                  <div>
                    <span className="fact-label">Location</span>
                    <strong>{getLocation(selectedComplaint)}</strong>
                  </div>
                  <div>
                    <span className="fact-label">Submitted</span>
                    <strong>{formatDate(selectedComplaint.submittedAt)}</strong>
                  </div>
                  <div>
                    <span className="fact-label">Priority</span>
                    <strong
                      className={`priority-${selectedComplaint.priority.toLowerCase()}`}
                    >
                      {selectedComplaint.priority}
                    </strong>
                  </div>
                </div>

                <div className="detail-description">
                  <h3>Issue reported</h3>
                  <p>{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.adminNote && (
                  <div className="admin-update">
                    <span className="admin-update-icon">
                      <i className="fa-solid fa-message"></i>
                    </span>
                    <div>
                      <h3>Latest update</h3>
                      <p>{selectedComplaint.adminNote}</p>
                    </div>
                  </div>
                )}

                <div className="timeline-section">
                  <h3>Status progress</h3>
                  <div className="complaint-timeline">
                    {getTimeline(selectedComplaint).map((step) => (
                      <div
                        className={`timeline-step timeline-${step.state}`}
                        key={step.label}
                      >
                        <span className="timeline-marker">
                          {step.state === "done" ? (
                            <i className="fa-solid fa-check"></i>
                          ) : step.state === "current" ? (
                            <i className="fa-solid fa-circle"></i>
                          ) : null}
                        </span>
                        <div className="timeline-copy">
                          <strong>{step.label}</strong>
                          {step.date && <span>{step.date}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyComplaints;