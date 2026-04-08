import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { useFavorites } from '@/components/FavoritesContext';
import { listRecipes, RecipeSmall } from '../data/api';

export default function Favorites() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`;
    const [allRecipes, setAllRecipes] = useState<RecipeSmall[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login?redirect=/favorites');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const recipes = await listRecipes();
                setAllRecipes(recipes);
            } finally {
                setIsLoading(false);
            }
        };

        void loadRecipes();
    }, []);

    const { favorites, removeFavorite } = useFavorites();

    const favoriteRecipes = allRecipes.filter(r => favorites.includes(r.id));

    return (
        <main className="min-h-screen bg-gray-50">
            <Header currentPage="favorites" />
            <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">Favorite Recipes</h1>
                <p className="text-xs sm:text-sm text-gray-600 mb-8 sm:mb-12">Your collection of favorite recipes</p>

                {!isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <p className="text-sm sm:text-base text-gray-600 mb-4">You need to be logged in to view favorites.</p>
                        <Link href="/login" className="text-primary hover:text-secondary font-semibold text-sm sm:text-base">
                            Go to login →
                        </Link>
                    </div>
                )}

                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <p className="text-sm sm:text-base text-gray-600 mb-4">Loading recipes...</p>
                    </div>
                ) : favoriteRecipes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <p className="text-sm sm:text-base text-gray-600 mb-4">No favorite recipes yet.</p>
                        <Link href="/recipes" className="text-primary hover:text-secondary font-semibold text-sm sm:text-base">
                            Explore recipes →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {favoriteRecipes.map((recipe) => (
                            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow active:scale-95 transform">
                                <div className="bg-gray-300 h-40 sm:h-48 overflow-hidden">
                                    <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">{recipe.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{recipe.category}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Country: {recipe.country}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Difficulty: {formatDifficulty(recipe.difficulty)}</p>
                                    <div className="flex gap-2 sm:gap-3">
                                        <Link href={`/recipe-detail?id=${recipe.id}`} className="flex-1">
                                            <button className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm active:scale-95 transform">
                                                View Recipe
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => removeFavorite(recipe.id)}
                                            className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm active:scale-95 transform"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
