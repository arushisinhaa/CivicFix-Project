import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const { isAuthenticated, isAdmin, userEmail, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <nav className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            CivicFix
          </Link>
        </div>

        {isMobile && (
          <button
            className="navbar-menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        )}

        <div
          className={`navbar-right ${isMobile ? "mobile-nav" : ""} ${
            isMenuOpen ? "active" : ""
          }`}
        >
          {isAuthenticated ? (
            <>
              <div className="mobile-user-info">Welcome, {userEmail}</div>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="navbar-link navbar-admin-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/reportortrack"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Report/Track
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="navbar-link navbar-logout-button"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="navbar-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
