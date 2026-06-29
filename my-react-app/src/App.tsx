import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchlistPage from "./pages/WatchlistPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useAuth } from "./context/AuthContext";

function App() {
    const { isAuthenticated } = useAuth();
    // We use Set under the hood, but useLocalStorage doesn't handle Set serialization automatically.
    // To keep things simple and beginner-friendly, we'll store arrays of IDs in localStorage,
    // and convert them to Sets for efficient lookup in our app.
    const [storedFavorites, setStoredFavorites] = useLocalStorage<number[]>("movie_favorites", []);
    const [storedWatchlist, setStoredWatchlist] = useLocalStorage<number[]>("movie_watchlist", []);

    const favorites = new Set(storedFavorites);
    const watchlist = new Set(storedWatchlist);

    const toggleFavorite = (movieId: number) => {
        const next = new Set(favorites);
        if (next.has(movieId)) {
            next.delete(movieId);
        } else {
            next.add(movieId);
        }
        setStoredFavorites(Array.from(next));
    };

    const toggleWatchlist = (movieId: number) => {
        const next = new Set(watchlist);
        if (next.has(movieId)) {
            next.delete(movieId);
        } else {
            next.add(movieId);
        }
        setStoredWatchlist(Array.from(next));
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-900 text-slate-50 font-sans antialiased">
                {isAuthenticated && <Header favoritesCount={favorites.size} watchlistCount={watchlist.size} />}
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <HomePage 
                                    favorites={favorites} 
                                    watchlist={watchlist} 
                                    toggleFavorite={toggleFavorite} 
                                    toggleWatchlist={toggleWatchlist} 
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/favorites" 
                        element={
                            <ProtectedRoute>
                                <FavoritesPage 
                                    favorites={favorites} 
                                    watchlist={watchlist} 
                                    toggleFavorite={toggleFavorite} 
                                    toggleWatchlist={toggleWatchlist} 
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/watchlist" 
                        element={
                            <ProtectedRoute>
                                <WatchlistPage 
                                    favorites={favorites} 
                                    watchlist={watchlist} 
                                    toggleFavorite={toggleFavorite} 
                                    toggleWatchlist={toggleWatchlist} 
                                />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/login" 
                        element={<LoginPage />} 
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
