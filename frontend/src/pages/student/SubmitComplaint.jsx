import { useState } from "react";
import "./SubmitComplaint.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted successfully!");
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
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
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
