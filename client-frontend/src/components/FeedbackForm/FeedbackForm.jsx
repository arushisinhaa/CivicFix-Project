import { useState } from "react";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "suggestion",
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      category: "suggestion",
      comments: "",
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="FeedbackContainer">
      <div className="FeedbackCard">
        <div className="FeedbackHeader">
          <div className="FeedbackIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
            </svg>
          </div>
          <h2>Share Your Feedback</h2>
          <p>Your insights help us improve our services</p>
        </div>

        {submitted ? (
          <div className="FeedbackSuccessMessage">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <h3>Thank you for your feedback!</h3>
            <p>We've received your message and will review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="FeedbackForm">
            <div className="FeedbackFormGroup">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="FeedbackFormGroup">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email Address"
                required
              />
            </div>

            <div className="FeedbackFormGroup FeedbackCategoryRow">
              <label htmlFor="category">Feedback Category</label>
              <div className="FeedbackCategorySelector">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="FeedbackColoredDropdown"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="compliment">Compliment</option>
                  <option value="bug">Report a Bug</option>
                  <option value="feature">Feature Request</option>
                </select>
                <div className="FeedbackSelectArrow">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="FeedbackFormGroup">
              <label htmlFor="comments">Your Feedback</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Please share your detailed feedback here..."
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="FeedbackSubmitBtn">
              Submit Feedback
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M10 17l5-5-5-5v10z" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
