interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="w-full max-w-2xl mx-auto mb-10">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-400 rounded-full px-6 py-4 text-lg backdrop-blur-md outline-none transition-all duration-300 focus:bg-white/10 focus:border-sky-400/50 focus:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                />
                <svg
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>
        </div>
    );
};
