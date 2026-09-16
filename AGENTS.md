# Screen Time

Screen Time is an educational web app where children earn digits
of a parent-defined 4-digit Screen Time passcode by completing
educational challenges.

Target users are initially children in Dutch primary school,
particularly groep 6–8.

## Core Flow

Parent configures 4-digit code.

Child sees:

_ _ _ _

Child completes a Challenge containing several Questions.

Successful completion reveals one digit.

The complete passcode must NEVER be sent to the child client.
Only earned digits may be returned by the server.

## Stack

Follow package.json and the existing code as the source of truth.

Main stack:
- Next.js
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- PostgreSQL / Supabase
- Drizzle ORM
- Zod
- Vercel

## Architecture

Use a modular monolith.

Keep domain/application logic separate from React components
and route handlers.

Do not introduce microservices, queues or infrastructure without
a concrete requirement.

Prefer incremental changes over speculative abstractions.

## Domain

Important concepts:

- Parent/User
- Child
- UnlockSession
- Challenge
- Question
- Attempt
- DigitReveal

The domain model is evolving. Do not assume these names imply
existing implementations.

## Security

Treat the Screen Time code as sensitive.

Never expose unrevealed digits to the browser, including through:
- API responses
- React state
- HTML
- Server Component payloads

Authorization and validation belong on the server.

## Project Documentation

Before making architectural changes, read:

- `docs/product.md`
- `docs/architecture.md`
- relevant files under `docs/decisions/`

Update documentation when a change alters an established
architectural or domain decision.