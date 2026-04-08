import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/router';

interface FormData {
    name: string;
    cuisine: string;
    servings: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    steps: string[];
    [key: string]: string | string[];
}

export default function CreateRecipe() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login?redirect=/create-recipe');
        }
    }, [isAuthenticated, router]);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        cuisine: '',
        servings: '',
        prepTime: '',
        cookTime: '',
        ingredients: [''],
        steps: [''],
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleArrayChange = (field: string, index: number, value: string) => {
        const newArray = [...(formData[field] as string[])];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, ''],
        });
    };

    const addStep = () => {
        setFormData({
            ...formData,
            steps: [...formData.steps, ''],
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Recipe submitted:', formData);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header currentPage="recipes" />
            <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Create Your Recipe</h1>

                {!isAuthenticated && (
                    <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center mb-6">
                        <p className="text-sm sm:text-base text-gray-600 mb-2">You need to be logged in to create recipes.</p>
                        <a href="/login" className="text-primary hover:text-secondary font-semibold text-sm sm:text-base">Go to login →</a>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
                    {/* Basic Info */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Recipe Details</h2>

                        <div className="mb-4 sm:mb-6">
                            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Recipe Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                placeholder="e.g., Spaghetti Carbonara"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                            <div>
                                <label htmlFor="cuisine" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Cuisine Type
                                </label>
                                <input
                                    type="text"
                                    id="cuisine"
                                    value={formData.cuisine}
                                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    placeholder="e.g., Italian"
                                />
                            </div>

                            <div>
                                <label htmlFor="servings" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Servings
                                </label>
                                <input
                                    type="number"
                                    id="servings"
                                    value={formData.servings}
                                    onChange={(e) => handleInputChange('servings', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                            <div>
                                <label htmlFor="prepTime" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Prep Time (mins)
                                </label>
                                <input
                                    type="number"
                                    id="prepTime"
                                    value={formData.prepTime}
                                    onChange={(e) => handleInputChange('prepTime', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="cookTime" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Cook Time (mins)
                                </label>
                                <input
                                    type="number"
                                    id="cookTime"
                                    value={formData.cookTime}
                                    onChange={(e) => handleInputChange('cookTime', e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Ingredients</h2>
                        <div className="space-y-2 sm:space-y-3">
                            {formData.ingredients.map((ingredient, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={ingredient}
                                    onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    placeholder={`Ingredient ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="mt-3 sm:mt-4 px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold active:scale-95 transform"
                        >
                            + Add Ingredient
                        </button>
                    </div>

                    {/* Steps */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Cooking Steps</h2>
                        <div className="space-y-2 sm:space-y-3">
                            {formData.steps.map((step, index) => (
                                <textarea
                                    key={index}
                                    value={step}
                                    onChange={(e) => handleArrayChange('steps', index, e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    placeholder={`Step ${index + 1}`}
                                    rows={3}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addStep}
                            className="mt-3 sm:mt-4 px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold active:scale-95 transform"
                        >
                            + Add Step
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base active:scale-95 transform"
                    >
                        Save Recipe
                    </button>
                </form>
            </div>
        </main>
    );
}
