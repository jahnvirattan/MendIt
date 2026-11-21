
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [search, setSearch] = useState("");

  const [complaints, setComplaints] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    urgentPriority: 0,
  });

  const [categoryCounts, setCategoryCounts] = useState([]);

  // Fetch dashboard data from Java backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const statsResponse = await fetch(
          "http://localhost:8080/api/admin/dashboard"
        );

        // Fetch recent complaints
        const complaintsResponse = await fetch(
          "http://localhost:8080/api/admin/recent-complaints"
        );

        // Fetch category reports
        const categoryResponse = await fetch(
          "http://localhost:8080/api/admin/reports/categories"
        );

        const statsData = await statsResponse.json();
        const complaintsData = await complaintsResponse.json();
        const categoryData = await categoryResponse.json();

        if (
          !statsResponse.ok ||
          !complaintsResponse.ok ||
          !categoryResponse.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        if (
          !statsData.success ||
          !complaintsData.success ||
          !categoryData.success
        ) {
          throw new Error("Backend could not return dashboard data");
        }

        setStats({
          ...statsData.data,
          urgentPriority: statsData.data.urgentPriority || 0,
        });

        setComplaints(complaintsData.data);
        setCategoryCounts(categoryData.data);

      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Dashboard statistics
  const total = stats.total;
  const pending = stats.pending;
  const progress = stats.progress;
  const resolved = stats.resolved;

  // Priority statistics
  const highPriority = stats.highPriority;
  const mediumPriority = stats.mediumPriority;
  const lowPriority = stats.lowPriority;
  const urgentPriority = stats.urgentPriority;

  // Search complaints
  const filteredComplaints = complaints.filter((c) =>
    `${c.id} ${c.title} ${c.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sample activity
  const activities = [
    {
      icon: "＋",
      title: "New complaint submitted",
      detail: "Recent complaint activity",
      time: "Recently",
      type: "blue",
    },
    {
      icon: "↻",
      title: "Complaint under progress",
      detail: "Complaint status updated",
      time: "Recently",
      type: "gold",
    },
    {
      icon: "✓",
      title: "Complaint resolved",
      detail: "Complaint marked as resolved",
      time: "Recently",
      type: "green",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* Hero */}
      <section className="admin-hero">
        <div className="admin-hero-content">
          <p className="admin-hero-label">
            MENDIT ADMINISTRATION
          </p>

          <h1>
            A Better Campus,
            <br />
            <span>A Better Experience.</span>
          </h1>

          <p className="admin-hero-description">
            Manage campus complaints, monitor progress and help
            create a cleaner, safer campus.
          </p>

          <Link to="/admin/complaints" className="admin-hero-button">
            Manage Complaints <span>→</span>
          </Link>
        </div>

        <div className="admin-hero-art">
          <div className="hero-circle circle-one"></div>
          <div className="hero-circle circle-two"></div>

          <div className="hero-emblem">
            <span>✦</span>
          </div>

          <p>REPORT · TRACK · RESOLVE</p>
        </div>
      </section>

      <main className="admin-dashboard-content">

        {/* Overview */}
        <section>
          <div className="section-heading">
            <p className="section-eyebrow">CAMPUS ACTIVITY</p>
            <h2>Dashboard Overview</h2>
            <p>Here's what's happening with campus complaints.</p>
          </div>

          <div className="admin-stats-grid">

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div className="admin-stat-icon blue">▤</div>
                <span className="stat-arrow">↗</span>
              </div>
              <p>Total Complaints</p>
              <h2>{total}</h2>
              <span className="stat-description">
                All reported issues
              </span>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div className="admin-stat-icon gold">◷</div>
                <span className="stat-arrow">↗</span>
              </div>
              <p>Pending</p>
              <h2>{pending}</h2>
              <span className="stat-description">
                Awaiting attention
              </span>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div className="admin-stat-icon blue">↻</div>
                <span className="stat-arrow">↗</span>
              </div>
              <p>In Progress</p>
              <h2>{progress}</h2>
              <span className="stat-description">
                Currently being resolved
              </span>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div className="admin-stat-icon green">✓</div>
                <span className="stat-arrow">↗</span>
              </div>
              <p>Resolved</p>
              <h2>{resolved}</h2>
              <span className="stat-description">
                Successfully completed
              </span>
            </div>

          </div>
        </section>

        {/* Action Banner */}
        <section className="admin-action-banner">
          <div className="admin-action-icon">✦</div>

          <div className="admin-action-text">
            <p>TAKE THE LEAD</p>
            <h3>Campus issues need your attention?</h3>
            <span>
              Review reported issues and help get them resolved faster.
            </span>
          </div>

          <Link to="/admin/complaints" className="admin-action-button">
            View Complaints <span>→</span>
          </Link>
        </section>

        {/* Priority Overview */}
        <section className="admin-priority-section">
          <div className="section-heading">
            <p className="section-eyebrow">ATTENTION REQUIRED</p>
            <h2>Complaint Priorities</h2>
            <p>Overview of unresolved complaints by priority.</p>
          </div>

          <div className="priority-grid">

            <div className="priority-card">
              <div className="priority-heading">
                <span className="priority-dot high"></span>
                High Priority
              </div>
              <h2>{highPriority}</h2>
              <p>Requires immediate attention</p>
            </div>

            <div className="priority-card">
              <div className="priority-heading">
                <span className="priority-dot medium"></span>
                Medium Priority
              </div>
              <h2>{mediumPriority}</h2>
              <p>Needs timely resolution</p>
            </div>

            <div className="priority-card">
              <div className="priority-heading">
                <span className="priority-dot low"></span>
                Low Priority
              </div>
              <h2>{lowPriority}</h2>
              <p>Can be handled routinely</p>
            </div>

            <div className="priority-card">
              <div className="priority-heading">
                <span className="priority-dot urgent"></span>
                Urgent Priority
              </div>
              <h2>{urgentPriority}</h2>
              <p>Requires immediate action</p>
            </div>

          </div>
        </section>

        {/* Category Breakdown */}
        <section className="admin-category-section">
          <div className="section-heading">
            <p className="section-eyebrow">ISSUE DISTRIBUTION</p>
            <h2>Complaint Categories</h2>
            <p>Breakdown of reported campus issues.</p>
          </div>

          <div className="category-card">

            {categoryCounts.map((category) => (
              <div className="category-item" key={category.name}>
                <div className="category-info">
                  <span>{category.name}</span>
                  <span>{category.count}</span>
                </div>

                <div className="category-track">
                  <div
                    className="category-fill"
                    style={{
                      width: total
                        ? `${(category.count / total) * 100}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Recent Complaints */}
        <section className="admin-recent-section">

          <div className="admin-recent-heading">
            <div>
              <p className="section-eyebrow">LATEST UPDATES</p>
              <h2>Recent Complaints</h2>
              <p>Keep track of the latest campus maintenance requests.</p>
            </div>

            <Link to="/admin/complaints" className="admin-view-all">
              View All →
            </Link>
          </div>

          <div className="admin-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search complaint ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-complaints-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="admin-id">{complaint.id}</td>
                    <td className="admin-title">{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.location}</td>

                    <td>
                      <span
                        className={`priority-badge ${complaint.priority.toLowerCase()}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-status ${complaint.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td>
                      <Link
                        to={`/admin/complaints/${complaint.id}`}
                        className="admin-view-link"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredComplaints.length === 0 && (
                  <tr>
                    <td colSpan="7" className="admin-empty">
                      No complaints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

        {/* Recent Activity */}
        <section className="admin-activity-section">

          <div className="section-heading">
            <p className="section-eyebrow">WHAT'S HAPPENING</p>
            <h2>Recent Activity</h2>
            <p>A quick look at complaint updates.</p>
          </div>

          <div className="activity-card">
            {activities.map((activity, index) => (
              <div className="activity-item" key={index}>
                <div className={`activity-icon ${activity.type}`}>
                  {activity.icon}
                </div>

                <div className="activity-details">
                  <h4>{activity.title}</h4>
                  <p>{activity.detail}</p>
                </div>

                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>

        </section>

        {/* Footer */}
        <footer className="admin-dashboard-footer">
          <span>MendIt · Report. Track. Resolve.</span>
          <span>Admin Dashboard</span>
        </footer>

      </main>
    </div>
  );
}

export default AdminDashboard;