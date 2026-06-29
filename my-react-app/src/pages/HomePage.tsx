import { useState, useMemo, useEffect } from "react";
import moviesData from "../data/movies.json";
import { MovieCard } from "../components/MovieCard";
import { SearchBar } from "../components/SearchBar";
import { GenreFilter } from "../components/GenreFilter";
import { MovieModal } from "../components/MovieModal";
import useDebounce from "../hooks/useDebounce";
import { searchMovies } from "../services/omdb";
import type { Movie } from "../types/movies";

interface HomePageProps {
    favorites: Set<string | number>;
    watchlist: Set<string | number>;
    toggleFavorite: (id: string | number) => void;
    toggleWatchlist: (id: string | number) => void;
}

export default function HomePage({ favorites, watchlist, toggleFavorite, toggleWatchlist }: HomePageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const [omdbMovies, setOmdbMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Fetch movies from OMDb when search term changes
    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setOmdbMovies([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await searchMovies(debouncedSearchTerm);
                setOmdbMovies(results);
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching movies.");
                setOmdbMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [debouncedSearchTerm]);

    // Compute genres from local data (OMDb search results don't include genres)
    const genres = useMemo(() => {
        const allGenres = new Set<string>();
        moviesData.forEach(movie => {
            movie.genre.forEach(g => allGenres.add(g));
        });
        return Array.from(allGenres).sort();
    }, []);

    // Compute the final list of movies to display
    const displayedMovies = useMemo(() => {
        const baseMovies = debouncedSearchTerm.trim() ? omdbMovies : moviesData;
        
        return baseMovies.filter(movie => {
            const matchesGenre = selectedGenre === "" || movie.genre.includes(selectedGenre);
            return matchesGenre;
        });
    }, [debouncedSearchTerm, omdbMovies, selectedGenre]);

    return (
        <div className="p-3 sm:p-8 md:p-16">
            <header className="mb-8 sm:mb-10 md:mb-12 text-center max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <div className="flex-1 w-full md:max-w-2xl">
                        <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    </div>
                    <div className="w-full md:w-64">
                        <GenreFilter genres={genres} selectedGenre={selectedGenre} onChange={setSelectedGenre} />
                    </div>
                </div>
            </header>
            
            <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
                    </div>
                ) : error ? (
                    <div className="col-span-full text-center text-lg text-red-400 py-12 bg-red-500/10 rounded-2xl border border-red-500/20 backdrop-blur-md">
                        {error}
                    </div>
                ) : displayedMovies.length === 0 ? (
                    <div className="col-span-full text-center text-lg text-slate-300 py-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                        No movies found.
                    </div>
                ) : (
                    displayedMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isFavorite={favorites.has(movie.id)}
                            isInWatchlist={watchlist.has(movie.id)}
                            onToggleFavorite={() => toggleFavorite(movie.id)}
                            onToggleWatchlist={() => toggleWatchlist(movie.id)}
                            onClick={() => setSelectedMovie(movie)}
                        />
                    ))
                )}
            </main>

            <MovieModal
                isOpen={!!selectedMovie}
                movie={selectedMovie}
                onClose={() => setSelectedMovie(null)}
                isFavorite={selectedMovie ? favorites.has(selectedMovie.id) : false}
                isInWatchlist={selectedMovie ? watchlist.has(selectedMovie.id) : false}
                onToggleFavorite={() => selectedMovie && toggleFavorite(selectedMovie.id)}
                onToggleWatchlist={() => selectedMovie && toggleWatchlist(selectedMovie.id)}
            />
        </div>
    );
}