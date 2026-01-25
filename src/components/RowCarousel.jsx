import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AnimeCard from "./AnimeCard";
import "./RowCarousel.css";

const RowCarousel = ({ title, animes, onAnimeClick }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = current.clientWidth * 0.75;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="row-carousel-container">
      <h3 className="row-title">{title}</h3>
      <div className="row-wrapper">
        <button
          className="row-arrow left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </button>

        <div className="row-content" ref={rowRef}>
          {animes.map((anime) => (
            <div key={anime.id} className="row-item">
              <AnimeCard anime={anime} onClick={onAnimeClick} />
            </div>
          ))}
        </div>

        <button
          className="row-arrow right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default RowCarousel;
