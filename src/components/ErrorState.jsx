import React from "react";

const ErrorState = ({ message, onRetry }) => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h3>Oops! Something went wrong.</h3>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
