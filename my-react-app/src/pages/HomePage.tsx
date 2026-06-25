import { useState, useMemo } from "react";
import moviesData from "../data/movies.json";
import { MovieCard } from "../components/MovieCard";
import { SearchBar } from "../components/SearchBar";
import { GenreFilter } from "../components/GenreFilter";
import { MovieModal } from "../components/MovieModal";
import type { Movie } from "../types/movies";

interface HomePageProps {
    favorites: Set<number>;
    watchlist: Set<number>;
    toggleFavorite: (id: number) => void;
    toggleWatchlist: (id: number) => void;
}

export default function HomePage({ favorites, watchlist, toggleFavorite, toggleWatchlist }: HomePageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const genres = useMemo(() => {
        const allGenres = new Set<string>();
        moviesData.forEach(movie => {
            movie.genre.forEach(g => allGenres.add(g));
        });
        return Array.from(allGenres).sort();
    }, []);

    const filteredMovies = moviesData.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === "" || movie.genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="p-8 md:p-16">
            <header className="mb-12 text-center max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                    <div className="flex-1 w-full md:max-w-2xl">
                        <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    </div>
                    <div className="w-full md:w-64">
                        <GenreFilter genres={genres} selectedGenre={selectedGenre} onChange={setSelectedGenre} />
                    </div>
                </div>
            </header>
            <main className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 max-w-7xl mx-auto">
                {filteredMovies.map(movie => (
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