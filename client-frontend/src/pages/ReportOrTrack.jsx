import "./ReportOrTrack.css";
import { Link } from "react-router-dom";

export default function ReportOrTrack() {
  return (
    <div className="issue-container">
      <div className="top-bar">
        <Link to="/" className="home-link">
          <svg viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          Home
        </Link>

        <h1 className="main-heading">Report / Track Issues</h1>
      </div>

      <div className="options-container">
        <div className="option-card track-option">
          <div className="image-wrapper">
            <Link to="/tracking">
              <img
                className="option-image"
                src="/Images/track image.png"
                alt="Track Community Issues"
                loading="lazy"
              />
            </Link>
          </div>
          <div className="content-wrapper">
            <h2 className="option-title">Track Community Issues</h2>
            <p className="option-description">
              Monitor real-time progress of reported issues. Get updates and
              notifications when resolutions are completed.
            </p>
            <Link to="/tracking">
              <button className="action-button">View Tracking</button>
            </Link>
          </div>
        </div>

        <div className="option-card report-option">
          <div className="image-wrapper">
            <Link to="/report">
              <img
                className="option-image"
                src="/Images/report.jpg"
                alt="Report New Issue"
                loading="lazy"
              />
            </Link>
          </div>
          <div className="content-wrapper">
            <h2 className="option-title">Report New Issue</h2>
            <p className="option-description">
              Quickly document civic problems with photos and location details.
              Help authorities respond faster to community needs.
            </p>
            <Link to="/report">
              <button className="action-button">Submit Report</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
