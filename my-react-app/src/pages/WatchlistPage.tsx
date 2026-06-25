import { useState } from "react";
import moviesData from "../data/movies.json";
import { MovieCard } from "../components/MovieCard";
import { MovieModal } from "../components/MovieModal";
import type { Movie } from "../types/movies";

interface WatchlistPageProps {
    favorites: Set<number>;
    watchlist: Set<number>;
    toggleFavorite: (id: number) => void;
    toggleWatchlist: (id: number) => void;
}

export default function WatchlistPage({ favorites, watchlist, toggleFavorite, toggleWatchlist }: WatchlistPageProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const watchlistMovies = moviesData.filter(movie => watchlist.has(movie.id));

    return (
        <div className="p-8 md:p-16">
            <header className="mb-12 text-center max-w-5xl mx-auto">
            </header>

            {watchlistMovies.length === 0 ? (
                <div className="text-center pt-40">
                    <p className="text-2xl text-slate-400">Nothing to see here!</p>
                </div>
            ) : (
                <main className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 max-w-7xl mx-auto">
                    {watchlistMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            isFavorite={favorites.has(movie.id)}
                            isInWatchlist={watchlist.has(movie.id)}
                            onToggleFavorite={() => toggleFavorite(movie.id)}
                            onToggleWatchlist={() => toggleWatchlist(movie.id)}
                            onClick={() => setSelectedMovie(movie)}
                        />
                    ))}
                </main>
            )}

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
