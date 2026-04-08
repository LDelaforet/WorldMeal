import type { NextApiResponse } from 'next';

const UPSTREAM_BASE_URL = process.env.BACKEND_API_URL || 'http://worldmeal.leovelazquez.fr';

type ErrorPayload = {
    error: string;
};

export async function proxyJson<T>(path: string, res: NextApiResponse<T | ErrorPayload>): Promise<void> {
    try {
        const upstreamResponse = await fetch(`${UPSTREAM_BASE_URL}${path}`);
        const responseText = await upstreamResponse.text();

        if (!upstreamResponse.ok) {
            const message = responseText || upstreamResponse.statusText || 'Upstream request failed';
            res.status(upstreamResponse.status).json({ error: message });
            return;
        }

        const payload = responseText ? (JSON.parse(responseText) as T) : ({} as T);
        res.status(200).json(payload);
    } catch {
        res.status(502).json({ error: 'Backend unavailable' });
    }
}
