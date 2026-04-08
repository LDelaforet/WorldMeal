import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/AuthContext';

interface HeaderProps {
    currentPage?: 'home' | 'recipes' | 'ingredients' | 'saved-recipes' | 'favorites' | 'profile';
}

export default function Header({ currentPage }: HeaderProps) {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    const isActive = (page?: string) => {
        if (!page) return false;
        if (page === 'home') return router.pathname === '/';
        return router.pathname === `/${page}`;
    };

    const getLinkClass = (page?: string) => {
        const baseClass = 'text-gray-700 hover:text-primary font-medium pb-2 transition-colors';
        const activeClass =
            page === currentPage || isActive(page)
                ? 'border-b-2 border-primary text-primary'
                : '';
        return `${baseClass} ${activeClass}`;
    };

    const getMobileLinkClass = (page?: string) => {
        const baseClass = 'block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 font-medium rounded-lg transition-colors';
        const activeClass =
            page === currentPage || isActive(page)
                ? 'bg-amber-50 text-primary'
                : '';
        return `${baseClass} ${activeClass}`;
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                        <span className="text-xl sm:text-2xl font-bold text-primary">🍽️</span>
                        <span className="text-sm sm:text-xl font-bold text-gray-900">WORLD MEAL</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className={getLinkClass('home')}>
                        Home
                    </Link>
                    <Link href="/recipes" className={getLinkClass('recipes')}>
                        Recipes
                    </Link>
                    <Link href="/ingredients" className={getLinkClass('ingredients')}>
                        Ingredients
                    </Link>
                    <a href="#" className="text-gray-700 hover:text-primary font-medium pb-2 transition-colors">
                        About
                    </a>
                    {isAuthenticated && (
                        <>
                            <Link href="/favorites" className={getLinkClass('favorites')}>
                                Favorites
                            </Link>
                            <Link href="/saved-recipes" className={getLinkClass('saved-recipes')}>
                                Saved Recipes
                            </Link>
                            <Link href="/create-recipe" className={getLinkClass('recipes')}>
                                Create Recipe
                            </Link>
                        </>
                    )}
                </div>

                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/profile">
                                <button className="px-3 sm:px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-medium text-sm sm:text-base">
                                    Profile
                                </button>
                            </Link>
                            <button onClick={logout} className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium text-sm sm:text-base">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="px-3 sm:px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-medium text-sm sm:text-base">
                                    Login
                                </button>
                            </Link>
                            <Link href="/recipes">
                                <button className="px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-full hover:opacity-90 transition-opacity font-medium text-sm sm:text-base">
                                    Explore
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-4 space-y-2">
                        <Link href="/">
                            <div onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('home')}>
                                Home
                            </div>
                        </Link>
                        <Link href="/recipes">
                            <div onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('recipes')}>
                                Recipes
                            </div>
                        </Link>
                        <Link href="/ingredients">
                            <div onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('ingredients')}>
                                Ingredients
                            </div>
                        </Link>
                        <a href="#" className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 font-medium rounded-lg transition-colors">
                            About
                        </a>
                        {isAuthenticated && (
                            <>
                                <Link href="/favorites">
                                    <div onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('favorites')}>
                                        Favorites
                                    </div>
                                </Link>
                                <Link href="/saved-recipes">
                                    <div onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('saved-recipes')}>
                                        Saved Recipes
                                    </div>
                                </Link>
                                <Link href="/create-recipe">
                                    <div onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('recipes')}>
                                        Create Recipe
                                    </div>
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Buttons */}
                        <div className="pt-4 space-y-2 border-t border-gray-200">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/profile">
                                        <button onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-2.5 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-medium text-sm">
                                            Profile
                                        </button>
                                    </Link>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 bg-red-600 text-white rounded-full hover:opacity-90 transition-opacity font-medium text-sm">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <button onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-2.5 border-2 border-gray-900 text-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-colors font-medium text-sm">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/recipes">
                                        <button onClick={() => setMobileMenuOpen(false)} className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-full hover:opacity-90 transition-opacity font-medium text-sm">
                                            Explore
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
