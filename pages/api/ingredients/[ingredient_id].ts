import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyJson } from '../../../lib/upstreamProxy';

type Ingredient = {
    id: number;
    name: string;
    unit: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Ingredient | { error: string }>) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const ingredientId = req.query.ingredient_id;
    if (!ingredientId || Array.isArray(ingredientId)) {
        res.status(400).json({ error: 'Invalid ingredient_id' });
        return;
    }

    await proxyJson<Ingredient>(`/ingredients/${encodeURIComponent(ingredientId)}`, res);
}
