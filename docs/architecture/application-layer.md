# Application Architecture: Use Cases and Queries

## Overview

The application uses a pragmatic architecture that separates **commands** from **queries**.

The goal is to keep business workflows explicit and testable without forcing every database operation through unnecessary service and repository abstractions.

The architecture follows Clean Architecture principles where they provide value, but does not attempt to implement textbook Clean Architecture for every operation.

At a high level:

```text
                     Next.js
                        │
             ┌──────────┴──────────┐
             │                     │
          Commands               Queries
             │                     │
             ▼                     ▼
      Application Use Case     Query Function
             │                     │
             ▼                     │
           Domain                  │
             │                     │
        Repository                 │
             │                     │
             └──────────┬──────────┘
                        ▼
                     Drizzle
                        │
                    PostgreSQL
```

---

## Commands

Operations that change application state or represent meaningful business workflows are implemented as **application use cases**.

Examples:

- `StartUnlockSession`
- `SubmitAnswer`
- `CompleteChallenge`

A use case coordinates domain objects and infrastructure required to perform an application-level operation.

For example, completing a challenge may involve:

1. Loading the challenge.
2. Validating its current state.
3. Evaluating completion rules.
4. Updating the challenge.
5. Updating the unlock session.
6. Revealing the next passcode digit.

This operation crosses multiple domain concepts and therefore should not necessarily belong to an entity-oriented `ChallengeService`.

Instead, the application layer explicitly represents the user/system action:

```ts
type Dependencies = {
  challenges: ChallengeRepository
  sessions: UnlockSessionRepository
}

export function createCompleteChallenge(deps: Dependencies) {
  return async function completeChallenge(command: Command) {
    const challenge =
      await deps.challenges.getById(command.challengeId)

    // Domain/application logic...

    await deps.sessions.save(...)
  }
}
```

Dependencies are injected explicitly through factory functions rather than through a DI container.

Production dependencies are wired in a server-side **composition root**:

```ts
const challenges = new DrizzleChallengeRepository(db)
const sessions = new DrizzleUnlockSessionRepository(db)

export const completeChallenge = createCompleteChallenge({
  challenges,
  sessions,
})
```

Tests can provide fake implementations instead:

```ts
const completeChallenge = createCompleteChallenge({
  challenges: fakeChallenges,
  sessions: fakeSessions,
})
```

This keeps application workflows testable without Next.js, Drizzle, Supabase, or PostgreSQL.

---

## Queries

Read operations have different requirements from commands.

Simple reads and presentation-specific data do **not** need to go through an application use case or domain repository.

For example:

```ts
getSubjects()
getAvailableChallenges()
getChildProgress()
getChildDashboard()
```

These are implemented as dedicated query functions.

```ts
export async function getSubjects(): Promise<SubjectDto[]> {
  return db
    .select({
      id: subjects.id,
      name: subjects.name,
      slug: subjects.slug,
    })
    .from(subjects)
}
```

The Next.js presentation layer calls the query:

```ts
const subjects = await getSubjects()
```

Pages and components should not contain Drizzle queries directly. Database access remains encapsulated inside the query layer.

---

## Why Queries Bypass Repositories

Repositories exist primarily to provide persistence abstractions required by the **domain and application layers**.

They answer questions such as:

> Give me the domain state required to perform this behavior.

Queries have a different purpose:

> Give me the data required to render this view.

A UI read model may combine data from many database tables.

For example, a child dashboard might require:

```text
children
unlock_sessions
challenges
questions
attempts
subjects
```

Forcing this through individual repositories could require loading multiple domain models and combining or aggregating them in application memory.

That provides little architectural value and may be significantly less efficient than allowing PostgreSQL to perform the relational operations directly.

A query function may therefore freely use:

- JOIN
- GROUP BY
- COUNT
- SUM
- AVG
- FILTER
- CTEs
- database-specific optimizations

and return a purpose-specific DTO:

```ts
type ChildDashboard = {
  child: {
    id: string
    name: string
  }

  completedChallenges: number
  unlockedDigits: number

  subjects: Array<{
    subject: string
    correct: number
    total: number
  }>
}
```

The read model does not need to correspond to a domain entity or aggregate.

---

## Repository Responsibilities

Repositories should not automatically be created for every database table.

A repository represents persistence needed by domain/application behavior, not a generic DAO.

For example:

```text
ChallengeRepository
UnlockSessionRepository
```

may be useful because application use cases operate on those domain concepts.

This does not imply that the application needs:

```text
SubjectRepository
QuestionRepository
AttemptRepository
```

simply because corresponding tables exist.

Repositories may also use JOINs internally when loading an aggregate. Using a repository does not imply one SQL query per table.

The distinction is conceptual:

```text
Repository
    ↓
Load/save domain state required for behavior

Query
    ↓
Return data shaped for a particular read use case
```

---

## Simple CRUD

Not every operation deserves an application use case.

Creating abstractions such as:

```text
GetSubjectsUseCase
SubjectRepository
DrizzleSubjectRepository
```

for a simple read operation adds ceremony without necessarily improving testability, domain clarity, or maintainability.

Use cases should be introduced when an operation contains meaningful application or domain behavior.

Simple read-only operations should normally remain query functions.

---

## Dependency Rules

Domain code must not depend on:

- Next.js
- React
- Drizzle
- PostgreSQL
- Supabase
- HTTP-specific concepts

Application use cases should depend on domain concepts and explicit interfaces rather than concrete infrastructure implementations.

Query functions are intentionally infrastructure-aware and may depend directly on Drizzle.

Next.js acts as the outer presentation/transport layer.

Conceptually:

```text
app ───────────────→ queries ───────→ Drizzle
 │
 └──→ application ─→ domain
           ↑
           │
     repository interfaces
           ↑
           │
     Drizzle implementations
```

---

## Transactions

A command may require several database operations.

This is not inherently a problem.

For command-side workflows, correctness and consistency are more important than minimizing the number of SQL statements.

Operations that must succeed or fail together should execute within a database transaction.

For example:

```text
CompleteChallenge
        │
        ├── update challenge
        ├── update unlock session
        └── reveal digit
                 │
                 ▼
          single transaction
```

Read-side queries should instead be optimized for efficient data retrieval and may combine multiple tables into a single SQL query when appropriate.

---

## Decision Summary

The project follows these rules:

1. **Commands with meaningful business behavior are application use cases.**
2. **Use cases coordinate domain concepts and repositories.**
3. **Dependencies are injected explicitly without a DI container.**
4. **Production dependencies are assembled in a server-side composition root.**
5. **Read-only presentation operations are dedicated query functions.**
6. **Query functions may use Drizzle directly and return purpose-specific DTOs.**
7. **React components and Next.js pages should not contain database queries directly.**
8. **Repositories exist for domain/application persistence needs, not automatically for every table.**
9. **Repository implementations may use JOINs when loading domain aggregates.**
10. **Do not introduce use cases or repositories when they provide no concrete value.**
11. **Use PostgreSQL for relational operations instead of unnecessarily joining and aggregating data in application memory.**
12. **Keep domain and application business logic independent of Next.js and database implementation details.**

The overall approach can be described as **pragmatic Clean Architecture with a CQRS-style separation between command and read paths**, without introducing the complexity of a full CQRS architecture.