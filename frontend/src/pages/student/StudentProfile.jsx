import { useEffect, useState } from "react";
import "./StudentProfile.css";

const API_URL = "http://localhost:8080/api/student/profile";
const previewProfile = {
  full_name: "Avdhi Chhabra",
  email: "avdhi.demo@example.edu",
  roll_number: "DEMO004",
  department: "Computer Science",
  created_at: "2025-08-15T00:00:00",
};

function getStudentId() {
  const savedStudent = sessionStorage.getItem("student");

  if (savedStudent) {
    try {
      const student = JSON.parse(savedStudent);
      return student.user_id || student.userId || student.id;
    } catch {
      return null;
    }
  }

  return (
    sessionStorage.getItem("userId") ||
    sessionStorage.getItem("id")
  );
}

function getInitials(name) {
  if (!name) return "S";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(dateValue) {
  if (!dateValue) return "Not available";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    department: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const studentId = getStudentId();
  function showPreviewProfile() {
  setProfile(previewProfile);
  setForm({
    full_name: previewProfile.full_name,
    department: previewProfile.department,
  });
    setError("");
  }

  async function loadProfile() {
    setError("");
    setMessage("");

    if (!studentId) {
    showPreviewProfile();
    setLoading(false);
    return;
  }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?studentId=${encodeURIComponent(studentId)}`
      );
      const data = await response.json();

      if (!response.ok || !data.profile) {
        throw new Error(data.message || "We couldn't load your profile.");
      }

      setProfile(data.profile);
      setForm({
        full_name: data.profile.full_name || "",
        department: data.profile.department || "",
      });
    } catch {
      showPreviewProfile();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function cancelEditing() {
    setForm({
      full_name: profile?.full_name || "",
      department: profile?.department || "",
    });
    setEditing(false);
    setMessage("");
    setError("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!studentId) {
      setError("Sign in to update your profile.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          full_name: form.full_name.trim(),
          department: form.department.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "We couldn't save your changes.");
      }

      const updatedProfile = data.profile || {
        ...profile,
        full_name: form.full_name.trim(),
        department: form.department.trim(),
      };

      setProfile(updatedProfile);
      setForm({
        full_name: updatedProfile.full_name || "",
        department: updatedProfile.department || "",
      });
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(
        requestError.message || "We couldn't save your changes."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-message-card">
          <div className="profile-loader" aria-hidden="true"></div>
          <p>Loading your profile...</p>
        </section>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="profile-page">
        <section className="profile-message-card">
          <div className="profile-message-icon" aria-hidden="true">
            !
          </div>
          <h1>Profile unavailable</h1>
          <p>{error}</p>

          {studentId ? (
            <button
              className="profile-primary-button"
              type="button"
              onClick={loadProfile}
            >
              Try again
            </button>
          ) : (
            <button
              className="profile-primary-button"
              type="button"
              onClick={() => window.location.assign("/")}
            >
              Go to login
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <header className="profile-banner">
        <div>
          <p className="profile-eyebrow">STUDENT PORTAL</p>
          <h1>My Profile</h1>
          <p className="profile-banner-text">
            View and manage your student account details.
          </p>
        </div>

        {!editing && (
          <button
            className="profile-edit-button"
            type="button"
            onClick={() => {
              setMessage("");
              setError("");
              setEditing(true);
            }}
          >
            Edit profile
          </button>
        )}
      </header>

      <section className="profile-content">
        <aside className="profile-summary-card">
          <div className="profile-avatar">
            {getInitials(profile?.full_name)}
          </div>

          <h2>{profile?.full_name || "Student"}</h2>
          <p className="profile-summary-department">
            {profile?.department || "Department not added"}
          </p>

          <div className="profile-summary-divider"></div>

          <p className="profile-summary-label">Member since</p>
          <p className="profile-summary-date">
            {formatDate(profile?.created_at)}
          </p>
        </aside>

        <section className="profile-details-card">
          <div className="profile-details-heading">
            <div>
              <p className="profile-eyebrow">ACCOUNT INFORMATION</p>
              <h2>Personal details</h2>
            </div>

            <span className="profile-role-badge">Student</span>
          </div>

          {message && (
            <p className="profile-success-message" role="status">
              {message}
            </p>
          )}

          {error && profile && (
            <p className="profile-error-message" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSave}>
            <div className="profile-fields">
              <label className="profile-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="full_name"
                  value={editing ? form.full_name : profile?.full_name || ""}
                  onChange={handleChange}
                  readOnly={!editing}
                  required
                  maxLength="100"
                />
              </label>

              <label className="profile-field">
                <span>Email address</span>
                <input
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                />
                <small>Email address can’t be changed here.</small>
              </label>

              <label className="profile-field">
                <span>Roll number</span>
                <input
                  type="text"
                  value={profile?.roll_number || ""}
                  readOnly
                />
              </label>

              <label className="profile-field">
                <span>Department</span>
                <input
                  type="text"
                  name="department"
                  value={editing ? form.department : profile?.department || ""}
                  onChange={handleChange}
                  readOnly={!editing}
                  maxLength="100"
                />
              </label>
            </div>

            {editing && (
              <div className="profile-form-actions">
                <button
                  className="profile-cancel-button"
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="profile-primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            )}
          </form>
        </section>
      </section>
      <section className="profile-ready-note">
        <span className="profile-ready-icon" aria-hidden="true">
          ✓
        </span>

        <div>
          <h2>Your profile is ready</h2>
          <p>
            Your student details help keep your complaints linked to your account.
          </p>
        </div>
      </section>
    </main>
  );
}

export default StudentProfile;