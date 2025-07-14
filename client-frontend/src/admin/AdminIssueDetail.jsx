import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "./admin.css";

function AdminIssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: "",
    comment: "",
  });
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/issues/${id}`,
          { withCredentials: true }
        );

        if (response.data) {
          setIssue(response.data);
          setFormData({
            status: response.data.status,
            comment: "",
          });
        } else {
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssue();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/issues/${id}`,
        formData,
        { withCredentials: true }
      );

      setIssue((prev) => ({
        ...prev,
        status: response.data.status,
        updates: response.data.updates,
      }));

      setFormData((prev) => ({ ...prev, comment: "" }));
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/issues/${id}/comments`,
        { comment: newComment },
        { withCredentials: true }
      );

      setIssue((prev) => ({
        ...prev,
        adminComments: [...prev.adminComments, response.data],
      }));

      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (isLoading)
    return <div className="admin-loading">Loading issue details...</div>;
  if (!issue) return <div className="admin-error">Issue not found</div>;

  return (
    <div className="admin-issue-detail-container">
      <div className="admin-header">
        <Link to="/" className="admin-home-button">
          <FaHome className="admin-home-icon" />
          Home
        </Link>
        <button onClick={() => navigate(-1)} className="admin-back-button">
          &larr; Back to Dashboard
        </button>
      </div>

      <div className="admin-issue-header">
        <h1 className="admin-issue-main-title">{issue.title}</h1>
        <span
          className={`admin-status admin-status-${issue.status.replace(
            "_",
            "-"
          )}`}
        >
          {issue.status.replace("_", " ")}
        </span>
      </div>

      <div className="admin-issue-meta">
        <div className="admin-meta-item">
          <span className="admin-meta-label">Category:</span>
          <span className="admin-meta-value">{issue.category}</span>
        </div>
        <div className="admin-meta-item">
          <span className="admin-meta-label">Reported on:</span>
          <span className="admin-meta-value">
            {new Date(issue.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="admin-meta-item">
          <span className="admin-meta-label">Reported by:</span>
          <span className="admin-meta-value">
            {issue.reportedBy?.email || "Anonymous"}
          </span>
        </div>
      </div>

      <div className="admin-content-grid">
        <div className="admin-description-card">
          <h3 className="admin-section-title">Description</h3>
          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <p className="admin-description-content">{issue.description}</p>
          </div>
        </div>

        {issue.imageUrl && (
          <div className="admin-image-card">
            <h3 className="admin-section-title">Issue Image</h3>
            <div className="admin-image-container">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}${issue.imageUrl}`}
                alt={issue.title}
                className="admin-issue-image"
              />
            </div>
          </div>
        )}
      </div>

      <div className="admin-status-grid">
        <div className="admin-status-form-card">
          <h3 className="admin-section-title">Update Status</h3>
          <form onSubmit={handleSubmit} className="admin-status-form">
            <div className="admin-form-group">
              <label htmlFor="status-select" className="admin-form-label">
                Status
              </label>
              <select
                id="status-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="admin-form-select"
                required
              >
                <option value="">Select Status</option>
                <option value="reported">Reported</option>
                <option value="under_review">Under Review</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label htmlFor="admin-comment" className="admin-form-label">
                Comment
              </label>
              <textarea
                id="admin-comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Add status update comment..."
                className="admin-form-textarea"
                rows="4"
              />
            </div>
            <button type="submit" className="admin-submit-button">
              Update Status
            </button>
          </form>
        </div>

        <div className="admin-history-card">
          <h3 className="admin-section-title">Status History</h3>
          <div className="admin-history-list">
            {issue.updates?.length === 0 ? (
              <p className="admin-no-history">No status updates yet</p>
            ) : (
              issue.updates?.map((update, index) => (
                <div key={index} className="admin-update-item">
                  <div className="admin-update-header">
                    <span
                      className={`admin-status admin-status-${update.status.replace(
                        "_",
                        "-"
                      )}`}
                    >
                      {update.status.replace("_", " ")}
                    </span>
                    <span className="admin-update-date">
                      {new Date(update.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {update.comment && (
                    <p className="admin-update-comment">{update.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="admin-comments-card">
        <h3 className="admin-section-title">Admin Comments</h3>
        <div className="admin-comment-input">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add new comment..."
            className="admin-comment-textarea"
            rows="4"
          />
          <button
            onClick={handleCommentSubmit}
            className="admin-comment-button"
          >
            Add Comment
          </button>
        </div>
        <div className="admin-comment-list">
          {issue.adminComments?.length === 0 ? (
            <p className="admin-no-comments">No comments yet</p>
          ) : (
            issue.adminComments?.map((comment, index) => (
              <div key={index} className="admin-comment-item">
                <p className="admin-comment-content">{comment.content}</p>
                <div className="admin-comment-meta">
                  <span className="admin-comment-author">
                    {comment.postedBy?.email || "Admin"}
                  </span>
                  <span className="admin-comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminIssueDetail;
