import React from "react";
import "./Pagination.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, hasNextPage, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        className="btn btn-secondary pagination-btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FaChevronLeft /> Prev
      </button>

      <span className="pagination-info">Page {currentPage}</span>

      <button
        className="btn btn-secondary pagination-btn"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
