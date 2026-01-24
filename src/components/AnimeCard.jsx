import React from "react";
import { useMyList } from "../context/MyListContext";
import { FaPlay, FaPlus, FaCheck, FaInfoCircle } from "react-icons/fa"; // Assuming react-icons
import "./AnimeCard.css";

const AnimeCard = ({ anime, onClick }) => {
  const { isInList, toggleList } = useMyList();
  const inList = isInList(anime.id);

  if (!anime) return null;

  const handleListToggle = (e) => {
    e.stopPropagation();
    toggleList(anime);
  };

  return (
    <div className="anime-card" onClick={() => onClick(anime)}>
      <div className="anime-card-image-wrapper">
        <img
          src={anime.coverImage.large}
          alt={anime.title.userPreferred}
          className="anime-card-image"
          loading="lazy"
        />
        <div className="anime-card-overlay">
          <div className="anime-card-actions">
            <button
              className="card-btn"
              onClick={handleListToggle}
              title={inList ? "Remove from List" : "Add to List"}
            >
              {inList ? <FaCheck /> : <FaPlus />}
            </button>
            <button className="card-btn" title="Details">
              <FaInfoCircle />
            </button>
          </div>
        </div>
      </div>
      <div className="anime-card-info">
        <h4 className="anime-card-title">{anime.title.userPreferred}</h4>
        <div className="anime-card-meta">
          <span
            className="anime-score"
            style={{ color: anime.averageScore >= 75 ? "green" : "inherit" }}
          >
            {anime.averageScore ? `${anime.averageScore}%` : "N/A"}
          </span>
          <span className="dot">•</span>
          <span>{anime.format}</span>
        </div>
        <div className="anime-genres">
          {anime.genres.slice(0, 2).join(" • ")}
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
