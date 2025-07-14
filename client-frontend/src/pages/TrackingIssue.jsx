import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaHistory, FaMapMarkerAlt, FaHome, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./TrackingIssue.css";
import { useAuth } from "../context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const statusStages = [
  {
    id: 1,
    name: "Reported",
    description: "Issue has been submitted",
    icon: "📝",
    color: "#3498db",
  },
  {
    id: 2,
    name: "Under Review",
    description: "Issue is being reviewed",
    icon: "🔍",
    color: "#f39c12",
  },
  {
    id: 3,
    name: "In Progress",
    description: "Work has started",
    icon: "🛠️",
    color: "#2ecc71",
  },
  {
    id: 4,
    name: "Resolved",
    description: "Issue has been fixed",
    icon: "✅",
    color: "#27ae60",
  },
  {
    id: 5,
    name: "Rejected",
    description: "Issue was rejected",
    icon: "❌",
    color: "#e74c3c",
  },
];

const statusMap = {
  reported: "Reported",
  under_review: "Under Review",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

function StatusTracker({
  currentStatus,
  statusHistory,
  adminComments,
  updates,
}) {
  const displayStatus = statusMap[currentStatus] || currentStatus;
  const currentIndex = statusStages.findIndex(
    (stage) => stage.name === displayStatus
  );

  // Combine all possible comment sources
  const allComments = [
    ...(adminComments || []).map((c) => ({ ...c, source: "adminComment" })),
    ...(updates || []).map((u) => ({ ...u, source: "update" })),
    ...(statusHistory || []).map((sh) => ({ ...sh, source: "statusHistory" })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt || b.changedAt) -
      new Date(a.createdAt || a.changedAt)
  );

  const latestComment = allComments.find(
    (item) =>
      (item.content || item.comment) &&
      (item.content || item.comment).trim() !== ""
  );

  return (
    <div className="trackAnIssue-status-tracker">
      <h4 className="trackAnIssue-tracker-title">Status Progress</h4>
      <ul className="trackAnIssue-status-list">
        {statusStages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isRejected = stage.name === "Rejected" && currentIndex === 4;

          return (
            <li
              key={stage.id}
              className={`trackAnIssue-status-step ${
                isCompleted ? "trackAnIssue-completed" : ""
              } ${isCurrent ? "trackAnIssue-current" : ""} ${
                isRejected ? "trackAnIssue-rejected" : ""
              }`}
              style={{ "--step-color": stage.color }}
            >
              <div className="trackAnIssue-step-indicator">
                <div className="trackAnIssue-step-icon">{stage.icon}</div>
                {index < statusStages.length - 1 && (
                  <div className="trackAnIssue-step-connector"></div>
                )}
              </div>
              <div className="trackAnIssue-step-content">
                <div className="trackAnIssue-step-header">
                  <span className="trackAnIssue-stage-name">{stage.name}</span>
                  <span className="trackAnIssue-stage-description">
                    {stage.description}
                  </span>
                </div>

                {isCurrent && latestComment && (
                  <div className="trackAnIssue-admin-comment-box">
                    <strong>Admin Comment:</strong>
                    <p>{latestComment.content || latestComment.comment}</p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function TrackIssue() {
  const { userEmail } = useAuth();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserIssues = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/tracking/myissues`,
          {
            params: { email: userEmail },
          }
        );
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserIssues();
  }, [userEmail]);

  const handleIssueSelect = async (issueId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/tracking/${issueId}`
      );

      setSelectedIssue(response.data);
    } catch (error) {
      console.error("Error fetching issue details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayStatus = (status) => statusMap[status] || status;

  return (
    <div className="trackAnIssue-page">
      {/* Header Section */}
      <div className="trackAnIssue-page-header">
        <div className="trackAnIssue-header-content">
          <Link to="/" className="trackAnIssue-logo-link">
            <h1 className="trackAnIssue-app-title">CivicFix</h1>
            <p className="trackAnIssue-app-tagline">
              Together, Let's Build a Better Neighborhood
            </p>
          </Link>

          <div className="trackAnIssue-header-actions">
            <Link
              to="/"
              className="trackAnIssue-action-button trackAnIssue-home-button"
            >
              <FaHome className="trackAnIssue-button-icon" />
              Home
            </Link>
            <Link
              to="/report"
              className="trackAnIssue-action-button trackAnIssue-report-button"
            >
              <FaPlus className="trackAnIssue-button-icon" />
              Report Issue
            </Link>
          </div>
        </div>

        <div className="trackAnIssue-user-info">
          <div className="trackAnIssue-welcome-message">Welcome back,</div>
          <div className="trackAnIssue-user-email">{userEmail || "Guest"}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="trackAnIssue-container">
        <div className="trackAnIssue-issues-selector-card">
          <div className="trackAnIssue-card-header">
            <FaHistory className="trackAnIssue-header-icon" />
            <h2>Your Reported Issues</h2>
          </div>

          <div className="trackAnIssue-card-content">
            {isLoading && issues.length === 0 ? (
              <div className="trackAnIssue-loading-spinner">
                Loading your issues...
              </div>
            ) : issues.length === 0 ? (
              <div className="trackAnIssue-no-issues">
                <p>You haven't reported any issues yet.</p>
                <Link to="/report" className="trackAnIssue-report-link">
                  Report your first issue
                </Link>
              </div>
            ) : (
              <div className="trackAnIssue-issue-dropdown">
                <select
                  onChange={(e) => handleIssueSelect(e.target.value)}
                  value={selectedIssue?._id || ""}
                  disabled={isLoading}
                >
                  <option value="">Select an issue to track</option>
                  {issues.map((issue) => (
                    <option key={issue._id} value={issue._id}>
                      {issue.title} ({getDisplayStatus(issue.status)}) -{" "}
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {selectedIssue && (
          <div className="trackAnIssue-issue-details-card">
            <div className="trackAnIssue-card-header">
              <h3>{selectedIssue.title}</h3>
              <div className="trackAnIssue-issue-status-badge">
                {getDisplayStatus(selectedIssue.status)}
              </div>
            </div>

            <div className="trackAnIssue-issue-meta">
              <div className="trackAnIssue-meta-item">
                <span className="trackAnIssue-meta-label">Category:</span>
                <span className="trackAnIssue-meta-value">
                  {selectedIssue.category}
                </span>
              </div>
              <div className="trackAnIssue-meta-item">
                <span className="trackAnIssue-meta-label">Reported on:</span>
                <span className="trackAnIssue-meta-value">
                  {new Date(selectedIssue.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="trackAnIssue-details-container">
              <div className="trackAnIssue-status-tracker-container">
                <StatusTracker
                  currentStatus={selectedIssue.status}
                  statusHistory={selectedIssue.statusHistory || []}
                  adminComments={selectedIssue.adminComments || []}
                  updates={selectedIssue.updates || []}
                />
              </div>

              <div className="trackAnIssue-issue-content-container">
                <div className="trackAnIssue-content-section">
                  <h4 className="trackAnIssue-section-title">Description</h4>
                  <p className="trackAnIssue-section-content">
                    {selectedIssue.description}
                  </p>
                </div>

                <div className="trackAnIssue-content-section">
                  <h4 className="trackAnIssue-section-title">
                    <FaMapMarkerAlt className="trackAnIssue-title-icon" />{" "}
                    Location
                  </h4>
                  <p className="trackAnIssue-location-address">
                    {selectedIssue.location?.address || "N/A"}
                  </p>

                  {selectedIssue.location?.lat &&
                    selectedIssue.location?.lng && (
                      <div className="trackAnIssue-map-container">
                        <MapContainer
                          center={[
                            selectedIssue.location.lat,
                            selectedIssue.location.lng,
                          ]}
                          zoom={15}
                          className="trackAnIssue-issue-map"
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={[
                              selectedIssue.location.lat,
                              selectedIssue.location.lng,
                            ]}
                          />
                        </MapContainer>
                      </div>
                    )}
                </div>

                {selectedIssue.imageUrl && (
                  <div className="trackAnIssue-content-section">
                    <h4 className="trackAnIssue-section-title">Issue Image</h4>
                    <div className="trackAnIssue-image-container">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${selectedIssue.imageUrl}`}
                        alt={selectedIssue.title}
                        className="trackAnIssue-issue-image"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
