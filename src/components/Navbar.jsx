import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMyList } from "../context/MyListContext";
import { FaSearch } from "react-icons/fa";
import Logo from "../assets/otaku_shelf_logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { list } = useMyList();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate even if empty to just go to search page?
    // Or only if has query. Let's allow simple click to open, enter to search.
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);
    } else if (showSearch && location.pathname !== "/search") {
      // If showing search and empty, maybe close it?
    }
  };

  // Close search if clicking outside? For simplified MVP:
  // Toggle button opens input.

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container navbar-content">
        <Link to="/" className="navbar-logo">
          <img src={Logo} alt="OtakuShelf" />
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/my-list"
              className={location.pathname === "/my-list" ? "active" : ""}
            >
              My List{" "}
              {list.length > 0 && <span className="badge">{list.length}</span>}
            </Link>
          </li>
          <li>
            <div
              className={`navbar-search-container ${showSearch ? "open" : ""}`}
            >
              <button
                className="search-icon-btn"
                onClick={() => {
                  setShowSearch(!showSearch);
                }}
              >
                <FaSearch />
              </button>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="navbar-search-input"
                />
              </form>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
