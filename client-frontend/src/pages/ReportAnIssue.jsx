import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";
import "./ReportAnIssue.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

import {
  FaMapMarkerAlt,
  FaImage,
  FaTimes,
  FaHistory,
  FaUpload,
  FaClipboardList,
} from "react-icons/fa";
import { MdReportProblem, MdCategory, MdDescription } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

function LocationPicker({ setFormData }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({ ...prev, lat, lng }));
    },
  });
  return null;
}

export default function ReportIssue() {
  const { userEmail, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
    lat: "",
    lng: "",
    address: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState("report");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userEmail) {
      fetchUserIssues();
    }
  }, [userEmail]);

  useEffect(() => {
    if (activeTab === "history" && userEmail) {
      fetchUserIssues();
    }
  }, [activeTab, userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUserIssues = async () => {
    if (!userEmail) {
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/issues/myissues`,
        {
          params: { email: userEmail },
          withCredentials: true,
        }
      );

      const sortedIssues = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setIssues(sortedIssues);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("address", formData.address);
    data.append("email", userEmail);
    data.append("image", formData.image);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/issues/report`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      await fetchUserIssues();

      alert("Issue reported successfully");
      setFormData({
        title: "",
        category: "",
        description: "",
        image: null,
        lat: "",
        lng: "",
        address: "",
      });
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setActiveTab("history");
    } catch (err) {
      console.error("Error reporting issue:", err);
      alert(
        "Submission failed: " + (err.response?.data?.message || "Unknown error")
      );
    }
  };

  if (!isAuthenticated || !userEmail) {
    console.log("Not authenticated in component:", isAuthenticated, userEmail);
  }

  return (
    <div className="reportanIssue-report-page">
      <header className="reportanIssue-page-header">
        <div className="reportanIssue-header-content">
          <div className="reportanIssue-navigation-buttons">
            <Link to="/" className="reportanIssue-nav-button">
              <FaHome /> Home
            </Link>
            <Link to="/tracking" className="reportanIssue-nav-button">
              <FaMapMarkerAlt /> Track
            </Link>
          </div>
          <h1>CivicFix</h1>
          <p className="reportanIssue-tagline">
            Together, Let's Build a Better Neighborhood
          </p>
        </div>
        <div className="reportanIssue-header-gradient"></div>
      </header>

      <div className="reportanIssue-user-email">
        <span className="reportanIssue-welcome-message">👋 Welcome,</span>
        <span className="reportanIssue-email-text">{userEmail || "Guest"}</span>
      </div>

      <div className="reportanIssue-tabs-container">
        <div className="reportanIssue-tabs">
          <button
            className={`reportanIssue-tab-button ${
              activeTab === "report" ? "reportanIssue-active" : ""
            }`}
            onClick={() => setActiveTab("report")}
          >
            <MdReportProblem className="reportanIssue-tab-icon" />
            <span>Report Issue</span>
            <div className="reportanIssue-tab-decoration"></div>
          </button>
          <button
            className={`reportanIssue-tab-button ${
              activeTab === "history" ? "reportanIssue-active" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            <FaHistory className="reportanIssue-tab-icon" />
            <span>My Reports</span>
            <div className="reportanIssue-tab-decoration"></div>
          </button>
        </div>
        <div className="reportanIssue-active-indicator"></div>
      </div>

      {activeTab === "report" && (
        <form
          className="reportanIssue-issue-form reportanIssue-glassmorphism"
          onSubmit={handleSubmit}
        >
          <h2 className="reportanIssue-form-title">
            <FaClipboardList className="reportanIssue-title-icon" />
            Report a New Issue
          </h2>

          <div className="reportanIssue-form-group reportanIssue-floating-label">
            <MdReportProblem className="reportanIssue-input-icon" />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter issue title"
              required
            />
            <label>Issue Title</label>
          </div>

          <div className="reportanIssue-form-group reportanIssue-floating-label">
            <MdCategory className="reportanIssue-input-icon" />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              <option value="Road Damage">Road Damage</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Utilities">Utilities</option>
              <option value="Other">Other</option>
            </select>
            <label>Category</label>
          </div>

          <div className="reportanIssue-form-group reportanIssue-floating-label">
            <MdDescription className="reportanIssue-input-icon" />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed Description"
              required
            />
            <label>Detailed Description</label>
          </div>

          <div className="reportanIssue-form-group reportanIssue-file-upload-section">
            <div className="reportanIssue-upload-container">
              <div
                className="reportanIssue-upload-content"
                onClick={() => fileInputRef.current.click()}
              >
                <FaUpload className="reportanIssue-upload-icon" />
                <p>Drag & drop or click to upload</p>
                <span>Recommended size: 1200x800px</span>
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                required
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              {imagePreview && (
                <div className="reportanIssue-image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="reportanIssue-remove-image"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, image: null }));
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="reportanIssue-map-container reportanIssue-glassmorphism">
            <h3 className="reportanIssue-map-title">
              <FaMapMarkerAlt className="reportanIssue-title-icon" />
              Select Location
              <span className="reportanIssue-map-subtitle">
                Click on map to mark location
              </span>
            </h3>
            <MapContainer
              center={[28.6139, 77.209]}
              zoom={12}
              className="reportanIssue-map" // Fixed class name
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker setFormData={setFormData} />
              {formData.lat && formData.lng && (
                <Marker position={[formData.lat, formData.lng]} />
              )}
            </MapContainer>
            <div className="reportanIssue-coordinates">
              <div className="reportanIssue-coordinate-input">
                <span>Latitude:</span>
                <input
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="Click on map"
                  readOnly
                />
              </div>
              <div className="reportanIssue-coordinate-input">
                <span>Longitude:</span>
                <input
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="Click on map"
                  readOnly
                />
              </div>
            </div>
            <div className="reportanIssue-form-group reportanIssue-floating-label reportanIssue-address-input">
              <FaMapMarkerAlt className="reportanIssue-input-icon" />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address (e.g., 123 Main St, City, State)"
                required
              />
              <label>Full Address</label>
            </div>
          </div>

          <button type="submit" className="reportanIssue-submit-button">
            Submit Issue
            <div className="reportanIssue-button-gradient"></div>
          </button>
        </form>
      )}

      {activeTab === "history" && (
        <div className="reportanIssue-previous-issues reportanIssue-glassmorphism">
          <h2 className="reportanIssue-history-title">
            <FaHistory className="reportanIssue-title-icon" /> Your Reported
            Issues
          </h2>

          {issues.length === 0 ? (
            <div className="reportanIssue-no-issues">
              <p>You haven't reported any issues yet.</p>
            </div>
          ) : (
            <div className="reportanIssue-issues-grid">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className={`reportanIssue-issue-card ${
                    selectedIssue?._id === issue._id
                      ? "reportanIssue-active"
                      : ""
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="reportanIssue-issue-card-header">
                    <h3>{issue.title}</h3>
                    <span
                      className={`reportanIssue-issue-category reportanIssue-${issue.category
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {issue.category}
                    </span>
                  </div>
                  <p className="reportanIssue-issue-date">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>

                  <div className="reportanIssue-description-container">
                    <p className="reportanIssue-issue-description">
                      {issue.description}
                    </p>
                  </div>

                  {issue.imageUrl && (
                    <div className="reportanIssue-issue-card-image">
                      <img src={issue.imageUrl} alt={issue.title} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedIssue && (
            <div className="reportanIssue-issue-details-overlay">
              <div className="reportanIssue-issue-details-card">
                <button
                  className="reportanIssue-close-button"
                  onClick={() => setSelectedIssue(null)}
                >
                  <FaTimes style={{ color: "#333" }} />
                </button>
                <div className="reportanIssue-issue-details-header">
                  <h3>{selectedIssue.title}</h3>
                  <span
                    className={`reportanIssue-issue-category reportanIssue-${selectedIssue.category
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {selectedIssue.category}
                  </span>
                </div>
                <p className="reportanIssue-issue-date">
                  Reported on{" "}
                  {new Date(selectedIssue.createdAt).toLocaleDateString()}
                </p>
                <div className="reportanIssue-issue-content">
                  <div className="reportanIssue-issue-description">
                    <h4>Description</h4>
                    <p>{selectedIssue.description}</p>
                  </div>
                  <div className="reportanIssue-issue-location">
                    <h4>Location</h4>
                    <p>{selectedIssue.location?.address || "N/A"}</p>
                  </div>
                </div>
                {selectedIssue.imageUrl && (
                  <div className="reportanIssue-issue-image">
                    <h4>Image</h4>
                    <div
                      style={{
                        maxHeight: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={selectedIssue.imageUrl}
                        alt={selectedIssue.title}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
