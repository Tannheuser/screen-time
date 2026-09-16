1. Parents and children
parent_profiles
Application-specific information about an authenticated parent.
Column	Purpose
id	Primary key matching the Supabase Auth user ID
display_name	Optional name
created_at	Creation timestamp


Keep credentials and email identity in Supabase Auth. A separate application email column would introduce synchronization work without a current need.
children
Column	Purpose
id	Child ID
parent_id	Owning parent
display_name	Child-facing name
school_system	Initially nl_basisschool
school_level	Initially groep_6, groep_7, or groep_8
created_at, updated_at	Lifecycle timestamps
archived_at	Hide an unused profile while retaining history


Use stable school-level codes validated by the application. Separate school-system and school-level tables can wait until there is richer curriculum metadata.
Why separate children from users? A child profile is a learner, not necessarily an authenticated account. This keeps the initial family experience simple.
2. Subjects and skills
subjects
id, code, name, is_active
Examples: rekenen, spelling, topografie.
skills
id, subject_id, code, name, is_active
Examples: multiplication, fractions, dutch_provinces.
Use unique subject codes and unique skill codes within each subject. Deactivate catalog entries rather than removing entries referenced by historical challenges.
Why tables? Subjects and skills are evolving content. Adding one should not require changing a PostgreSQL enum or adding a column.
I would initially keep difficulty and school-level suitability in challenge configuration. A detailed curriculum mapping can come later.
3. Unlock sessions and passcodes
unlock_sessions
One attempt to earn all four digits.
Column	Purpose
id	Session ID
child_id	Learner
status	active, completed, cancelled, expired
configuration	Snapshot of selected skills, difficulty, school level, and generation settings
created_at	Start time
expires_at	Optional expiry
completed_at	Completion time
access_token_hash	Optional credential for a child session link


A partial unique index can enforce one active session per child.
The configuration snapshot preserves what the child was assigned even if the parent later changes preferences.
session_secrets
Column	Purpose
session_id	Primary key and reference to the session
passcode_ciphertext	Encrypted four-digit passcode
key_version	Identifies the encryption key used


Store the code as a four-character value, preserving leading zeros such as 0042.
It must be recoverable for progressive reveal, so hashing alone cannot serve this purpose. Encrypt it using a key held outside the database.
Keep this table accessible only through the authorized server path. Separation helps avoid accidentally including the code in session responses, but separation alone does not enforce security.
I recommend fixing the passcode for the lifetime of a session. If a parent changes it, cancel the session and create another. Updating a partially revealed code would make progress ambiguous.
Also, the app cannot invalidate a code already learned by a child. Reusing that code across sessions is a product limitation; the parent must change the device’s code when needed.
4. Challenges
challenges
A concrete assignment within a session, rather than a reusable template.
Column	Purpose
id	Challenge ID
session_id	Owning session
position	Order, initially 1–4
skill_id	Skill being practiced
status	pending, active, completed
success_criteria	Versioned rules for completion
started_at, completed_at	Progress timestamps


Enforce uniqueness of (session_id, position).
A success rule might mean:
Five questions; at least four answered correctly on their first attempt.

That wording matters. “Four correct answers” alone leaves retries and repeated submissions undefined. Store explicit criteria, and evaluate them in domain code.
For the simplest MVP, an alternative is:
Complete every question correctly; retries are allowed.

There is no need for a generic rules engine. A small set of typed, versioned rule shapes is sufficient.
5. Questions and attempts
questions
The actual question presented, including any randomized values.
Column	Purpose
id	Question ID
challenge_id	Owning challenge
position	Order within the challenge
kind	Numeric input, multiple choice, text, etc.
prompt_payload	Wording, options, and display data
validation_payload	Server-only expected answer and validation parameters
validator_key, validator_version	How answers are checked
source_kind	Generator, template, curated bank, or AI
source_reference, source_version	Optional provenance
generation_metadata	Optional seed and generation parameters


Enforce uniqueness of (challenge_id, position).
Persist generated questions before showing them. A refresh must not produce different operands or answer choices. Saving the actual content also preserves history when a generator changes.
Generation and validation remain separate: an AI-generated question could still have a deterministic validator.
attempts
One submitted answer to one question.
Column	Purpose
id	Attempt ID
question_id	Answered question
submission_key	Deduplicates retries of the same network request
answer_payload	Submitted answer
is_correct	Server-calculated result
feedback_payload	Feedback shown to the child
created_at	Submission time


Attempts should be append-only. A deliberate second answer creates another attempt; a repeated HTTP request with the same submission key does not.
Store the evaluation result so history does not silently change when validation logic evolves.
6. Digit reveals
digit_reveals
The durable record that a challenge earned a reward.
Column	Purpose
id	Reveal ID
session_id	Owning session
challenge_id	Challenge that earned it
digit_position	Earned position, 1–4
revealed_at	Award timestamp


Constraints:
- Unique challenge_id: one reward per challenge.
- Unique (session_id, digit_position): each digit earned once.
- Check digit position is 1–4.
- Ensure the challenge belongs to the referenced session, using a composite foreign key.
Do not store the digit itself here. This row establishes entitlement; the server retrieves the corresponding character from the protected session secret.
Although a reveal could be inferred from completed challenges, an explicit record gives the reward a timestamp and a clear guarantee against duplicate awards.
Important transactional and security rules
A successful answer submission should atomically:
1. Record the attempt.
2. Evaluate challenge completion.
3. Complete the challenge if its criteria are met.
4. Insert any newly earned reveal.
5. Complete the session if all four digits are earned.
Serialize progress updates for the session so concurrent requests cannot bypass ordering or award inconsistent progress.
For child-facing responses:
- Return question display data, never validation payloads.
- Return earned digits only.
- Derive progress from authoritative records, never from client-supplied counts.
- Authorize access to the specific session; knowing its ID is insufficient.