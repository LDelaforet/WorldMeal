# WorldMeal

WorldMeal is a Next.js frontend with a built-in backend layer (`pages/api`) that proxies recipe and ingredient requests to an upstream API.

## Environment

Copy `.env.example` values into `.env.local` if needed.

```env
NEXT_PUBLIC_API_BASE_URL=/api
BACKEND_API_URL=http://worldmeal.leovelazquez.fr
```

- `NEXT_PUBLIC_API_BASE_URL`: base URL used by the browser client (`data/api.ts`).
- `BACKEND_API_URL`: upstream API URL used by Next.js backend handlers (`pages/api/*`).

## Backend Endpoints (Next.js API)

- `GET /api/health`
- `GET /api/ingredients`
- `GET /api/ingredients/{ingredient_id}`
- `GET /api/recipes`
- `GET /api/recipes/{recipe_id}`

`/api/recipes` supports query params:

- `countries` (repeatable)
- `categories` (repeatable)
- `difficulties` (repeatable)
- `max_time`
- `max_results`

## Run Project

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Check

```bash
npm run build
```
