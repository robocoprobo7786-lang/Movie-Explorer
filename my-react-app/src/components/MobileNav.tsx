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
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const toggleOpen = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    // Lock body scroll while drawer is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close drawer when window resizes to desktop width
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 768) handleClose(); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Escape key, focus trap, focus restore
    useEffect(() => {
        if (!isOpen) {
            previousFocusRef.current?.focus();
            previousFocusRef.current = null;
            return;
        }

        previousFocusRef.current = document.activeElement as HTMLElement;

        const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { handleClose(); return; }
            if (e.key !== 'Tab' || !drawerRef.current) return;

            const focusable = Array.from(
                drawerRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => { window.removeEventListener('keydown', onKeyDown); clearTimeout(timer); };
    }, [isOpen]);

    return (
        <>
            {/* Hamburger button — always visible on mobile */}
            <button
                ref={hamburgerRef}
                onClick={toggleOpen}
                aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-drawer"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
                <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
                <div className="w-5 flex flex-col gap-[5px]">
                    <span className={`block h-0.5 w-5 bg-slate-100 rounded transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                    <span className={`block h-0.5 w-5 bg-slate-100 rounded transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                    <span className={`block h-0.5 w-5 bg-slate-100 rounded transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
            </button>

            {/* Backdrop — no backdrop-blur to avoid GPU compositing jitter during slide */}
            <div
                onClick={handleClose}
                aria-hidden="true"
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Drawer — will-change pre-promotes to GPU layer, ease-out feels natural for slide-in */}
            <div
                id="mobile-drawer"
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                aria-hidden={!isOpen}
                className={`fixed top-0 right-0 h-screen w-72 max-w-[85vw] bg-slate-900 border-l border-white/10 z-50 flex flex-col shadow-2xl will-change-transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer header — matches the app header height (h-16) */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-white/10 shrink-0">
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                        Movie Explorer
                    </span>
                    <button
                        ref={closeButtonRef}
                        onClick={handleClose}
                        aria-label="Close navigation menu"
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                    <NavLink
                        to="/"
                        onClick={handleClose}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
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
                            `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                            }`
                        }
                    >
                        <span>Favorites</span>
                        {favoritesCount > 0 && (
                            <span className="bg-sky-500/20 text-sky-400 py-0.5 px-2.5 rounded-full text-xs font-bold">
                                {favoritesCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        to="/watchlist"
                        onClick={handleClose}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                            }`
                        }
                    >
                        <span>Watchlist</span>
                        {watchlistCount > 0 && (
                            <span className="bg-sky-500/20 text-sky-400 py-0.5 px-2.5 rounded-full text-xs font-bold">
                                {watchlistCount}
                            </span>
                        )}
                    </NavLink>

                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-3 mt-2 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-transparent transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                        >
                            Logout
                        </button>
                    )}
                </nav>
            </div>
        </>
    );
};
