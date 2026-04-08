import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import { getIngredientById, Ingredient, listIngredients } from '../data/api';

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [selectedId, setSelectedId] = useState<string>('');
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const loadIngredients = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const data = await listIngredients();
                setIngredients(data);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to load ingredients.';
                setErrorMessage(message);
            } finally {
                setIsLoading(false);
            }
        };

        void loadIngredients();
    }, []);

    const selectedIdAsNumber = useMemo(() => Number(selectedId), [selectedId]);

    const loadIngredientDetails = async () => {
        if (!selectedId || Number.isNaN(selectedIdAsNumber)) {
            setErrorMessage('Please enter a valid ingredient id.');
            setSelectedIngredient(null);
            return;
        }

        setErrorMessage('');
        try {
            const ingredient = await getIngredientById(selectedIdAsNumber);
            if (!ingredient) {
                setErrorMessage('Ingredient not found.');
                setSelectedIngredient(null);
                return;
            }
            setSelectedIngredient(ingredient);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load ingredient.';
            setErrorMessage(message);
            setSelectedIngredient(null);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header currentPage="ingredients" />
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ingredients</h1>
                <p className="text-sm text-gray-600 mb-6">All available ingredients and direct lookup by id.</p>

                {errorMessage && <p className="text-sm text-red-600 mb-4">{errorMessage}</p>}

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-2">Find one ingredient</h2>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            value={selectedId}
                            onChange={(event) => setSelectedId(event.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            placeholder="Ingredient id"
                        />
                        <button
                            onClick={loadIngredientDetails}
                            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90"
                        >
                            Search
                        </button>
                    </div>

                    {selectedIngredient && (
                        <div className="mt-3 text-sm text-gray-700">
                            <p>ID: {selectedIngredient.id}</p>
                            <p>Name: {selectedIngredient.name}</p>
                            <p>Unit: {selectedIngredient.unit}</p>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <p className="text-gray-600">Loading ingredients...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {ingredients.map((ingredient) => (
                            <div key={ingredient.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                <p className="text-xs text-gray-500">#{ingredient.id}</p>
                                <p className="text-base font-semibold text-gray-900">{ingredient.name}</p>
                                <p className="text-sm text-gray-600">Unit: {ingredient.unit}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
