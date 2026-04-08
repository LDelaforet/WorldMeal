import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { getHealthcheck, Ingredient, listIngredients, listRecipes, RecipeSmall } from '../data/api';

export default function Home() {
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const [recipes, setRecipes] = useState<RecipeSmall[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [healthStatus, setHealthStatus] = useState<'ok' | 'down' | 'loading'>('loading');

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await listRecipes();
                setRecipes(data);
            } catch {
                setRecipes([]);
            }
        };

        void loadRecipes();
    }, []);

    useEffect(() => {
        const loadHealthAndIngredients = async () => {
            try {
                const [health, ingredientList] = await Promise.all([
                    getHealthcheck(),
                    listIngredients(),
                ]);
                setHealthStatus(health.status === 'ok' ? 'ok' : 'down');
                setIngredients(ingredientList);
            } catch {
                setHealthStatus('down');
                setIngredients([]);
            }
        };

        void loadHealthAndIngredients();
    }, []);

    const categories = useMemo(() => {
        const map = new Map<string, number>();
        recipes.forEach((recipe) => {
            map.set(recipe.category, (map.get(recipe.category) || 0) + 1);
        });

        return Array.from(map.entries()).map(([name, recipeCount], index) => ({
            id: index + 1,
            name,
            description: `Explore ${name} recipes`,
            recipeCount,
        }));
    }, [recipes]);

    const countryFlagByName: Record<string, string> = {
        France: '/flags/france.png',
        Italy: '/flags/italy.png',
        Japan: '/flags/japan.png',
        Thailand: '/flags/singapore.png',
        Mexico: '/flags/mexico.png',
        India: '/flags/india.png',
        Spain: '/flags/spain.png',
        Greece: '/flags/greek.png',
        Germany: '/flags/germany.png',
        Brazil: '/flags/brazil.png',
        China: '/flags/china.png',
        Poland: '/flags/poland.png',
        Russia: '/flags/russia.png',
        Australia: '/flags/australia.png',
        Malaysia: '/flags/malaysia.png',
        'Saudi Arabia': '/flags/saudi-arabia.png',
        Singapore: '/flags/singapore.png',
        'United Kingdom': '/flags/united-kingdom.png',
        'United States': '/flags/united-states.png',
    };

    const countries = useMemo(() => {
        const map = new Map<string, number>();
        recipes.forEach((recipe) => {
            map.set(recipe.country, (map.get(recipe.country) || 0) + 1);
        });

        return Array.from(map.entries()).map(([name, recipeCount], index) => ({
            id: index + 1,
            name,
            flag: countryFlagByName[name] || '/globe.svg',
            recipeCount,
        }));
    }, [recipes]);

    const scrollBy = (direction: 1 | -1) => {
        const el = carouselRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.8; // scroll by ~80% of viewport width
        el.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-white">
            {/* Navigation */}
            <Header currentPage="home" />

            {/* Hero Section */}
            <section className="bg-linear-to-b from-amber-50 to-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                            Explore the World of<br />Culinary Treasures
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
                            Discover authentic recipes and cuisines from every corner of the globe
                        </p>
                    </div>

                    {/* Carousel/Image Grid - Compass Style */}
                    <div className="relative h-64 sm:h-80 mb-10 sm:mb-12 flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Center content */}
                            <div className="absolute z-20 text-center">
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Explore our collection</p>
                                <Link
                                    href="/recipes"
                                    className="inline-flex bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
                                >
                                    Start Exploring
                                </Link>
                            </div>

                            {/* Compass directions with images - Hidden on very small screens */}
                            <div className="absolute w-full h-full max-w-xs sm:max-w-md">
                                {/* Top */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-linear-to-br from-orange-400 to-orange-500 shadow-lg" />
                                {/* Right */}
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-linear-to-br from-red-400 to-red-500 shadow-lg" />
                                {/* Bottom */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-linear-to-br from-yellow-400 to-yellow-500 shadow-lg" />
                                {/* Left */}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-linear-to-br from-amber-400 to-amber-500 shadow-lg" />

                                {/* Diagonal placeholders - Hidden on small screens */}
                                <div className="hidden sm:block absolute top-8 right-8 w-20 h-20 rounded-lg bg-linear-to-br from-orange-300 to-orange-400 shadow-lg" />
                                <div className="hidden sm:block absolute top-8 left-8 w-20 h-20 rounded-lg bg-linear-to-br from-amber-300 to-amber-400 shadow-lg" />

                                {/* Compass rose lines */}
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                                    <line x1="200" y1="0" x2="200" y2="400" stroke="#ccc" strokeWidth="1" />
                                    <line x1="0" y1="200" x2="400" y2="200" stroke="#ccc" strokeWidth="1" />
                                    <circle cx="200" cy="200" r="150" fill="none" stroke="#ddd" strokeWidth="1" strokeDasharray="5,5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* API Status + Ingredients */}
            <section className="py-10 sm:py-14 px-4 sm:px-6 bg-amber-50/50 border-y border-amber-100">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">API Status & Ingredients</h2>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${healthStatus === 'ok'
                                ? 'bg-green-100 text-green-800'
                                : healthStatus === 'loading'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-red-100 text-red-800'
                                }`}
                        >
                            API: {healthStatus === 'ok' ? 'online' : healthStatus === 'loading' ? 'checking...' : 'offline'}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {ingredients.slice(0, 10).map((ingredient) => (
                            <span
                                key={ingredient.id}
                                className="px-3 py-1 rounded-full border border-gray-300 bg-white text-xs sm:text-sm text-gray-700"
                            >
                                {ingredient.name} ({ingredient.unit})
                            </span>
                        ))}
                    </div>

                    <Link href="/ingredients" className="text-primary font-semibold text-sm hover:text-secondary">
                        See all ingredients →
                    </Link>
                </div>
            </section>

            {/* Featured Categories Section */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Featured Categories</h2>
                        <Link href="/recipes" className="text-primary hover:text-secondary font-semibold text-xs sm:text-sm whitespace-nowrap">
                            VIEW ALL →
                        </Link>
                    </div>

                    {categories.length === 0 ? (
                        <p className="text-sm text-gray-600">No categories available yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/recipes?categories=${encodeURIComponent(category.name)}`}
                                    className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="h-40 bg-linear-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                        <span className="text-gray-600 text-sm sm:text-base">Category</span>
                                    </div>
                                    <div className="p-4 sm:p-6 bg-white">
                                        <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{category.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{category.description}</p>
                                        <span className="mt-3 sm:mt-4 inline-block text-primary hover:text-secondary font-semibold text-xs sm:text-sm">
                                            Explore →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Browse by Country – Carousel */}
            <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 mx-auto bg-gray-50">
                <div className="max-w-6xl my-auto mx-auto">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Browse by Country</h2>
                        <div className="hidden sm:flex gap-2">
                            <button onClick={() => scrollBy(-1)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">◄</button>
                            <button onClick={() => scrollBy(1)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100">►</button>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Mobile controls */}
                        <div className="sm:hidden flex justify-end gap-2 mb-3">
                            <button onClick={() => scrollBy(-1)} className="px-3 py-2 border border-gray-300 rounded-lg text-xs">◄</button>
                            <button onClick={() => scrollBy(1)} className="px-3 py-2 border border-gray-300 rounded-lg text-xs">►</button>
                        </div>

                        <div
                            ref={carouselRef}
                            className="overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {/* hide native scrollbar (WebKit) */}
                            <style jsx>{`
                                div::-webkit-scrollbar { display: none; }
                            `}</style>

                            {countries.length === 0 ? (
                                <p className="text-sm text-gray-600 py-2">No countries available yet.</p>
                            ) : (
                                <div className="flex gap-4 sm:gap-6 py-2">
                                    {countries.map((country) => (
                                        <Link
                                            key={country.id}
                                            href={`/recipes?countries=${encodeURIComponent(country.name)}`}
                                            className="snap-start shrink-0 w-40 sm:w-44 md:w-48"
                                        >
                                            <div className="flex flex-col items-center cursor-pointer">
                                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-400 flex items-center justify-center mb-2 sm:mb-3 hover:border-primary transition-colors hover:scale-110 active:scale-95 bg-white overflow-hidden">
                                                    <img
                                                        src={country.flag}
                                                        alt={`${country.name} flag`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">{country.name}</p>
                                                <p className="text-xs text-gray-600 text-center">{country.recipeCount} recipes</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-xs sm:text-sm">&copy; 2024 World Meal. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
