import React from "react";
import { GENRES, FORMATS } from "../api/anilist";
import "./FiltersBar.css";

const FiltersBar = ({ filters, onFilterChange }) => {
  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() + 1 - i,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Genre</label>
        <select
          name="genre"
          value={filters.genre || ""}
          onChange={handleChange}
        >
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Format</label>
        <select
          name="format"
          value={filters.format || ""}
          onChange={handleChange}
        >
          <option value="">All Formats</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Year</label>
        <select name="year" value={filters.year || ""} onChange={handleChange}>
          <option value="">Any Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Season</label>
        <select
          name="season"
          value={filters.season || ""}
          onChange={handleChange}
        >
          <option value="">Any Season</option>
          <option value="WINTER">Winter</option>
          <option value="SPRING">Spring</option>
          <option value="SUMMER">Summer</option>
          <option value="FALL">Fall</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort</label>
        <select
          name="sort"
          value={filters.sort || "TRENDING_DESC"}
          onChange={handleChange}
        >
          <option value="TRENDING_DESC">Trending</option>
          <option value="POPULARITY_DESC">Popularity</option>
          <option value="SCORE_DESC">Score</option>
          <option value="START_DATE_DESC">Newest</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;
