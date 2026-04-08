import type { NextApiRequest, NextApiResponse } from 'next';
import { proxyJson } from '../../../lib/upstreamProxy';

type RecipeSmall = {
    id: number;
    name: string;
    image_url: string;
    country: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    tags: string[];
    ingredients: number[];
};

function appendMulti(searchParams: URLSearchParams, key: string, value: string | string[] | undefined) {
    if (!value) return;
    if (Array.isArray(value)) {
        value.forEach((entry) => searchParams.append(key, entry));
        return;
    }
    searchParams.append(key, value);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<RecipeSmall[] | { error: string }>) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const searchParams = new URLSearchParams();

    appendMulti(searchParams, 'countries', req.query.countries as string | string[] | undefined);
    appendMulti(searchParams, 'categories', req.query.categories as string | string[] | undefined);
    appendMulti(searchParams, 'difficulties', req.query.difficulties as string | string[] | undefined);

    const maxTime = req.query.max_time;
    if (typeof maxTime === 'string') {
        searchParams.set('max_time', maxTime);
    }

    const maxResults = req.query.max_results;
    if (typeof maxResults === 'string') {
        searchParams.set('max_results', maxResults);
    }

    const queryString = searchParams.toString();
    const path = queryString ? `/recipes?${queryString}` : '/recipes';

    await proxyJson<RecipeSmall[]>(path, res);
}
