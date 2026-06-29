import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem('movie_explorer_auth');
            return stored ? JSON.parse(stored) === true : false;
        } catch (error) {
            console.warn('Error reading auth state from localStorage', error);
            return false;
        }
    });

    const login = (email: string, password: string): boolean => {
        if (email === 'demo@movieexplorer.com' && password === 'password123') {
            setIsAuthenticated(true);
            try {
                localStorage.setItem('movie_explorer_auth', JSON.stringify(true));
            } catch (error) {
                console.warn('Error saving auth state to localStorage', error);
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        try {
            localStorage.removeItem('movie_explorer_auth');
        } catch (error) {
            console.warn('Error removing auth state from localStorage', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
