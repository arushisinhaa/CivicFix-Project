import { useState, useEffect } from "react";
import "./Home.css";
import Navbar from "../components/Navbar/Navbar";
import Description from "../components/Description/description";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import FeedbackForm from "../components/FeedbackForm/FeedbackForm";
import Footer from "../components/Footer/Footer";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth > 480 && window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`home-page ${isMobile ? "mobile-view" : ""} ${
        isTablet ? "tablet-view" : ""
      }`}
    >
      <Navbar />
      <main className="home-content">
        <div className="hero-section">
          <h1 className="home-heading">Welcome to CivicFix</h1>
          <p className="home-tagline">
            Together, Let us Build a Better Neighborhood.
          </p>
        </div>

        <div className="carousel-section">
          <ImageCarousel />
        </div>

        <div className="features-section">
          <p className="home-tagline">
            Report and track public issues in your neighborhood easily.
          </p>
          <Description />
        </div>

        <div className="feedback-section">
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
