import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { useFavorites } from '@/components/FavoritesContext';
import { getRecipeById, listIngredients, Ingredient, RecipeFull } from '../data/api';

export default function RecipeDetailPage() {
    const router = useRouter();
    const { id } = router.query as { id?: string };
    const { isAuthenticated } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`;
    const [recipe, setRecipe] = useState<RecipeFull | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (!id) return;

        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
            setErrorMessage('Invalid recipe id.');
            setIsLoading(false);
            return;
        }

        const loadRecipe = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const [recipeData, ingredientList] = await Promise.all([
                    getRecipeById(numericId),
                    listIngredients(),
                ]);
                setRecipe(recipeData);
                setIngredients(ingredientList);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to load recipe.';
                setErrorMessage(message);
                setRecipe(null);
            } finally {
                setIsLoading(false);
            }
        };

        void loadRecipe();
    }, [id]);

    const ingredientById = useMemo(
        () => new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])),
        [ingredients]
    );

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {isLoading ? (
                    <p className="text-gray-600">Loading recipe...</p>
                ) : !recipe ? (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h1>
                        <p className="text-gray-600">{errorMessage || 'Make sure you accessed with a valid id.'}</p>
                    </div>
                ) : (
                    <article>
                        <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                            <img src={recipe.image_url} alt={recipe.name} className="h-full w-full object-cover" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
                        <p className="text-gray-600 mb-3">{recipe.category} • {recipe.country} • {formatDifficulty(recipe.difficulty)}</p>
                        <p className="text-gray-700 mb-6">{recipe.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h2 className="font-semibold text-gray-900 mb-2">Ingredients</h2>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {recipe.ingredients.map((ing) => {
                                        const ingredient = ingredientById.get(ing.id);
                                        if (!ingredient) {
                                            return <li key={ing.id}>Unknown ingredient (id {ing.id})</li>;
                                        }
                                        return (
                                            <li key={ing.id}>
                                                {ingredient.name}: {ing.qty} {ingredient.unit}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900 mb-2">Steps</h2>
                                <ol className="list-decimal list-inside text-sm text-gray-700">
                                    {recipe.steps.map((stp, idx) => <li key={idx} className="mb-1">{stp}</li>)}
                                </ol>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-600">Prep time: {recipe.prep_time} min</div>
                            <button
                                aria-label={isFavorite(recipe.id) ? 'Remove favorite' : 'Add favorite'}
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        const redirect = `/recipe-detail?id=${recipe.id}`;
                                        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
                                        return;
                                    }
                                    toggleFavorite(recipe.id);
                                }}
                                className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${isFavorite(recipe.id)
                                    ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {isFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                    </article>
                )}
            </section>
        </main>
    );
}
