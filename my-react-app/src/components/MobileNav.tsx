import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MobileNavProps {
    favoritesCount: number;
    watchlistCount: number;
}

export const MobileNav = ({ favoritesCount, watchlistCount }: MobileNavProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
    const drawerRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const firstFocusableRef = useRef<HTMLAnchorElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const toggleOpen = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    // Body scroll locking when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Prevent scroll lock bug if window is resized to desktop width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Accessibility: ESC listener, focus traps, focus restore
    useEffect(() => {
        if (isOpen) {
            // Save currently active element to restore on close
            previousFocusRef.current = document.activeElement as HTMLElement;
            
            // Wait for transition/render to focus the first interactive item (close button)
            const focusTimer = setTimeout(() => {
                firstFocusableRef.current?.focus();
            }, 150);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    handleClose();
                }

                if (e.key === 'Tab') {
                    if (!drawerRef.current) return;
                    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
                        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    );
                    if (focusableElements.length === 0) return;

                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        // Shift + Tab (backward tab)
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        // Tab (forward tab)
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                clearTimeout(focusTimer);
            };
        } else {
            // Restore focus when closing
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
                previousFocusRef.current = null;
            }
        }
    }, [isOpen]);

    return (
        <div className="relative">
            {/* Hamburger Button */}
            <button
                ref={hamburgerRef}
                onClick={toggleOpen}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 z-50"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
            >
                <div className="relative w-5 h-4 flex flex-col justify-between items-center">
                    <span className={`block w-5 h-0.5 bg-slate-100 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-slate-100 rounded transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                    <span className={`block w-5 h-0.5 bg-slate-100 rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
            </button>

            {/* Drawer Overlay (Backdrop) */}
            <div
                onClick={handleClose}
                className={`fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
            />

            {/* Vertical Navigation Drawer Container */}
            <div
                ref={drawerRef}
                className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 max-w-[85vw] bg-slate-900 border-l border-white/10 z-40 p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out transform ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation drawer"
                aria-hidden={!isOpen}
            >
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-2">
                    <NavLink
                        ref={firstFocusableRef}
                        to="/"
                        onClick={handleClose}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                isActive 
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    
                    <NavLink
                        to="/favorites"
                        onClick={handleClose}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                isActive 
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                            }`
                        }
                    >
                        <span>Favorites</span>
                        {favoritesCount > 0 && (
                            <span className="bg-sky-500/20 text-sky-400 py-0.5 px-2.5 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                                {favoritesCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        to="/watchlist"
                        onClick={handleClose}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                                isActive 
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                            }`
                        }
                    >
                        <span>Watchlist</span>
                        {watchlistCount > 0 && (
                            <span className="bg-sky-500/20 text-sky-400 py-0.5 px-2.5 rounded-full text-xs font-bold shadow-[0_0_10px_rgba(56,189,248,0.1)]">
                                {watchlistCount}
                            </span>
                        )}
                    </NavLink>

                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </div>
    );
};
