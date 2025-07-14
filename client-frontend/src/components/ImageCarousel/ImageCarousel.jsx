import React, { useState } from "react";
import "./ImageCarousel.css";

const images = [
  "/Images/img1.webp",
  "/Images/img2.jpg",
  "/Images/img3.jpg",
  "/Images/img4.avif",
  "/Images/img5.jpeg",
  "/Images/img6.avif",
  "/Images/img7.webp",
  "/Images/img8.jpg",
  "/Images/img9.jpeg",
];

const ImageCarousel = () => {
  const [startIndex, setStartIndex] = useState(0);
  const imagesPerPage = 3;

  const handleNext = () => {
    if (startIndex + imagesPerPage < images.length) {
      setStartIndex(startIndex + imagesPerPage);
    } else {
      setStartIndex(0);
    }
  };

  const handlePrev = () => {
    if (startIndex - imagesPerPage >= 0) {
      setStartIndex(startIndex - imagesPerPage);
    } else {
      setStartIndex(6);
    }
  };

  return (
    <div className="carousel-container">
      <button onClick={handlePrev} className="arrow-button">
        &#8592;
      </button>
      <div className="carousel-wrapper">
        {images
          .slice(startIndex, startIndex + imagesPerPage)
          .map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index}`}
              className="carousel-image"
            />
          ))}
      </div>
      <button onClick={handleNext} className="arrow-button">
        &#8594;
      </button>
    </div>
  );
};

export default ImageCarousel;
