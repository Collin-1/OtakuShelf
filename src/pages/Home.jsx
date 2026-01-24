import React, { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import RowCarousel from "../components/RowCarousel";
import { HeroSkeleton, RowSkeleton } from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import {
  getTrending,
  getPopular,
  getTopRated,
  getSeasonal,
  getMovies,
} from "../api/anilist";

const Home = ({ onAnimeClick }) => {
  const [data, setData] = useState({
    trending: [],
    popular: [],
    topRated: [],
    seasonal: [],
    movies: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      let season = "WINTER";
      if (currentMonth >= 2 && currentMonth <= 4) season = "SPRING";
      else if (currentMonth >= 5 && currentMonth <= 7) season = "SUMMER";
      else if (currentMonth >= 8 && currentMonth <= 10) season = "FALL";

      const [trendingRes, popularRes, topRatedRes, seasonalRes, moviesRes] =
        await Promise.all([
          getTrending(1, 15),
          getPopular(1, 15),
          getTopRated(1, 15),
          getSeasonal(season, currentYear, 1, 15),
          getMovies(1, 15),
        ]);

      setData({
        trending: trendingRes.Page.media,
        popular: popularRes.Page.media,
        topRated: topRatedRes.Page.media,
        seasonal: seasonalRes.Page.media,
        movies: moviesRes.Page.media,
      });
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load content. Please check your internet connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  if (loading) {
    return (
      <div className="container">
        <HeroSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    );
  }

  // Hero anime: Pick the first trending one
  const heroAnime = data.trending[0];

  return (
    <div className="home-page">
      {heroAnime && (
        <HeroBanner
          anime={heroAnime}
          onDetailsClick={onAnimeClick}
          onWatchClick={onAnimeClick} // Watch click also opens details but maybe I can pass a scrollToTrailer flag?
          // The user requested: "Watch Trailer” (scrolls to trailer in modal if available)"
          // For now, let's just open the details.
        />
      )}

      <div
        className="container rows-section"
        style={{ position: "relative", zIndex: 1, marginTop: "-100px" }}
      >
        {/* Negative margin to pull rows up over hero potentially, or just normal layout. 
              Netflix rows overlap the hero slightly sometimes. Let's keep it simple first.
          */}

        <RowCarousel
          title="Trending Now"
          animes={data.trending}
          onAnimeClick={onAnimeClick}
        />
        <RowCarousel
          title="Popular This Season"
          animes={data.seasonal}
          onAnimeClick={onAnimeClick}
        />
        <RowCarousel
          title="All Time Popular"
          animes={data.popular}
          onAnimeClick={onAnimeClick}
        />
        <RowCarousel
          title="Top Rated"
          animes={data.topRated}
          onAnimeClick={onAnimeClick}
        />
        <RowCarousel
          title="Blockbuster Movies"
          animes={data.movies}
          onAnimeClick={onAnimeClick}
        />
      </div>
    </div>
  );
};

export default Home;
