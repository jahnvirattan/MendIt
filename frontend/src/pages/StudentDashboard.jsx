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

  return (
    <div className="student-dashboard">
      {/* Welcome Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-label">🌿 WELCOME TO MENDIT</span>

          <h1>
            A Cleaner Campus,
            <br />
            <span>A Healthier You.</span>
          </h1>

          <p>
            Together for a better campus environment. Your voice makes a
            difference.
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("/submit-complaint")}
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
          onClick={() => navigate("/submit-complaint")}
        >
          + New Complaint
        </button>
      </section>
    </div>
  );
};

export default StudentDashboard;
