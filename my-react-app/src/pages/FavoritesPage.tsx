import { useState } from "react";
import moviesData from "../data/movies.json";
import { MovieCard } from "../components/MovieCard";
import { MovieModal } from "../components/MovieModal";
import type { Movie } from "../types/movies";

interface FavoritesPageProps {
    favorites: Set<string | number>;
    watchlist: Set<string | number>;
    toggleFavorite: (id: string | number) => void;
    toggleWatchlist: (id: string | number) => void;
}

export default function FavoritesPage({ favorites, watchlist, toggleFavorite, toggleWatchlist }: FavoritesPageProps) {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const favoriteMovies = moviesData.filter(movie => favorites.has(movie.id));

    return (
        <div className="p-4 sm:p-8 md:p-16">
            <header className="mb-8 sm:mb-10 md:mb-12 text-center max-w-5xl mx-auto">
            </header>

            {favoriteMovies.length === 0 ? (
                <div className="text-center pt-40">
                    <p className="text-2xl text-slate-400">Nothing to see here!</p>
                </div>
            ) : (
                <main className="grid grid-cols-1 min-[375px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
                    {favoriteMovies.map(movie => (
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
