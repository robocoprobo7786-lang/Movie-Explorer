import { NavLink } from 'react-router-dom';

interface HeaderProps {
    favoritesCount: number;
    watchlistCount: number;
}

export const Header = ({ favoritesCount, watchlistCount }: HeaderProps) => {
    return (
        <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-slate-900/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                            Movie Explorer
                        </NavLink>
                    </div>
                    <nav className="flex space-x-8">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `text-sm font-medium transition-colors ${isActive ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            to="/favorites" 
                            className={({ isActive }) => 
                                `text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`
                            }
                        >
                            Favorites
                            {favoritesCount > 0 && (
                                <span className="bg-sky-500/20 text-sky-400 py-0.5 px-2 rounded-full text-xs font-bold">
                                    {favoritesCount}
                                </span>
                            )}
                        </NavLink>
                        <NavLink 
                            to="/watchlist" 
                            className={({ isActive }) => 
                                `text-sm font-medium transition-colors flex items-center gap-2 ${isActive ? 'text-sky-400' : 'text-slate-300 hover:text-white'}`
                            }
                        >
                            Watchlist
                            {watchlistCount > 0 && (
                                <span className="bg-sky-500/20 text-sky-400 py-0.5 px-2 rounded-full text-xs font-bold">
                                    {watchlistCount}
                                </span>
                            )}
                        </NavLink>
                    </nav>
                </div>
            </div>
        </header>
    );
};
