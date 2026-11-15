import { useState } from "react";
import "./FeedbackForm.css";

const API_URL = "http://localhost:8080/api/student/feedback";

function getStudentId() {
  try {
    const student = JSON.parse(sessionStorage.getItem("student") || "null");
    return student?.user_id ?? student?.userId ?? student?.id ?? null;
  } catch {
    return null;
  }
}

function FeedbackForm({
  complaintId,
  feedbackSubmitted,
  feedbackRating,
  onSubmitted,
}) {
  const [rating, setRating] = useState(feedbackRating || 0);
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(feedbackSubmitted);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Please choose a rating before submitting.");
      return;
    }

    const studentId = getStudentId();

    if (!studentId) {
      setError("Sign in to submit feedback.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          complaintId,
          rating,
          comments: comments.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "We couldn't submit your feedback.");
      }

      setSubmitted(true);
      onSubmitted?.({ rating });
    } catch (requestError) {
      setError(requestError.message || "We couldn't submit your feedback.");
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <section className="feedback-card">
        <span className="feedback-kicker">YOUR FEEDBACK</span>
        <h3>Thank you for your feedback</h3>
        <p>Your response has been recorded for this complaint.</p>
        {rating > 0 && (
          <div className="feedback-saved-rating" aria-label={`${rating} out of 5 stars`}>
            {"★".repeat(rating)}
            <span>{"★".repeat(5 - rating)}</span>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="feedback-card">
      <span className="feedback-kicker">ISSUE RESOLVED</span>
      <h3>How was the resolution?</h3>
      <p>Your feedback helps us improve campus maintenance.</p>

      <form onSubmit={handleSubmit}>
        <fieldset className="feedback-rating">
          <legend>Your rating</legend>
          <div className="feedback-stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={value <= rating ? "star-selected" : ""}
                onClick={() => setRating(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                aria-pressed={rating === value}
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>

        <label className="feedback-comment">
          <span>Comment <small>(optional)</small></span>
          <textarea
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            placeholder="Share a short note about the resolution"
            maxLength="500"
            rows="3"
          />
          <small className="feedback-character-count">
            {comments.length}/500
          </small>
        </label>

        {error && (
          <p className="feedback-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="feedback-submit-button"
          type="submit"
          disabled={saving}
        >
          {saving ? "Submitting..." : "Submit feedback"}
        </button>
      </form>
    </section>
  );
}

export default FeedbackForm;
