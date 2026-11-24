
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllComplaints.css";

function AllComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Fetch complaints from Java backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/api/admin/complaints"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch complaints.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Failed to load complaints.");
        }

        // Convert Java response fields into React-friendly fields
        const formattedComplaints = result.data.map((complaint) => ({
          complaint_id: complaint.complaintId,
          student_id: complaint.studentId,
          student_name: complaint.studentName || `Student #${complaint.studentId}`,
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          building: complaint.building,
          room_or_area: complaint.room,
          priority: complaint.priority,
          status: complaint.status,
          admin_note: complaint.adminNote,
          floor: complaint.floor,
          photo_path: complaint.photo_path,
          submitted_at: complaint.submitted_at,
        }));

        setComplaints(formattedComplaints);

      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Search and filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        String(complaint.complaint_id).includes(search) ||
        complaint.title.toLowerCase().includes(search) ||
        complaint.student_name.toLowerCase().includes(search) ||
        complaint.category.toLowerCase().includes(search) ||
        complaint.building.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, searchTerm, statusFilter, priorityFilter]);

  const formatStatus = (status) =>
    status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

  const formatPriority = (priority) =>
    priority.charAt(0) + priority.slice(1).toLowerCase();

  // Open individual complaint details
  const openComplaint = (complaint) => {
    navigate(`/admin/complaints/${complaint.complaint_id}`, {
      state: { complaint },
    });
  };

  return (
    <div className="all-complaints-page">
      <header className="complaints-header">
        <div>
          <span className="admin-page-tag">MENDIT · ADMIN PORTAL</span>
          <h1>All Complaints</h1>
          <p>Review, manage and keep track of campus complaints.</p>
        </div>

        <div className="admin-header-icon">🔧</div>
      </header>

      <section className="complaints-list-panel">
        <div className="complaints-list-heading">
          <div>
            <h2>Complaint Records</h2>
            <p>View and manage complaints submitted by students.</p>
          </div>

          <span className="records-count">
            {filteredComplaints.length} records
          </span>
        </div>

        <div className="complaint-toolbar">
          <div className="complaint-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search by ID, title, student or location..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            aria-label="Filter by priority"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="complaints-table-wrapper">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Student</th>
                <th>Category & Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="no-complaints">
                    Loading complaints...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="no-complaints">
                    {error}
                  </td>
                </tr>
              ) : filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.complaint_id}>
                    <td>
                      <div className="complaint-title-cell">
                        <strong>{complaint.title}</strong>
                        <span>#{complaint.complaint_id}</span>
                      </div>
                    </td>

                    <td>{complaint.student_name}</td>

                    <td>
                      <div className="complaint-location-cell">
                        <strong>{complaint.category}</strong>
                        <span>
                          {complaint.building} · {complaint.room_or_area}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`priority-badge priority-${complaint.priority.toLowerCase()}`}
                      >
                        {formatPriority(complaint.priority)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${complaint.status.toLowerCase()}`}
                      >
                        {formatStatus(complaint.status)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-complaint-button"
                        onClick={() => openComplaint(complaint)}
                      >
                        View Details <span>→</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-complaints">
                    No complaints match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AllComplaints;
