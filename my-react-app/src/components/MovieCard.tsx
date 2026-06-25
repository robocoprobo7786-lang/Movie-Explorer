import type { Movie } from '../types/movies';

interface MovieCardProps {
    movie: Movie;
    isFavorite: boolean;
    isInWatchlist: boolean;
    onToggleFavorite: () => void;
    onToggleWatchlist: () => void;
    onClick: () => void;
}

export const MovieCard = ({ movie, isFavorite, isInWatchlist, onToggleFavorite, onToggleWatchlist, onClick }: MovieCardProps) => {
    return (
        <div
            onClick={onClick}
            className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-white/20 flex flex-col text-white cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.1)] group relative"
        >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist();
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${isInWatchlist
                            ? 'bg-blue-500/80 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                            : 'bg-black/30 text-white/50 hover:bg-black/50 hover:text-white'
                        }`}
                    aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${isFavorite
                            ? 'bg-red-500/80 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                            : 'bg-black/30 text-white/50 hover:bg-black/50 hover:text-white'
                        }`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="w-full aspect-[2/3] overflow-hidden">
                <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="p-3 sm:p-4 flex justify-between items-center gap-3">
                <h3 className="m-0 text-base sm:text-lg font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis font-sans">
                    {movie.title}
                </h3>
                <div className="flex items-center gap-1 text-[0.95rem] font-semibold text-yellow-400 bg-black/30 px-2 py-1 rounded-lg shrink-0">
                    <span className="text-base">★</span> {movie.rating}
                </div>
            </div>
        </div>
    );
};
