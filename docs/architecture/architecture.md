# Initial session persistence

The implemented schema covers the current-session screen only. The broader
model in ADR-1_db_structure.md remains future direction; this document supersedes
its session ownership and reward storage choices for the initial implementation.

## Tables

- `parents`: standalone application profile with a generated UUID. Authentication
  is deferred; the seed and server query share one temporary parent ID.
- `unlock_sessions`: parent-owned mission with title, encrypted passcode,
  creation/completion timestamps, and `active`, `completed`, or `cancelled` status.
  A partial unique index permits at most one active session per parent.
- `session_challenges`: ordered titles and optional start and completion
  timestamps. Positions are unique per session and constrained to 1–4. A
  completed challenge must also have a start timestamp.

A completed session must have a completion timestamp; other statuses must not.
Foreign keys cascade deletes from parent to sessions and challenges.

## Application rules still to implement

Create a session and exactly four challenges in one transaction. Challenges may
be completed in any order. Update session status/timestamp in the transaction
that completes the fourth challenge. Lock the session row when changing progress
or replacing an active session. The schema bounds positions but does not enforce
exactly four child rows.

Derive progress, challenge labels, and earned digit positions from each
challenge's completion timestamp. A completed challenge reveals the digit at its
own position, regardless of the order in which challenges are completed. Do not
persist duplicate counters or digit reveals.

Derive challenge status from its timestamps: no start timestamp is `Not
started`, a start without completion is `In progress`, and a completion timestamp
is `Completed`. Set the start timestamp server-side when a child begins a
challenge.

Encrypt the four-character passcode on the server with a key held outside the
database. The ciphertext field does not itself implement encryption. Never send
ciphertext or unearned digits to the child client. Responses must explicitly
select safe fields and only return earned digits.

All three tables enable RLS with no client policies. The trusted server database
connection reads the temporary parent's active session. Everyone currently shares
this parent; this is not user authorization. See [seeding](../seeding.md).

The seed provisions the temporary parent and encrypts its sample passcode. The
server-only current-session query decrypts it and returns only earned digits.
Authentication, child access control, and production session commands are pending.

## Migrations

`npm run db:migrate` loads `.env.local` using Next.js environment loading and uses
`DATABASE_URL`. Run against a Supabase database where `auth.users` already exists.
The initial migration creates only the three application tables and the status
enum; it does not create or manage Supabase Auth.

The unused starter `profiles` and `screen_time_entries` definitions were replaced.
No previous migrations existed in this repository. If those starter tables were
created manually in an existing database, this migration leaves them and their
data untouched; it does not convert existing profiles into authenticated parents.

Migration 0001 removes the Auth foreign key from parents and adds a UUID default.
A future Auth association should be explicit rather than assuming parent IDs are
Auth user IDs. The original migration still references Auth before 0001 removes it.
