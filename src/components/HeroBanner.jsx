import React from "react";
import { FaInfoCircle, FaPlay } from "react-icons/fa";
import { sanitizeHtml, truncateText } from "../utils/textUtils";
import "./HeroBanner.css";

const HeroBanner = ({ anime, onDetailsClick, onWatchClick }) => {
  if (!anime) return null;

  const bgImage = anime.bannerImage || anime.coverImage.extraLarge;
  const description = truncateText(sanitizeHtml(anime.description), 150);

  return (
    <div className="hero-banner" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-overlay">
        <div className="hero-content container">
          <h1 className="hero-title">{anime.title.userPreferred}</h1>

          <div className="hero-meta">
            <span className="hero-score">{anime.averageScore}% Match</span>
            <span>{anime.seasonYear || "N/A"}</span>
            <span className="tag">{anime.format}</span>
          </div>

          <p className="hero-description">{description}</p>

          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => onDetailsClick(anime)}
            >
              <FaInfoCircle /> Details
            </button>
            {anime.trailer?.id && (
              <button
                className="btn btn-secondary"
                onClick={() => onWatchClick(anime)}
              >
                <FaPlay /> Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
