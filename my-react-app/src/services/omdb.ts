import type { Movie } from '../types/movies';

const BASE_URL = "https://www.omdbapi.com/";
// Helper to get the API key
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  if (!apiKey) {
    throw new Error('OMDb API key is missing. Please set VITE_OMDB_API_KEY in your environment variables.');
  }
  return apiKey;
};

// --- OMDb Internal Types ---
export interface SearchMovieResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface SearchMoviesResponse {
  Search?: SearchMovieResult[];
  totalResults?: string;
  Response: string; // 'True' or 'False'
  Error?: string;
}

export interface MovieDetailsResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string; // 'True' or 'False'
  Error?: string;
}

// --- Mapping Layer ---

/**
 * Maps a minimal OMDb search result to our app's Movie interface.
 */
const mapOMDbSearchResultToMovie = (omdbMovie: SearchMovieResult): Movie => {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title || 'Unknown Title',
    year: parseInt(omdbMovie.Year, 10) || 0,
    genre: [], // OMDb search results don't include genres
    rating: 0, // OMDb search results don't include ratings
    poster: omdbMovie.Poster && omdbMovie.Poster !== 'N/A'
      ? omdbMovie.Poster
      : 'https://via.placeholder.com/300x450?text=No+Poster',
    description: 'No description available.'
  };
};

/**
 * Maps a detailed OMDb movie response to our app's Movie interface.
 */
const mapOMDbDetailsToMovie = (omdbMovie: MovieDetailsResponse): Movie => {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title || 'Unknown Title',
    year: parseInt(omdbMovie.Year, 10) || 0,
    genre: omdbMovie.Genre && omdbMovie.Genre !== 'N/A'
      ? omdbMovie.Genre.split(',').map(g => g.trim())
      : [],
    rating: omdbMovie.imdbRating && omdbMovie.imdbRating !== 'N/A'
      ? parseFloat(omdbMovie.imdbRating)
      : 0,
    poster: omdbMovie.Poster && omdbMovie.Poster !== 'N/A'
      ? omdbMovie.Poster
      : 'https://via.placeholder.com/300x450?text=No+Poster',
    description: omdbMovie.Plot && omdbMovie.Plot !== 'N/A'
      ? omdbMovie.Plot
      : 'No description available.'
  };
};

// --- Exported API Methods ---

/**
 * Searches for movies by title query.
 * @param query The search term
 * @returns A promise that resolves to an array of mapped Movie objects
 */
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const apiKey = getApiKey();
    const url = `${BASE_URL}?apikey=${apiKey}&s=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SearchMoviesResponse = await response.json();

    // OMDb returns a 200 OK even if the search fails, with Response: "False"
    if (data.Response === 'False') {
      // If it's just "Movie not found!", return an empty array instead of throwing
      if (data.Error === 'Movie not found!') {
        return [];
      }
      throw new Error(data.Error || 'Failed to search movies');
    }

    return (data.Search || []).map(mapOMDbSearchResultToMovie);
  } catch (error) {
    console.error('Error in searchMovies:', error);
    throw error;
  }
};

/**
 * Gets detailed information about a movie by its ID.
 * @param id The IMDb ID string (e.g., "tt1285016") or internal numeric ID.
 * @returns A promise that resolves to a mapped Movie object
 */
export const getMovieDetails = async (id: string | number): Promise<Movie> => {
  try {
    const apiKey = getApiKey();
    const imdbID = id.toString();

    // Include 'plot=full' for a comprehensive plot description
    const url = `${BASE_URL}?apikey=${apiKey}&i=${encodeURIComponent(imdbID)}&plot=full`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MovieDetailsResponse = await response.json();

    // OMDb returns a 200 OK even if the request fails, with Response: "False"
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Failed to get movie details');
    }

    return mapOMDbDetailsToMovie(data);
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    throw error;
  }
};
