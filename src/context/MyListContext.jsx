import React, { createContext, useContext, useState, useEffect } from "react";

const MyListContext = createContext();

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within a MyListProvider");
  }
  return context;
};

const LOCAL_STORAGE_KEY = "otakushelf_mylist";

export const MyListProvider = ({ children }) => {
  const [list, setList] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load My List from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save My List to localStorage", e);
    }
  }, [list]);

  const addToList = (anime) => {
    setList((prev) => {
      if (prev.some((item) => item.id === anime.id)) return prev;
      // Store minimal data needed for display
      const minimalAnime = {
        id: anime.id,
        title: anime.title,
        coverImage: anime.coverImage,
        averageScore: anime.averageScore,
        format: anime.format,
        seasonYear: anime.seasonYear,
        genres: anime.genres || [],
      };
      return [...prev, minimalAnime];
    });
  };

  const removeFromList = (id) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleList = (anime) => {
    if (isInList(anime.id)) {
      removeFromList(anime.id);
    } else {
      addToList(anime);
    }
  };

  const isInList = (id) => {
    return list.some((item) => item.id === id);
  };

  return (
    <MyListContext.Provider
      value={{ list, addToList, removeFromList, toggleList, isInList }}
    >
      {children}
    </MyListContext.Provider>
  );
};
