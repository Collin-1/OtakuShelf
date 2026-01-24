import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMyList } from "../context/MyListContext";
import Logo from "../assets/otaku_shelf_logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { list } = useMyList();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
              to="/search"
              className={location.pathname === "/search" ? "active" : ""}
            >
              Search
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
