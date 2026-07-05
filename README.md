# screen-time

A minimal Next.js 16 starter configured with:

- TypeScript + App Router
- Tailwind CSS
- shadcn/ui-style components
- Supabase Auth
- Postgres + Drizzle ORM
- Zod validation
- Vercel Analytics + Speed Insights

## Getting started

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in the Supabase and Postgres credentials.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

## Database

Generate SQL artifacts with:

```bash
npm run db:generate
```

## Authentication

The home page includes a Supabase magic-link sign-in form and `/auth/callback`
route handler for exchanging the auth code into a session.
