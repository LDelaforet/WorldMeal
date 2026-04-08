import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/AuthContext';

type FavoritesContextValue = {
    favorites: number[]; // recipe IDs
    isFavorite: (id: number) => boolean;
    addFavorite: (id: number) => void;
    removeFavorite: (id: number) => void;
    toggleFavorite: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const STORAGE_PREFIX = 'wm_favorites_';

function getStorageKey(email?: string) {
    return `${STORAGE_PREFIX}${email || 'guest'}`;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<number[]>([]);

    // Load favorites when user changes
    useEffect(() => {
        try {
            const key = getStorageKey(user?.email);
            const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
            const parsed = raw ? (JSON.parse(raw) as number[]) : [];
            setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch {
            setFavorites([]);
        }
    }, [user?.email]);

    // Persist favorites on change
    useEffect(() => {
        try {
            const key = getStorageKey(user?.email);
            localStorage.setItem(key, JSON.stringify(favorites));
        } catch { }
    }, [favorites, user?.email]);

    const isFavorite = (id: number) => favorites.includes(id);
    const addFavorite = (id: number) => setFavorites(prev => (prev.includes(id) ? prev : [...prev, id]));
    const removeFavorite = (id: number) => setFavorites(prev => prev.filter(x => x !== id));
    const toggleFavorite = (id: number) => setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

    const value = useMemo<FavoritesContextValue>(() => ({ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }), [favorites]);

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
    return ctx;
}
