import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: "📋",
      title: "Total Complaints",
      count: 12,
      description: "Complaints submitted",
      className: "total",
    },
    {
      icon: "⏳",
      title: "Pending",
      count: 3,
      description: "Awaiting attention",
      className: "pending",
    },
    {
      icon: "🔧",
      title: "In Progress",
      count: 4,
      description: "Currently being resolved",
      className: "progress",
    },
    {
      icon: "✓",
      title: "Resolved",
      count: 5,
      description: "Successfully completed",
      className: "resolved",
    },
  ];
  const recentComplaints = [
    {
      id: "MEND-0008",
      title: "Projector not working",
      location: "Block A · Classroom 204",
      icon: "📽️",
      status: "In Progress",
      statusClass: "in-progress",
    },
    {
      id: "MEND-0005",
      title: "Leaking tap",
      location: "Block B · Washroom",
      icon: "🚰",
      status: "Resolved",
      statusClass: "resolved",
    },
    {
      id: "MEND-0003",
      title: "Wi-Fi not working",
      location: "Block C · Library",
      icon: "📶",
      status: "Resolved",
      statusClass: "resolved",
    },
  ];
  const studentName = "Akanksha";

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
        ? "Good afternoon"
        : "Good evening";
  return (
    <div className="student-dashboard">
      {/* Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-label">🌿 WELCOME TO MENDIT</span>

          <h1>
            {greeting}, <span>{studentName}!</span>
          </h1>

          <p>Your campus, your voice. Let's make it better.</p>

          <button
            className="hero-button"
            onClick={() => navigate("/submitComplaint")}
          >
            Submit a Complaint <span>→</span>
          </button>
        </div>

        <div className="hero-decoration">
          <div className="hero-circle circle-one"></div>
          <div className="hero-circle circle-two"></div>
          <div className="hero-icon">🌱</div>
          <span className="hero-decoration-text">
            REPORT · RESOLVE · FEEL BETTER
          </span>
        </div>
      </section>

      {/* Dashboard Heading */}
      <section className="dashboard-overview">
        <div>
          <span className="section-label">YOUR ACTIVITY</span>
          <h2>Dashboard Overview</h2>
          <p>Here's what's happening with your complaints.</p>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="stats-grid">
        {stats.map((stat) => (
          <div className={`stat-card ${stat.className}`} key={stat.title}>
            <div className="stat-top">
              <div className="stat-icon">{stat.icon}</div>
              <span className="stat-arrow">↗</span>
            </div>

            <h3>{stat.title}</h3>

            <div className="stat-count">{stat.count}</div>

            <p>{stat.description}</p>
          </div>
        ))}
      </section>

      {/* Complaint CTA */}
      <section className="complaint-cta">
        <div className="cta-icon">✦</div>

        <div className="cta-content">
          <span>MAKE A DIFFERENCE</span>
          <h2>Spotted something that needs fixing?</h2>
          <p>
            Don't ignore it. Report campus issues and help us make your
            surroundings cleaner and safer.
          </p>
        </div>

        <button
          className="cta-button"
          onClick={() => navigate("/submitComplaint")}
        >
          + Submit a Complaint
        </button>
      </section>
      {/* Recent Complaints Section */}

      <section className="recent-complaints">
        <div className="recent-header">
          <div>
            <span className="section-label">YOUR REPORTS</span>
            <h2>Recent Complaints</h2>
            <p>Keep track of the issues you have reported.</p>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/myComplaints")}
          >
            View All Complaints →
          </button>
        </div>

        <div className="complaints-list">
          {recentComplaints.map((complaint) => (
            <div className="complaint-item" key={complaint.id}>
              <div className="complaint-item-icon">{complaint.icon}</div>

              <div className="complaint-item-info">
                <h3>{complaint.title}</h3>
                <p>
                  {complaint.location} · #{complaint.id}
                </p>
              </div>

              <span className={`complaint-status ${complaint.statusClass}`}>
                {complaint.status}
              </span>

              <button
                className="complaint-arrow"
                onClick={() => navigate("/myComplaints")}
                aria-label={`Track ${complaint.id}`}
              >
                ›
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Complaint Progress Tracker */}

      <section className="progress-tracker">
        <div className="tracker-header">
          <div>
            <h2>Complaint Progress Tracker</h2>
            <p>MEND-0008 · Projector not working</p>
          </div>
          <button
            className="track-button"
            onClick={() => navigate("/myComplaints")}
          >
            Track Your Complaint
          </button>
        </div>

        <div className="progress-steps">
          <div className="progress-step completed">
            <div className="step-circle">✓</div>

            <h3>Submitted</h3>

            <p>Complaint successfully received</p>
          </div>

          <div className="progress-step completed">
            <div className="step-circle">✓</div>

            <h3>Under Review</h3>

            <p>Admin has reviewed the complaint</p>
          </div>

          <div className="progress-step active">
            <div className="step-circle">3</div>

            <h3>In Progress</h3>

            <p>Maintenance work is underway</p>
          </div>

          <div className="progress-step">
            <div className="step-circle">4</div>

            <h3>Resolved</h3>

            <p>Issue has been fixed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
