import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = {
    email: string;
    name?: string;
};

type AuthContextValue = {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'wm_auth_user';
const DEMO_EMAILS = ['demo@worldmeal.test', 'demo'];
const DEMO_PASSWORD = 'demo1234';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
            if (raw) {
                const parsed = JSON.parse(raw) as User;
                if (parsed?.email) setUser(parsed);
            }
        } catch { }
    }, []);

    const login = async (email: string, password: string) => {
        // Demo-only auth: check hardcoded credentials
        const ok = DEMO_EMAILS.includes(email.trim().toLowerCase()) && password === DEMO_PASSWORD;
        if (ok) {
            const demoUser: User = { email: 'demo@worldmeal.test', name: 'Demo User' };
            setUser(demoUser);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser)); } catch { }
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        try { localStorage.removeItem(STORAGE_KEY); } catch { }
    };

    const value = useMemo<AuthContextValue>(() => ({
        user,
        isAuthenticated: !!user,
        login,
        logout,
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
