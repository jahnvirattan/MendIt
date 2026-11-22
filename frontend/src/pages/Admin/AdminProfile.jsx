
import { useEffect, useState } from "react";
import "./AdminProfile.css";

const PROFILE_GET_URL = "http://localhost:8080/api/admin/profile";
const PROFILE_UPDATE_URL = "http://localhost:8080/api/admin/profile";

function getAdminId() {
  const savedAdmin = sessionStorage.getItem("admin");

  if (savedAdmin) {
    try {
      const admin = JSON.parse(savedAdmin);
      return admin.userId || admin.user_id || admin.id;
    } catch {
      return null;
    }
  }

  return sessionStorage.getItem("userId") ||
    sessionStorage.getItem("id");
}

function getInitials(name) {
  if (!name) return "A";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    mobile: "",
    designation: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const adminId = getAdminId();

  async function loadProfile() {
    setError("");
    setMessage("");

    if (!adminId) {
      setProfile(null);
      setError("Please sign in to view your profile.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${PROFILE_GET_URL}?userId=${encodeURIComponent(adminId)}`
      );

      const data = await response.json();
      const admin = data?.data?.admin;

      if (!response.ok || !data.success || !admin) {
        throw new Error(data.message || "We couldn't load your profile.");
      }

      const profileFromDatabase = {
        full_name: admin.fullName || "",
        email: admin.email || "",
        admin_id: admin.adminId || "",
        mobile: admin.mobile || "",
        designation: admin.designation || "",
      };

      setProfile(profileFromDatabase);
      setForm({
        full_name: profileFromDatabase.full_name,
        mobile: profileFromDatabase.mobile,
        designation: profileFromDatabase.designation,
      });
    } catch (requestError) {
      setProfile(null);
      setError(requestError.message || "We couldn't load your profile.");
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
      mobile: profile?.mobile || "",
      designation: profile?.designation || "",
    });

    setEditing(false);
    setMessage("");
    setError("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!adminId) {
      setError("Please sign in to update your profile.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(PROFILE_UPDATE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: adminId,
          full_name: form.full_name.trim(),
          mobile: form.mobile.trim(),
          designation: form.designation.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "We couldn't save your changes.");
      }

      const updatedProfile = {
        ...profile,
        full_name: form.full_name.trim(),
        mobile: form.mobile.trim(),
        designation: form.designation.trim(),
      };

      setProfile(updatedProfile);
      setForm({
        full_name: updatedProfile.full_name,
        mobile: updatedProfile.mobile,
        designation: updatedProfile.designation,
      });

      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(requestError.message || "We couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-page admin-profile-page">
        <p>Loading your profile...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page admin-profile-page">
        <p className="profile-error-message" role="alert">
          {error || "Unable to load your profile."}
        </p>
        <button
          type="button"
          className="profile-primary-button"
          onClick={loadProfile}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="profile-page admin-profile-page">

      {/* TOP BANNER */}
      <header className="profile-banner">
        <div>
          <p className="profile-eyebrow">ADMINISTRATOR PORTAL</p>
          <h1>My Profile</h1>
          <p className="profile-banner-text">
            View and manage your administrator account details.
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
            <i className="fa-solid fa-pen"></i>
            Edit profile
          </button>
        )}
      </header>

      {/* HORIZONTAL PROFILE IDENTITY */}
      <section className="admin-identity-card">
        <div className="admin-identity-left">
          <div className="profile-avatar">
            {getInitials(profile?.full_name)}
          </div>

          <div className="admin-identity-info">
            <h2>{profile?.full_name || "Administrator"}</h2>
            <p>{profile?.designation || "Campus Administrator"}</p>
            <span>
              <i className="fa-solid fa-shield-halved"></i>
              MendIt Administrator
            </span>
          </div>
        </div>

        <div className="admin-identity-badge">
          <i className="fa-solid fa-user-shield"></i>
          Admin Account
        </div>
      </section>

      {/* PERSONAL DETAILS */}
      <section className="profile-details-card admin-details-card">
        <div className="profile-details-heading">
          <div>
            <p className="profile-eyebrow">ACCOUNT INFORMATION</p>
            <h2>Personal details</h2>
            <p className="admin-details-subtitle">
              Your administrator account information
            </p>
          </div>

          <span className="profile-role-badge">Admin</span>
        </div>

        {message && (
          <p className="profile-success-message" role="status">
            {message}
          </p>
        )}

        {error && (
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
                value={editing ? form.full_name : profile.full_name}
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
                value={profile.email}
                readOnly
              />
            </label>

            <label className="profile-field">
              <span>Admin ID</span>
              <input
                type="text"
                value={profile.admin_id}
                readOnly
              />
            </label>

            <label className="profile-field">
              <span>Mobile number</span>
              <input
                type="tel"
                name="mobile"
                value={editing ? form.mobile : profile.mobile}
                onChange={handleChange}
                readOnly={!editing}
                maxLength="15"
              />
            </label>

            <label className="profile-field">
              <span>Designation</span>
              <input
                type="text"
                name="designation"
                value={editing ? form.designation : profile.designation}
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

      {/* BOTTOM NOTE */}
      <section className="profile-ready-note">
        <span className="profile-ready-icon">✓</span>
        <div>
          <h2>Your profile is ready</h2>
          <p>
            Your administrator details help manage campus complaints
            and keep your account information up to date.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AdminProfile;
