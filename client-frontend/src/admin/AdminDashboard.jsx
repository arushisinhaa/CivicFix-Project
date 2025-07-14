import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "./admin.css";

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/issues`,
          {
            params: filters,
            withCredentials: true,
          }
        );
        setIssues(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setIssues([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchIssues();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <Link to="/" className="admin-home-button">
          <FaHome className="admin-home-icon" />
          Home
        </Link>
        <h1 className="admin-main-title">Issue Management Dashboard</h1>
      </div>

      <div className="admin-filters-container">
        <div className="admin-filter-group">
          <label htmlFor="status-filter" className="admin-filter-label">
            Status
          </label>
          <select
            id="status-filter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="admin-filter-select"
          >
            <option value="">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="admin-filter-group">
          <label htmlFor="category-filter" className="admin-filter-label">
            Category
          </label>
          <select
            id="category-filter"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="admin-filter-select"
          >
            <option value="">All Categories</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Public Safety">Public Safety</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="admin-loading">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="admin-no-issues">
          <p>No issues found matching these filters</p>
        </div>
      ) : (
        <div className="admin-issues-grid">
          {issues.map((issue) => (
            <div key={issue._id} className="admin-issue-card">
              <div className="admin-card-header">
                <h3 className="admin-issue-title">{issue.title}</h3>
                <span
                  className={`admin-status admin-status-${issue.status.replace(
                    "_",
                    "-"
                  )}`}
                >
                  {issue.status.replace("_", " ")}
                </span>
              </div>
              <div className="admin-card-content">
                <div className="admin-card-meta">
                  <span className="admin-category">{issue.category}</span>
                  <span className="admin-date">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="admin-description">
                  {issue.description.substring(0, 100)}...
                </p>
                <p className="admin-reporter">
                  Reported by: {issue.reportedBy?.email || "Anonymous"}
                </p>
              </div>
              <div className="admin-card-actions">
                <button
                  className="admin-proceed-button"
                  onClick={() => navigate(`/admin/issues/${issue._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
