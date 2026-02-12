import React, { useEffect, useState, useRef } from "react";
import { getAnimeById } from "../api/anilist";
import { useMyList } from "../context/MyListContext";
import { sanitizeHtml } from "../utils/textUtils";
import Modal from "./Modal";
import { FaPlay, FaPlus, FaCheck, FaExternalLinkAlt } from "react-icons/fa";
import ErrorState from "./ErrorState";
import "./AnimeDetailsModal.css";

const AnimeDetailsModal = ({ animeId, isOpen, onClose }) => {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const trailerRef = useRef(null);

  const { isInList, toggleList } = useMyList();

  const posterImage =
    anime?.coverImage?.extraLarge ||
    anime?.coverImage?.large ||
    anime?.bannerImage;

  const trailerThumbnail =
    anime?.trailer?.thumbnail || anime?.bannerImage || posterImage;

  useEffect(() => {
    if (isOpen && animeId) {
      setLoading(true);
      setError(null);
      getAnimeById(animeId)
        .then((data) => {
          setAnime(data.Media);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load anime details.");
          setLoading(false);
        });
    } else {
      setAnime(null);
    }
  }, [isOpen, animeId]);

  const scrollToTrailer = () => {
    trailerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (date) => {
    if (!date?.year) return null;
    const monthIndex = date.month ? date.month - 1 : 0;
    const day = date.day || 1;
    const parsed = new Date(date.year, monthIndex, day);
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const airingRange = (media) => {
    const start = formatDate(media.startDate);
    const end = formatDate(media.endDate);
    if (start && end) return `${start} – ${end}`;
    if (start && !end) return `${start} – ?`;
    return start || "TBA";
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading && <div className="modal-loading">Loading...</div>}

      {error && <ErrorState message={error} />}

      {!loading && !error && anime && (
        <div className="details-wrapper">
          <div
            className="details-hero"
            style={{
              backgroundImage: posterImage ? `url(${posterImage})` : undefined,
            }}
          />
          <div className="details-overlay" />

          <div className="details-content container">
            <div className="details-card">
              <div className="details-grid">
                <div className="details-poster">
                  <img src={posterImage} alt={anime.title.userPreferred} />
                </div>

                <div className="details-main">
                  <span className="details-overline">{anime.format}</span>
                  <h2 className="details-title">{anime.title.userPreferred}</h2>

                  <div className="details-meta">
                    <div className="meta-item">
                      <span className="meta-label">Genre</span>
                      <span className="meta-value">
                        {anime.genres?.join(" / ") || "—"}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Released</span>
                      <span className="meta-value">{airingRange(anime)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Studio</span>
                      <span className="meta-value">
                        {anime.studios?.nodes?.map((s) => s.name).join(", ") ||
                          "TBA"}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Episodes</span>
                      <span className="meta-value">
                        {anime.episodes ? `${anime.episodes} eps` : "TBA"}
                        {anime.duration ? ` • ${anime.duration} min` : ""}
                      </span>
                    </div>
                  </div>

                  <p className="details-description">
                    {sanitizeHtml(anime.description)}
                  </p>

                  <div className="details-actions">
                    <button
                      className={`btn ${isInList(anime.id) ? "btn-secondary" : "btn-primary"}`}
                      onClick={() => toggleList(anime)}
                    >
                      {isInList(anime.id) ? (
                        <>
                          <FaCheck /> Added to My List
                        </>
                      ) : (
                        <>
                          <FaPlus /> Add to My List
                        </>
                      )}
                    </button>
                    {anime.trailer?.site === "youtube" && (
                      <button
                        className="btn btn-secondary"
                        onClick={scrollToTrailer}
                      >
                        <FaPlay /> Watch Trailer
                      </button>
                    )}
                    {anime.siteUrl && (
                      <a
                        href={anime.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                      >
                        <FaExternalLinkAlt /> View on AniList
                      </a>
                    )}
                  </div>
                </div>

                <div className="details-side-column">
                  {anime.trailer?.site === "youtube" && (
                    <a
                      href={`https://www.youtube.com/watch?v=${anime.trailer.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="trailer-card"
                      style={{
                        backgroundImage: trailerThumbnail
                          ? `url(${trailerThumbnail})`
                          : undefined,
                      }}
                    >
                      <div className="trailer-card-overlay">
                        <FaPlay />
                        <span>Official Trailer</span>
                      </div>
                    </a>
                  )}

                  {anime.siteUrl && (
                    <a
                      href={anime.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="trailer-card secondary"
                      style={{
                        backgroundImage: posterImage
                          ? `url(${posterImage})`
                          : undefined,
                      }}
                    >
                      <div className="trailer-card-overlay">
                        <FaExternalLinkAlt />
                        <span>AniList Page</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {anime.trailer?.site === "youtube" && (
                <div className="details-full-trailer" ref={trailerRef}>
                  <h3>Watch the Trailer</h3>
                  <div className="video-responsive">
                    <iframe
                      width="853"
                      height="480"
                      src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Trailer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AnimeDetailsModal;
