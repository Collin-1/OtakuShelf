import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import FiltersBar from "../components/FiltersBar";
import AnimeCard from "../components/AnimeCard";
import Pagination from "../components/Pagination";
import { GridSkeleton } from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { searchAnime } from "../api/anilist";
import { FaSearch } from "react-icons/fa";
import "../styles/Search.css";

const Search = ({ onAnimeClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    genre: "",
    format: "",
    year: "",
    season: "",
    sort: "TRENDING_DESC",
  });
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Debounce logic handled by effect dependency + timeout if needed,
  // or just firing on enter? User asked for debounce 400-600ms.
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Update URL to match search query
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    setSearchParams(params, { replace: true });
  }, [debouncedQuery]);

  // Update query if URL changes (e.g. navigation from Navbar)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    // Reset page when filters or query change
    setPage(1);
  }, [debouncedQuery, filters]);

  useEffect(() => {
    const fetchResults = async () => {
      // If we are searching, we usually want at least a query or some filter.
      // But we can also show default popular if empty.
      // Let's load trending if everything is empty?
      // API search accepts empty search string but might require at least one argument?
      // No, Page query works without arguments.

      setLoading(true);
      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const titleSearch = debouncedQuery.trim() ? debouncedQuery : undefined;
        // Construct params excluding empty strings
        const params = {
          search: titleSearch,
          genre: filters.genre || undefined,
          format: filters.format || undefined,
          season: filters.season || undefined,
          year: filters.year ? parseInt(filters.year) : undefined,
          sort: filters.sort ? [filters.sort] : undefined,
        };

        const data = await searchAnime(
          params,
          page,
          20,
          abortControllerRef.current.signal,
        );
        setResults(data.Page.media);
        setPageInfo(data.Page.pageInfo);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Something went wrong while searching.");
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [debouncedQuery, filters, page]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="search-page container">
      <div className="search-header">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <FiltersBar filters={filters} onFilterChange={handleFilterChange} />

      {error && <ErrorState message={error} onRetry={() => setPage(1)} />}

      {loading ? (
        <GridSkeleton />
      ) : (
        <>
          {results.length === 0 && !error && (
            <div className="no-results">No results found.</div>
          )}
          <div className="anime-grid">
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} onClick={onAnimeClick} />
            ))}
          </div>

          {pageInfo && (pageInfo.hasNextPage || pageInfo.currentPage > 1) && (
            <Pagination
              currentPage={pageInfo.currentPage}
              hasNextPage={pageInfo.hasNextPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Search;
