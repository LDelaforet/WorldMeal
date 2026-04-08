import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyJson } from '../../../lib/upstreamProxy';

type RecipeFullIngredient = {
    id: number;
    qty: number;
};

type RecipeFull = {
    id: number;
    image_url: string;
    name: string;
    description: string;
    prep_time: number;
    country: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    ingredients: RecipeFullIngredient[];
    steps: string[];
    tags: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RecipeFull | { error: string }>) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const recipeId = req.query.recipe_id;
    if (!recipeId || Array.isArray(recipeId)) {
        res.status(400).json({ error: 'Invalid recipe_id' });
        return;
    }

    await proxyJson<RecipeFull>(`/recipes/${encodeURIComponent(recipeId)}`, res);
}
