# OtakuShelf

A portfolio-quality React anime catalogue, inspired by Netflix. Built with vite, React, and standard CSS.
Powered by the [AniList API](https://github.com/AniList/ApiV2-GraphQL-Docs).

## Features

- **Home Page**: Netflix-style hero banner and horizontal scrollable rows (Trending, Popular, Top Rated, Seasonal, Movies).
- **Search**: Real-time search with debounce, filters (Genre, Format, Year, Season, Sort), and pagination.
- **My List**: Save your favorite anime to a local list (persisted in localStorage).
- **Details Modal**: Deep-linking supported modal with anime details, genres, studios, and embedded YouTube trailers.
- **Responsive**: Fully responsive design for desktop, tablet, and mobile.
- **Light Theme**: Clean, modern light-mode UI.

## Tech Stack

- **Framework**: React + Vite
- **Routing**: react-router-dom
- **Styling**: Standard CSS (Modular approach with CSS Variables)
- **Data**: Fetch API (GraphQL)
- **State**: React Context API + Hooks

## Setup & Run

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Run Development Server**

    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Project Structure

- `src/api`: AniList GraphQL client with caching.
- `src/components`: Reusable UI components.
- `src/context`: State management (My List).
- `src/pages`: Route components (Home, Search, MyList).
- `src/styles`: Global styles and variables.
- `src/utils`: Helper functions.

## Known Limitations

- **Trailers**: Some older anime might not have trailers or use sites other than YouTube (only YouTube is embedded).
- **Rate Limiting**: The AniList API has rate limits. If you hit them, you may see an error; wait a minute and retry.
- **Data Persistence**: "My List" is stored in browser `localStorage`. Clearing cache will wipe the list.

---
