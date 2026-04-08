import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';

export default function SavedRecipes() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login?redirect=/saved-recipes');
        }
    }, [isAuthenticated, router]);

    const [recipes, setRecipes] = useState([
        {
            id: 1,
            name: 'My First Recipe',
            category: 'plat',
            createdDate: '2024-02-15',
        },
    ]);

    const handleDeleteRecipe = (id: number) => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header currentPage="saved-recipes" />
            <div className="py-8 sm:py-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">My Saved Recipes</h1>
                            <p className="text-xs sm:text-sm text-gray-600">Recipes you've created and saved</p>
                        </div>
                        <Link href="/create-recipe">
                            <button className="w-full sm:w-auto bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base active:scale-95 transform">
                                + Create New Recipe
                            </button>
                        </Link>
                    </div>

                    {!isAuthenticated && (
                        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center mb-8">
                            <p className="text-sm sm:text-base text-gray-600 mb-4">You need to be logged in to view saved recipes.</p>
                            <Link href="/login" className="text-primary hover:text-secondary font-semibold text-sm sm:text-base">
                                Go to login →
                            </Link>
                        </div>
                    )}

                    {recipes.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                            <p className="text-sm sm:text-base text-gray-600 mb-4">No saved recipes yet.</p>
                            <Link href="/create-recipe" className="text-primary hover:text-secondary font-semibold text-sm sm:text-base">
                                Create your first recipe →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {recipes.map((recipe) => (
                                <div key={recipe.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow active:scale-95 transform">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">{recipe.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{recipe.category}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Created: {recipe.createdDate}</p>
                                    <div className="flex gap-2 sm:gap-3">
                                        <button className="flex-1 bg-secondary text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm active:scale-95 transform">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRecipe(recipe.id)}
                                            className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm active:scale-95 transform"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
