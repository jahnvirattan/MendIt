
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllComplaints.css";

// Temporary sample data.
// Later, we'll replace this with complaints from the Java backend.
const sampleComplaints = [
  {
    complaint_id: 1024,
    student_name: "Aarav Sharma",
    title: "Leaking tap in Block B",
    category: "Plumbing",
    building: "Block B",
    floor: "2nd Floor",
    room_or_area: "Washroom",
    priority: "HIGH",
    status: "IN_PROGRESS",
    submitted_at: "2026-11-14",
  },
  {
    complaint_id: 1023,
    student_name: "Priya Verma",
    title: "Flickering lights in Library",
    category: "Electrical",
    building: "Central Library",
    floor: "1st Floor",
    room_or_area: "Reading Hall",
    priority: "MEDIUM",
    status: "UNDER_REVIEW",
    submitted_at: "2026-11-13",
  },
  {
    complaint_id: 1018,
    student_name: "Rohan Mehta",
    title: "AC not working in Seminar Hall",
    category: "Electrical",
    building: "Academic Block",
    floor: "Ground Floor",
    room_or_area: "Seminar Hall",
    priority: "URGENT",
    status: "RESOLVED",
    submitted_at: "2026-11-12",
  },
  {
    complaint_id: 1017,
    student_name: "Meera Singh",
    title: "Broken classroom window",
    category: "Infrastructure",
    building: "Block A",
    floor: "3rd Floor",
    room_or_area: "Room 305",
    priority: "LOW",
    status: "SUBMITTED",
    submitted_at: "2026-11-11",
  },
  {
    complaint_id: 1015,
    student_name: "Kabir Malhotra",
    title: "Water cooler not working",
    category: "Water Supply",
    building: "Block C",
    floor: "Ground Floor",
    room_or_area: "Near Room 012",
    priority: "HIGH",
    status: "ON_HOLD",
    submitted_at: "2026-11-10",
  },
];

function AllComplaints() {
  const navigate = useNavigate();

  const [complaints] = useState(sampleComplaints);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

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
              {filteredComplaints.length > 0 ? (
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
                      <span className={`priority-badge priority-${complaint.priority.toLowerCase()}`}>
                        {formatPriority(complaint.priority)}
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge status-${complaint.status.toLowerCase()}`}>
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
