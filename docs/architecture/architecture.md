# Initial session persistence

The implemented schema covers the current-session screen only. The broader
model in ADR-1_db_structure.md remains future direction; this document supersedes
its session ownership and reward storage choices for the initial implementation.

## Tables

- `parents`: application profile whose ID references `auth.users.id`. Supabase
  manages identity and email. Parent creation must explicitly insert a profile
  after authentication; there is no provisioning trigger yet.
- `unlock_sessions`: parent-owned mission with title, encrypted passcode,
  creation/completion timestamps, and `active`, `completed`, or `cancelled` status.
  A partial unique index permits at most one active session per parent.
- `session_challenges`: ordered titles and optional completion timestamps.
  Positions are unique per session and constrained to 1–4.

A completed session must have a completion timestamp; other statuses must not.
Foreign keys cascade deletes from Auth user to parent, sessions, and challenges.

## Application rules still to implement

Create a session and exactly four challenges in one transaction. Complete
challenges in order and update session status/timestamp in the transaction that
completes the fourth challenge. Lock the session row when changing progress or
replacing an active session. The schema bounds positions but does not enforce
exactly four child rows or ordered completion across rows.

Derive progress, available/locked challenge labels, and earned digit positions
from challenge completion. Do not persist duplicate counters or digit reveals.

Encrypt the four-character passcode on the server with a key held outside the
database. The ciphertext field does not itself implement encryption. Never send
ciphertext or unearned digits to the child client. Responses must explicitly
select safe fields and only return earned digits.

All three tables enable RLS with no client policies. Access is intended through
the trusted server database connection, which must check parent ownership.
Restricted child access, encryption, profile provisioning, and session UI queries
are not implemented by this schema change.

## Migrations

`npm run db:migrate` loads `.env.local` using Next.js environment loading and uses
`DATABASE_URL`. Run against a Supabase database where `auth.users` already exists.
The initial migration creates only the three application tables and the status
enum; it does not create or manage Supabase Auth.

The unused starter `profiles` and `screen_time_entries` definitions were replaced.
No previous migrations existed in this repository. If those starter tables were
created manually in an existing database, this migration leaves them and their
data untouched; it does not convert existing profiles into authenticated parents.
