import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Stores dashboard data received from the backend.
  const [dashboardData, setDashboardData] = useState(null);

  // Tracks loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data for the logged-in student.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get logged-in student details from session storage.
        const student = JSON.parse(sessionStorage.getItem("student"));

        if (!student || !student.userId) {
          throw new Error(
            "Student information not found. Please log in again.",
          );
        }

        // Request dashboard data from the Java backend.
        const response = await fetch(
          `http://localhost:8080/api/student/dashboard?studentId=${student.userId}`,
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load dashboard.");
        }

        setDashboardData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Show loading message while fetching data.
  if (loading) {
    return (
      <div className="student-dashboard">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Show error if dashboard data could not be fetched.
  if (error) {
    return (
      <div className="student-dashboard">
        <p>{error}</p>
        <button onClick={() => navigate("/studentLogin")}>Go to Login</button>
      </div>
    );
  }

  const student = dashboardData.student;
  const statsData = dashboardData.stats;
  const recentComplaints = dashboardData.recentComplaints;

  // Display the student's first name in the welcome banner.
  const studentName = student.fullName.split(" ")[0];

  // Set greeting according to the current time.
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
        ? "Good afternoon"
        : "Good evening";

  // Dashboard statistics received from MySQL.
  const stats = [
    {
      icon: "📋",
      title: "Total Complaints",
      count: statsData.totalComplaints,
      description: "Complaints submitted",
      className: "total",
    },
    {
      icon: "⏳",
      title: "Pending",
      count: statsData.pending,
      description: "Awaiting attention",
      className: "pending",
    },
    {
      icon: "🔧",
      title: "In Progress",
      count: statsData.inProgress,
      description: "Currently being resolved",
      className: "progress",
    },
    {
      icon: "✓",
      title: "Resolved",
      count: statsData.resolved,
      description: "Successfully completed",
      className: "resolved",
    },
  ];

  // Convert database status values into readable labels.
  const formatStatus = (status) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Assign CSS classes according to complaint status.
  const getStatusClass = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "in-progress";
      case "RESOLVED":
        return "resolved";
      default:
        return "pending";
    }
  };

  // Select an icon based on the complaint category.
  const getComplaintIcon = (category) => {
    const icons = {
      Electrical: "💡",
      Plumbing: "🚰",
      Internet: "📶",
      Furniture: "🪑",
      Cleaning: "🧹",
      Maintenance: "🔧",
    };

    return icons[category] || "📋";
  };

  // Format complaint location.
  const getComplaintLocation = (complaint) => {
    return [complaint.building, complaint.floor, complaint.roomOrArea]
      .filter(Boolean)
      .join(" · ");
  };

  // Use the most recent complaint for the progress tracker.
  const trackedComplaint = recentComplaints[0];

  // Determine progress according to the complaint status.
  const getProgressIndex = (status) => {
    switch (status) {
      case "SUBMITTED":
        return 0;
      case "UNDER_REVIEW":
      case "ON_HOLD":
        return 1;
      case "IN_PROGRESS":
        return 2;
      case "RESOLVED":
        return 3;
      default:
        return 0;
    }
  };

  const progressSteps = [
    {
      title: "Submitted",
      description: "Complaint successfully received",
    },
    {
      title: "Under Review",
      description: "Admin has reviewed the complaint",
    },
    {
      title: "In Progress",
      description: "Maintenance work is underway",
    },
    {
      title: "Resolved",
      description: "Issue has been fixed",
    },
  ];

  const currentProgressIndex = trackedComplaint
    ? getProgressIndex(trackedComplaint.status)
    : -1;

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
          {recentComplaints.length > 0 ? (
            recentComplaints.map((complaint) => (
              <div className="complaint-item" key={complaint.complaintId}>
                <div className="complaint-item-icon">
                  {getComplaintIcon(complaint.category)}
                </div>

                <div className="complaint-item-info">
                  <h3>{complaint.title}</h3>
                  <p>
                    {getComplaintLocation(complaint)}
                    {" · "}#{complaint.complaintCode}
                  </p>
                </div>

                <span
                  className={`complaint-status ${getStatusClass(
                    complaint.status,
                  )}`}
                >
                  {formatStatus(complaint.status)}
                </span>

                <button
                  className="complaint-arrow"
                  onClick={() => navigate("/myComplaints")}
                  aria-label={`Track ${complaint.complaintCode}`}
                >
                  ›
                </button>
              </div>
            ))
          ) : (
            <p>No complaints submitted yet.</p>
          )}
        </div>
      </section>

      {/* Complaint Progress Tracker */}
      <section className="progress-tracker">
        <div className="tracker-header">
          <div>
            <h2>Complaint Progress Tracker</h2>

            {trackedComplaint ? (
              <p>
                {trackedComplaint.complaintCode} · {trackedComplaint.title}
              </p>
            ) : (
              <p>No complaint available to track.</p>
            )}
          </div>

          <button
            className="track-button"
            onClick={() => navigate("/myComplaints")}
          >
            Track Your Complaint
          </button>
        </div>

        {trackedComplaint && (
          <div className="progress-steps">
            {progressSteps.map((step, index) => {
              const isResolved = trackedComplaint.status === "RESOLVED";

              const isCompleted = index < currentProgressIndex || isResolved;

              const isActive = index === currentProgressIndex && !isResolved;

              return (
                <div
                  className={`progress-step ${
                    isCompleted ? "completed" : isActive ? "active" : ""
                  }`}
                  key={step.title}
                >
                  <div className="step-circle">
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
