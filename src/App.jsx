import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MyList from "./pages/MyList";
import AnimeDetailsModal from "./components/AnimeDetailsModal";
import { MyListProvider } from "./context/MyListContext";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const animeId = searchParams.get("anime");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (animeId) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [animeId]);

  const handleAnimeClick = (anime) => {
    setSearchParams((prev) => {
      // preserve other params? depends. for now just set anime.
      // Actually best to append to current search if on search page?
      // But the modal is global.
      // Let's just set 'anime'.
      const newParams = new URLSearchParams(prev);
      newParams.set("anime", anime.id);
      return newParams;
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("anime");
      return newParams;
    });
  };

  return (
    <MyListProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home onAnimeClick={handleAnimeClick} />} />
          <Route
            path="/search"
            element={<Search onAnimeClick={handleAnimeClick} />}
          />
          <Route
            path="/my-list"
            element={<MyList onAnimeClick={handleAnimeClick} />}
          />
        </Routes>
      </main>

      <AnimeDetailsModal
        isOpen={modalOpen}
        animeId={animeId ? parseInt(animeId) : null}
        onClose={handleCloseModal}
      />
    </MyListProvider>
  );
}

export default App;
