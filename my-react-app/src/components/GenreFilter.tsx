interface GenreFilterProps {
    genres: string[];
    selectedGenre: string;
    onChange: (genre: string) => void;
}

export const GenreFilter = ({ genres, selectedGenre, onChange }: GenreFilterProps) => {
    return (
        <div className="w-full relative mb-10">
            <select
                value={selectedGenre}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-full px-6 py-4 text-lg backdrop-blur-md outline-none transition-all duration-300 focus-visible:bg-white/10  focus-visible:border-sky-400/50  focus-visible:shadow-[0_0_20px_rgba(56,189,248,0.2)] appearance-none cursor-pointer">
                <option value="" className="bg-slate-800 text-white">All Genres</option>
                {genres.map(genre => (
                    <option key={genre} value={genre} className="bg-slate-800 text-white">
                        {genre}
                    </option>
                ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    );
};
