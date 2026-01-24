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

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loading && <div className="modal-loading">Loading...</div>}

      {error && <ErrorState message={error} />}

      {!loading && !error && anime && (
        <>
          <div
            className="modal-banner"
            style={{
              backgroundImage: `url(${anime.bannerImage || anime.coverImage?.extraLarge})`,
            }}
          >
            <div className="modal-banner-overlay">
              <div className="modal-header-content">
                <h2 className="modal-title">{anime.title.userPreferred}</h2>
                <div className="modal-meta">
                  <span className="score-match">
                    {anime.averageScore}% Match
                  </span>
                  <span>{anime.seasonYear}</span>
                  <span>{anime.episodes} eps</span>
                  <span className="modal-format-tag">{anime.format}</span>
                </div>
                <div className="modal-actions">
                  <button
                    className={`btn ${isInList(anime.id) ? "btn-secondary" : "btn-primary"}`}
                    onClick={() => toggleList(anime)}
                  >
                    {isInList(anime.id) ? (
                      <>
                        <FaCheck /> My List
                      </>
                    ) : (
                      <>
                        <FaPlus /> My List
                      </>
                    )}
                  </button>
                  {anime.siteUrl && (
                    <a
                      href={anime.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      <FaExternalLinkAlt /> AniList
                    </a>
                  )}
                  {anime.trailer?.site === "youtube" && (
                    <button
                      className="btn btn-secondary"
                      onClick={scrollToTrailer}
                    >
                      Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body container">
            <div className="modal-grid">
              <div className="modal-left">
                <p className="modal-description">
                  {sanitizeHtml(anime.description)}
                </p>
              </div>
              <div className="modal-right">
                <div className="modal-info-block">
                  <span className="label">Genres:</span>
                  <div className="genres-list">
                    {anime.genres.map((g) => (
                      <span key={g} className="genre-pill">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="modal-info-block">
                  <span className="label">Studios:</span>
                  <span>
                    {anime.studios?.nodes?.map((s) => s.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {anime.trailer?.site === "youtube" && (
              <div className="modal-trailer" ref={trailerRef}>
                <h3>Trailer</h3>
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
        </>
      )}
    </Modal>
  );
};

export default AnimeDetailsModal;
