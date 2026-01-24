const ANILIST_API_URL = "https://graphql.anilist.co";

// In-memory cache
const apiCache = new Map();

/**
 * Generic GraphQL Request
 * @param {string} query
 * @param {object} variables
 * @param {AbortSignal} [signal]
 */
async function graphqlRequest(query, variables = {}, signal) {
  const cacheKey = JSON.stringify({ query, variables });

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  if (signal) {
    options.signal = signal;
  }

  try {
    const response = await fetch(ANILIST_API_URL, options);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(
        json.errors?.[0]?.message || "Network response was not ok",
      );
    }

    if (json.errors) {
      // Specific AniList errors
      console.warn("AniList API Errors:", json.errors);
      // We might want to throw if data involves errors, but often partial data is returned.
      // For this app, let's throw if no data.
      if (!json.data) throw new Error(json.errors[0].message);
    }

    apiCache.set(cacheKey, json.data);
    return json.data;
  } catch (error) {
    if (error.name === "AbortError") {
      // Ignore abort errors
      throw error;
    }
    console.error("Anilist API Error:", error);
    throw error;
  }
}

// SHARED FRAGMENTS
const MEDIA_FRAGMENT = `
  id
  title {
    userPreferred
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    color
  }
  bannerImage
  description(asHtml: false)
  averageScore
  episodes
  format
  genres
  season
  seasonYear
  status
  siteUrl
  trailer {
    id
    site
  }
`;

// QUERIES

const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (sort: TRENDING_DESC, type: ANIME, isAdult: false) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

const POPULAR_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
       pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

const TOP_RATED_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
       pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (sort: SCORE_DESC, type: ANIME, isAdult: false) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

const SEASONAL_QUERY = `
  query ($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      media (season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

const MOVIES_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      media (format: MOVIE, sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($search: String, $genre: String, $format: MediaFormat, $season: MediaSeason, $year: Int, $sort: [MediaSort], $page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media (search: $search, genre: $genre, format: $format, season: $season, seasonYear: $year, sort: $sort, type: ANIME, isAdult: false) {
        ${MEDIA_FRAGMENT}
      }
    }
  }
`;

const DETAILS_QUERY = `
  query ($id: Int) {
    Media (id: $id, type: ANIME) {
      ${MEDIA_FRAGMENT}
      studios {
        nodes {
          name
        }
      }
      startDate {
        year
        month
        day
      }
    }
  }
`;

// EXPORTED FUNCTIONS

export const getTrending = (page = 1, perPage = 20) => {
  return graphqlRequest(TRENDING_QUERY, { page, perPage });
};

export const getPopular = (page = 1, perPage = 20) => {
  return graphqlRequest(POPULAR_QUERY, { page, perPage });
};

export const getTopRated = (page = 1, perPage = 20) => {
  return graphqlRequest(TOP_RATED_QUERY, { page, perPage });
};

export const getSeasonal = (season, year, page = 1, perPage = 20) => {
  return graphqlRequest(SEASONAL_QUERY, { season, year, page, perPage });
};

export const getMovies = (page = 1, perPage = 20) => {
  return graphqlRequest(MOVIES_QUERY, { page, perPage });
};

export const searchAnime = (params, page = 1, perPage = 20, signal) => {
  // params: { search, genre, format, season, year, sort }
  // sort default to TRENDING_DESC if not provided, or handle in component
  return graphqlRequest(SEARCH_QUERY, { ...params, page, perPage }, signal);
};

export const getAnimeById = (id) => {
  return graphqlRequest(DETAILS_QUERY, { id });
};

export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const FORMATS = [
  "TV",
  "MOVIE",
  "TV_SHORT",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
];
