import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthContext';
import { useFavorites } from '@/components/FavoritesContext';
import { listRecipes, RecipeDifficulty, RecipeSmall } from '../data/api';

export default function RecipesPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [allRecipes, setAllRecipes] = useState<RecipeSmall[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<RecipeSmall[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const normalized = (s?: string) => (s || '').toLowerCase();
    const formatDifficulty = (difficulty: RecipeDifficulty) => `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)}`;
    const getQueryValues = (key: string): string[] => {
        const value = router.query[key];
        if (!value) return [];
        return Array.isArray(value) ? value : [value];
    };

    // Build filter option lists
    const categoryOptions = useMemo(
        () => Array.from(new Set(allRecipes.map((recipe) => recipe.category))),
        [allRecipes]
    );
    const countryOptions = useMemo(
        () => Array.from(new Set(allRecipes.map((recipe) => recipe.country))),
        [allRecipes]
    );
    const tagOptions = useMemo(() => {
        const set = new Set<string>();
        allRecipes.forEach((recipe) => recipe.tags.forEach((tag) => set.add(tag)));
        return Array.from(set);
    }, [allRecipes]);
    const difficultyOptions: RecipeDifficulty[] = ['easy', 'medium', 'hard'];

    // Selected filters (multi-select per category)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState<RecipeDifficulty[]>([]);
    const [maxTime, setMaxTime] = useState<string>('');
    const [maxResults, setMaxResults] = useState<string>('');

    // Initialize from query params if present
    useEffect(() => {
        if (!router.isReady) return;

        const countriesQuery = [...getQueryValues('countries'), ...getQueryValues('country')];
        const categoriesQuery = [...getQueryValues('categories'), ...getQueryValues('category')];
        const difficultiesQuery = getQueryValues('difficulties') as RecipeDifficulty[];
        const maxTimeQuery = getQueryValues('max_time')[0];
        const maxResultsQuery = getQueryValues('max_results')[0];

        if (countriesQuery.length > 0) setSelectedCountries(countriesQuery);
        if (categoriesQuery.length > 0) setSelectedCategories(categoriesQuery);
        if (difficultiesQuery.length > 0) setSelectedDifficulty(difficultiesQuery);
        if (maxTimeQuery) setMaxTime(maxTimeQuery);
        if (maxResultsQuery) setMaxResults(maxResultsQuery);
    }, [router.isReady, router.query]);

    useEffect(() => {
        const loadAllRecipes = async () => {
            try {
                const recipes = await listRecipes();
                setAllRecipes(recipes);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to load recipes';
                setErrorMessage(message);
            }
        };

        void loadAllRecipes();
    }, []);

    useEffect(() => {
        const loadFilteredRecipes = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const recipes = await listRecipes({
                    countries: selectedCountries,
                    categories: selectedCategories,
                    difficulties: selectedDifficulty,
                    max_time: maxTime ? Number(maxTime) : undefined,
                    max_results: maxResults ? Number(maxResults) : undefined,
                });
                setFilteredRecipes(recipes);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unable to load recipes';
                setErrorMessage(message);
                setFilteredRecipes([]);
            } finally {
                setIsLoading(false);
            }
        };

        void loadFilteredRecipes();
    }, [selectedCountries, selectedCategories, selectedDifficulty, maxTime, maxResults]);

    // Toggle helpers
    const toggleItem = (list: string[], value: string, setter: (v: string[]) => void) => {
        const v = value;
        setter(list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
    };
    const toggleDiff = (list: RecipeDifficulty[], value: RecipeDifficulty) => {
        setSelectedDifficulty(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);
    };

    // Tags are filtered client-side since the API contract has no tags query parameter.
    const filtered = useMemo(() => {
        if (selectedTags.length === 0) return filteredRecipes;
        return filteredRecipes.filter((recipe) =>
            recipe.tags.some((tag) => selectedTags.map(normalized).includes(normalized(tag)))
        );
    }, [filteredRecipes, selectedTags]);

    const clearAll = () => {
        setSelectedCountries([]);
        setSelectedCategories([]);
        setSelectedTags([]);
        setSelectedDifficulty([]);
        setMaxTime('');
        setMaxResults('');
    };

    const btnClass = (active: boolean) =>
        [
            'px-3',
            'py-2',
            'rounded-lg',
            'text-xs',
            'sm:text-sm',
            'border',
            'transition-colors',
            active
                ? 'bg-amber-50 text-primary border-primary ring-2 ring-primary/30 hover:bg-amber-100'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400',
        ].join(' ');

    return (
        <main className="min-h-screen bg-white">
            <Header currentPage="recipes" />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Recipes</h1>

                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 md:shrink-0 border border-gray-200 rounded-lg p-4 bg-white
                                        md:sticky md:top-20 md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
                            <button onClick={clearAll} className="text-xs text-primary hover:text-secondary font-semibold">Clear</button>
                        </div>

                        {/* Country */}
                        <div className="mb-5">
                            <h3 className="text-xs font-semibold text-gray-700 mb-2">Country</h3>
                            <div className="flex flex-wrap gap-2">
                                {countryOptions.map(name => (
                                    <button
                                        key={name}
                                        className={btnClass(selectedCountries.map(normalized).includes(normalized(name)))}
                                        onClick={() => toggleItem(selectedCountries, name, setSelectedCountries)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-5">
                            <h3 className="text-xs font-semibold text-gray-700 mb-2">Category</h3>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map(name => (
                                    <button
                                        key={name}
                                        className={btnClass(selectedCategories.map(normalized).includes(normalized(name)))}
                                        onClick={() => toggleItem(selectedCategories, name, setSelectedCategories)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-5">
                            <h3 className="text-xs font-semibold text-gray-700 mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {tagOptions.map(name => (
                                    <button
                                        key={name}
                                        className={btnClass(selectedTags.map(normalized).includes(normalized(name)))}
                                        onClick={() => toggleItem(selectedTags, name, setSelectedTags)}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-700 mb-2">Difficulty</h3>
                            <div className="flex flex-wrap gap-2">
                                {difficultyOptions.map(level => (
                                    <button
                                        key={level}
                                        className={btnClass(selectedDifficulty.includes(level))}
                                        onClick={() => toggleDiff(selectedDifficulty, level)}
                                    >
                                        {formatDifficulty(level)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced */}
                        <div className="mt-5">
                            <h3 className="text-xs font-semibold text-gray-700 mb-2">Advanced</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1" htmlFor="max-time">Max prep time (min)</label>
                                    <input
                                        id="max-time"
                                        type="number"
                                        min={1}
                                        value={maxTime}
                                        onChange={(event) => setMaxTime(event.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                                        placeholder="e.g. 30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1" htmlFor="max-results">Max results</label>
                                    <input
                                        id="max-results"
                                        type="number"
                                        min={1}
                                        value={maxResults}
                                        onChange={(event) => setMaxResults(event.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                                        placeholder="e.g. 10"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results */}
                    <div className="flex-1">
                        {errorMessage && <p className="text-red-600 mb-3 text-sm">{errorMessage}</p>}
                        {isLoading ? (
                            <p className="text-gray-600">Loading recipes...</p>
                        ) : filtered.length === 0 ? (
                            <p className="text-gray-600">No recipes found. Try adjusting filters.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.map(r => (
                                    <div key={r.id} className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="h-36 bg-gray-100 overflow-hidden">
                                            <img src={r.image_url} alt={r.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">{r.name}</h3>
                                            <div className="text-xs text-gray-500 mb-3">{r.category} • {r.country} • {formatDifficulty(r.difficulty)}</div>
                                            <Link href={`/recipe-detail?id=${r.id}`} className="text-primary font-semibold text-sm">
                                                View Details →
                                            </Link>
                                        </div>
                                        {/* Favorite Heart */}
                                        <button
                                            aria-label={isFavorite(r.id) ? 'Remove favorite' : 'Add favorite'}
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    router.push(`/login?redirect=/recipes`);
                                                    return;
                                                }
                                                toggleFavorite(r.id);
                                            }}
                                            className={`absolute bottom-3 right-3 p-2 rounded-full border transition-colors ${isFavorite(r.id)
                                                ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                                                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFavorite(r.id) ? 'currentColor' : 'none'} stroke="currentColor">
                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
