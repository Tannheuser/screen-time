# Temporary single-parent seed

Authentication is not required yet. `lib/temporary-parent.mjs` defines the fixed
parent ID shared by the seed and current-session query. The seed inserts a
“Demo Parent” record without touching Supabase Auth.

Set `DATABASE_URL` and `PASSCODE_ENCRYPTION_KEY` in `.env.local`. The encryption
key must contain 64 hexadecimal characters (32 random bytes). Generate it with
`node -e 'console.log(require("node:crypto").randomBytes(32).toString("hex"))'`.
Keep it outside source control and never use a `NEXT_PUBLIC_` prefix.
`SEED_PASSCODE` optionally overrides the development-only default `7417`.

Run:

```sh
npm run db:migrate
npm run db:seed
```

The seed creates an active Blue Key session and four challenges: Math Sequence,
Pattern Lock, Logic Gate, and Final Cipher. The first two are completed. The
parent, session, and challenges are written in one transaction. A deterministic
session ID makes reruns leave existing progress unchanged. Another active session
for this parent causes a rollback rather than replacing it.

`/terminal` now reads the temporary parent's active session through a server-only
query and shows only earned digits. This is shared single-parent mode: everyone
visiting the terminal sees the same mission. Auth-based ownership and restricted
child access must replace the temporary parent before multi-user use.

The passcode uses AES-256-GCM with a random 12-byte IV and 16-byte authentication
tag. The stored format is `v1:<base64 IV>:<base64 tag>:<base64 ciphertext>`.
The server query authenticates/decrypts it and returns a safe view model, never
ciphertext or unearned digits. Only a contiguous completed challenge prefix earns
digits. The Continue Mission interaction is still pending implementation.

Migration `0001_independent_parents.sql` removes the parent's Auth foreign key
and adds a generated UUID default. Existing parent IDs and sessions are preserved.
