export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
    id: number;
    name: string;
    unit: string;
}

export interface RecipeSmall {
    id: number;
    name: string;
    image_url: string;
    country: string;
    difficulty: RecipeDifficulty;
    category: string;
    tags: string[];
    ingredients: number[];
}

export interface RecipeFullIngredient {
    id: number;
    qty: number;
}

export interface RecipeFull {
    id: number;
    image_url: string;
    name: string;
    description: string;
    prep_time: number;
    country: string;
    difficulty: RecipeDifficulty;
    category: string;
    ingredients: RecipeFullIngredient[];
    steps: string[];
    tags: string[];
}

export interface RecipesQuery {
    countries?: string[];
    categories?: string[];
    difficulties?: RecipeDifficulty[];
    max_time?: number;
    max_results?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const body = (await response.json()) as { detail?: string; message?: string };
        return body.detail || body.message || response.statusText;
    } catch {
        return response.statusText;
    }
}

async function fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message || `Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
}

function buildRecipesQuery(params?: RecipesQuery): string {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    params.countries?.forEach((country) => searchParams.append('countries', country));
    params.categories?.forEach((category) => searchParams.append('categories', category));
    params.difficulties?.forEach((difficulty) => searchParams.append('difficulties', difficulty));

    if (typeof params.max_time === 'number') {
        searchParams.set('max_time', String(params.max_time));
    }

    if (typeof params.max_results === 'number') {
        searchParams.set('max_results', String(params.max_results));
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}

export async function getHealthcheck(): Promise<{ status: string }> {
    return fetchJson<{ status: string }>('/health');
}

export async function listIngredients(): Promise<Ingredient[]> {
    return fetchJson<Ingredient[]>('/ingredients');
}

export async function getIngredientById(ingredientId: number): Promise<Ingredient | null> {
    const response = await fetch(`${API_BASE_URL}/ingredients/${ingredientId}`);
    if (response.status === 404) return null;
    if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message || `Request failed: ${response.status}`);
    }
    return (await response.json()) as Ingredient;
}

export async function listRecipes(params?: RecipesQuery): Promise<RecipeSmall[]> {
    return fetchJson<RecipeSmall[]>(`/recipes${buildRecipesQuery(params)}`);
}

export async function getRecipeById(recipeId: number): Promise<RecipeFull | null> {
    const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}`);
    if (response.status === 404) return null;
    if (!response.ok) {
        const message = await readErrorMessage(response);
        throw new Error(message || `Request failed: ${response.status}`);
    }
    return (await response.json()) as RecipeFull;
}
