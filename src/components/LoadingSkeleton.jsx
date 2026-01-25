import React from "react";
import "./LoadingSkeleton.css";

export const CardSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image pulse"></div>
      <div className="skeleton-text short pulse"></div>
      <div className="skeleton-text shorter pulse"></div>
    </div>
  );
};

export const RowSkeleton = () => {
  return (
    <div className="skeleton-row">
      <div className="skeleton-header pulse"></div>
      <div className="skeleton-row-cards">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return <div className="skeleton-hero pulse"></div>;
};

export const GridSkeleton = () => {
  return (
    <div className="anime-grid">
      {[...Array(10)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
