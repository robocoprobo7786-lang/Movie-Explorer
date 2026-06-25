import type { Movie } from '../types/movies';

interface MovieModalProps {
    movie: Movie | null;
    isOpen: boolean;
    onClose: () => void;
    isFavorite?: boolean;
    isInWatchlist?: boolean;
    onToggleFavorite?: () => void;
    onToggleWatchlist?: () => void;
}

export const MovieModal = ({ movie, isOpen, onClose, isFavorite, isInWatchlist, onToggleFavorite, onToggleWatchlist }: MovieModalProps) => {
    if (!isOpen || !movie) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
                >
                    ✕
                </button>

                <div className="md:w-1/2 shrink-0">
                    <img
                        src={movie.poster}
                        alt={`${movie.title} poster`}
                        className="w-full h-full object-cover max-h-[60vh] md:max-h-none aspect-[2/3]"
                    />
                </div>

                <div className="p-8 flex flex-col justify-center text-slate-50 md:w-1/2">
                    <h2 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                        {movie.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-semibold text-slate-300">
                        <span className="bg-white/10 px-3 py-1 rounded-full">{movie.year}</span>
                        <span className="flex items-center gap-1 text-yellow-400 bg-black/30 px-3 py-1 rounded-full">
                            ★ {movie.rating}
                        </span>
                        <span className="bg-white/10 px-3 py-1 rounded-full text-sky-300">
                            {movie.genre.join(', ')}
                        </span>
                    </div>

                    <p className="text-lg leading-relaxed text-slate-300">
                        {movie.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleWatchlist?.();
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isInWatchlist
                                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite?.();
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isFavorite
                                ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            {isFavorite ? 'Favorite' : 'Add to Favorites'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
