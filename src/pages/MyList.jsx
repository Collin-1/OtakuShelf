import React from "react";
import { useMyList } from "../context/MyListContext";
import AnimeCard from "../components/AnimeCard";
import "../styles/MyList.css";

const MyList = ({ onAnimeClick }) => {
  const { list } = useMyList();

  return (
    <div className="mylist-page container">
      <h1 className="page-title">My List</h1>

      {list.length === 0 ? (
        <div className="empty-list">
          <p>Your list is empty.</p>
          <p className="sub-text">
            Add shows and movies to keep track of what you want to watch.
          </p>
        </div>
      ) : (
        <div className="anime-grid">
          {list.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} onClick={onAnimeClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;
