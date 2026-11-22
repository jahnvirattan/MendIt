import { useRef, useState } from "react";
import "./SubmitComplaint.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function getStudentId() {
  try {
    const student = JSON.parse(
      sessionStorage.getItem("student") || "null"
    );

    return student?.user_id ?? student?.userId ?? student?.id ?? null;
  } catch {
    return null;
  }
}
function readPhotoAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(
      new Error("Could not read the selected photo.")
    );

    reader.readAsDataURL(file);
  });
}

function SubmitComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    building: "",
    floor: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentId = getStudentId();

    if (!studentId) {
      alert("Please log in again before submitting a complaint.");
      return;
    }
    if (photo) {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(photo.type)) {
      alert("Choose a PNG, JPEG, or WEBP image.");
      return;
    }

    if (photo.size > 5 * 1024 * 1024) {
      alert("Photo must be 5 MB or smaller.");
      return;
    }
  }

    try {
      const response = await fetch(
        "http://localhost:8080/api/student/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: Number(studentId),
            title: formData.title,
            category: formData.category,
            description: formData.description,
            building: formData.building,
            floor: formData.floor,
            roomOrArea: formData.location,
            photoData: photo ? await readPhotoAsDataUrl(photo) : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not submit the complaint.");
      }

      alert(`Complaint submitted successfully. ID: ${data.complaintId}`);

      setFormData({
        title: "",
        category: "",
        description: "",
        building: "",
        floor: "",
        location: "",
      });

      setPhoto(null);
            if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert(error.message || "Unable to connect to the server.");
    }
  };
  return (
    <div className="complaint-page">
      <div className="complaint-container">
        <header className="complaint-heading">
          <div className="heading-content">
            <span className="page-tag">STUDENT PORTAL</span>
            <h1>Raise a Complaint</h1>
            <p>
              Small fixes. Better Campuses. Tell us what's wrong and help us
              make your campus a better place.
            </p>
          </div>
        </header>
        <div className="form-layout">
          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-title">
              <div>
                <h2>Complaint Details</h2>
                <p>Please provide accurate information about the issue.</p>
              </div>

              <span className="form-icon">
                <i className="fa-solid fa-pen-to-square"></i>
              </span>
            </div>
            <div className="form-group">
              <label>Complaint Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Broken classroom fan"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a Category</option>
                <option>Electrical</option>
                <option>Plumbing</option>
                <option>Furniture</option>
                <option>Cleanliness</option>
                <option>Infrastructure</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Describe the problem in detail..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <h2 className="location-heading">Location Details</h2>

            <div className="form-group">
              <label>Building *</label>
              <input
                type="text"
                name="building"
                placeholder="Enter building name"
                value={formData.building}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Floor</label>
                <input
                  type="text"
                  name="floor"
                  placeholder="e.g. 2nd Floor"
                  value={formData.floor}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Room/Area *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Room 204"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <h2 className="location-heading">Attach a Photo</h2>
            <div className="form-group">
              <label>Upload Image(Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setPhoto(e.target.files[0] || null)}
              />
              {photo && <p className="file-name">{photo.name}</p>}
            </div>

            <button type="submit" className="submit-button">
              Submit Complaint <i className="fa-solid fa-arrow-right"></i>
            </button>

            <p className="required-note">* Required fields</p>
          </form>

          <aside className="journey-panel">
            <div className="journey-header">
              <span className="journey-tag">MENDIT GUIDE</span>
              <h3>What happens next?</h3>
              <p>From submission to resolution.</p>
            </div>

            <div className="journey-content">
              <div className="journey-item">
                <div className="journey-icon submitted-icon">
                  <i className="fa-solid fa-paper-plane"></i>
                </div>
                <div className="journey-text">
                  <h4>01 · Submitted</h4>
                  <p>Your complaint enters the system.</p>
                </div>
              </div>

              <div className="journey-divider"></div>

              <div className="journey-item">
                <div className="journey-icon review-icon">
                  <i className="fa-solid fa-clipboard-check"></i>
                </div>
                <div className="journey-text">
                  <h4>02 · Under Review</h4>
                  <p>Admin reviews and prioritizes it.</p>
                </div>
              </div>

              <div className="journey-divider"></div>

              <div className="journey-item">
                <div className="journey-icon resolution-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div className="journey-text">
                  <h4>03 · Resolution</h4>
                  <p>Follow progress in your portal.</p>
                </div>
              </div>

              <div className="journey-tip">
                <div className="tip-heading">
                  <i className="fa-solid fa-lightbulb"></i>
                  <strong>A little tip</strong>
                </div>
                <p>
                  Clear photos and accurate locations help speed up resolution.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
export default SubmitComplaint;
