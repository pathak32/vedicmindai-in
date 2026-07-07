# Battle Mode — Long-Term Vision & Roadmap
*Discussion draft based on Hitesh's vision, July 2026*

## The core idea (and why it's strong)

Turning Vedic Maths practice into a healthy 1v1 competition is genuinely one of the best
ways to reach students who've mentally "given up" on maths. Competition — especially
against a peer, not a machine — creates exactly the kind of low-stakes social pressure
that motivates practice without feeling like homework. This is worth investing in.

Below is a point-by-point response to each idea, followed by a phased plan.

---

## Point 1 — Challenging by code, link, or username

**What's strong:** Code-based challenge (already built) + sharing via WhatsApp/email is
simple, safe, and needs no new infrastructure. Keep this as the primary path.

**What needs real care — please read this one carefully:**
Direct username-based challenges, where any user can look up and challenge *any other
user on the platform*, is risky specifically **because your core users are children
(Class 3–10)**. An open system where one student can search for and message/challenge
an unknown student globally creates a stranger-contact surface — exactly the kind of
thing platforms serving minors have to design around carefully, regardless of good
intentions.

**Recommended approach instead:**
- Keep challenges **code/link-based only** — a student can only battle someone they
  already know and explicitly shared a code with (via WhatsApp, a school group, etc.).
- Don't build a public "search any username and challenge them" feature.
- If you eventually want open matchmaking (see Point 2's "open challenge" idea), pair
  it with a **school/class-scoped** system — e.g., a teacher's class code — rather than
  a fully public global matchmaking pool of children. This keeps the "meet strangers"
  risk out of the product entirely while still allowing broad competition within a
  known, supervised group (a class, a school, your Founding Circle testers, etc.).

This isn't a "someday" concern — it's the one piece of this whole roadmap I'd treat as
a hard requirement before opening up anything beyond code-based challenges.

---

## Point 2 — Scoped by completed chapters + direct vs. open challenges

**Direct challenge (pick a topic, invite a known person):** Good, buildable, natural
extension of what exists today.

**Open challenge (post "I'm open for a battle on Ekadhikena", anyone can accept):**
Genuinely fun idea — like an open lobby. Feasible, but should be scoped to a known
group (see Point 1's safety note) rather than a global public pool, at least initially.
A good middle ground: open challenges visible only within a tester group / class /
school, not the entire public user base.

**Scoping to completed chapters:** Great idea and straightforward to build — you
already track lesson completion, so a battle setup screen can simply show "you've
unlocked: Nikhilam, Ekadhikena, Time & Distance" and let the challenger pick from
what *they've* completed. The opponent doesn't need to have completed the same
chapters to accept — that's actually part of the fun (a Level 2 student bravely
accepting a Level 4 challenge).

---

## Point 3 — Question bank, timing, and variable-length battles

This is very buildable and a natural next step:

- **Question bank scaling:** Yes — at least 10 questions per sutra/topic is a
  reasonable minimum so repeated battles on the same topic don't feel identical.
  This is content work (writing more questions), not a technical blocker.
- **Configurable battle length:** Letting the challenger pick topic(s) + number of
  questions, with time = questions × 10 seconds, is clean and easy to implement.
- **Countdown before start ("battle begins in 15s"):** Good UX touch, straightforward
  to add once both players have joined the room.
- **Real-time simultaneous question display:** Already working in the current build.

---

## Point 4 — Post-battle summary screen + admin visibility

**Shared result screen (question-by-question breakdown, both answers, correct/wrong):**
Excellent idea for learning value — this turns competition into a teaching moment,
which fits your "make maths less scary" mission perfectly. Very buildable.

**Weekly battle limit (to manage database load):** Reasonable, though worth noting:
your actual database cost driver will be storage of battle history + realtime
connections during active battles, not battle *frequency* alone. A "1 battle initiated
per week, unlimited accepted" model (which you proposed in Point 6) is a good compromise
— it limits how many battles *you* have to store long-term while not limiting how much
a popular/competitive kid can play.

**Admin panel visibility (all battles, results, participants):** Straightforward to
add — this is just a read-only dashboard view querying the `battle_rooms` table,
no new architecture needed.

---

## Point 5 — Public "battles are happening" display / activity feed

Fun, adds social proof and excitement ("3 battles happening right now!"). Buildable
as a simple live counter or ticker. Worth keeping this **aggregate/anonymized**
initially (e.g., "Rahul vs Priya — Rahul won" is fine to show *within* a known group,
but avoid broadcasting individual kids' win/loss records to the full public internet
without a privacy/consent thought-through first).

---

## Point 6 — Certificates, badges, win/loss percentage

Great retention mechanic — this is standard, well-proven gamification (similar to
chess.com's rating badges, Duolingo's leagues). Fully buildable later as a stats
layer on top of battle history once you have enough battle data to make it meaningful.

---

## The "make this feel educational, not just gamey" requirement

You mentioned this yourself, and it's the right instinct: **every battle screen should
carry a visible reminder that this is a learning tool** — e.g., a small persistent
line like *"Battles help you master Vedic Maths tricks faster — not just for winning."*
This matters both pedagogically (keeps the framing healthy for competitive-anxious
kids) and practically (keeps the product positioned as EdTech, not a gaming app, which
matters for how it's perceived by parents, schools, and app store review).

---

## Recommended Phased Roadmap

**Phase A — Done (today):** Code-based 1v1 challenge, fixed 5-question battle,
real-time scoring. *(Live now, pending your testing confirmation.)*

**Phase B — Near-term, buildable soon:**
- Topic/chapter selection scoped to what the challenger has completed
- Configurable question count (5/10/etc.) with derived time budget
- Pre-battle countdown ("starting in 15s...")
- Shared post-battle summary screen (question-by-question breakdown)
- Expand question bank to 10+ per topic
- Admin panel: view all battles, results, participants

**Phase C — Medium-term:**
- "Open challenge" lobby, scoped to a known group (class/school/tester circle) —
  not a global public pool
- Weekly challenge limit (1 initiated/week, unlimited accepted)
- Live "battles happening now" activity ticker (aggregated, group-scoped)

**Phase D — Long-term:**
- Win/loss stats, badges, certificates
- Broader matchmaking (only after a class/school-based safety model is in place)
- Scheduled battles with a confirmed time window + no-show disqualification

---

## Refined safety model (agreed direction, July 7 2026)

Following further discussion, the open-challenge model has been refined into
something that resolves the earlier safety concern well:

- Open challenges show **only a username/animated display name + completion
  level** — never a full profile, real name, or personal details.
- Challenges are grouped by **age group / level** (e.g., beginners only see
  beginner challenges) — this is both pedagogically sound (fair matches) and
  a meaningful safety measure, since it naturally prevents, say, a Class 3
  student from being matched against a Class 10 stranger.
- Unaccepted open challenges **auto-expire after 24 hours**.
- A **pre-battle consent/disclaimer screen** is shown to both players before
  the room opens — framing the battle as fun/learning, not something to take
  personally, with a short waiting window (room opens 3-4 minutes before
  start) after both confirm.
- **Hard permanent rule: no free-text chat between opponents, ever.** The
  entire flow (challenge → accept → battle → result) has zero open
  communication surface between two people who don't already know each
  other. If any future version considers adding messaging between users,
  that decision should be revisited carefully and separately — it changes
  the safety model fundamentally.

This design keeps the competitive/social fun intact while avoiding the
stranger-contact risk of a profile-based or chat-based system.

---

## New idea — "Quiz Squad" (small-group Daily Quiz)

Separate from Battle Mode, but reusing the same real-time engine: let 2-3
known friends (added by email, not public discovery) opt into taking the
*same* Daily Quiz together in real time, instead of solving it solo and
never knowing how a friend did.

- Scoped to people who already know each other (added by email) — same
  safety model as code-based Battle challenges, not public matchmaking.
- A join window (e.g., a fixed daily time slot) — the quiz only starts once
  everyone in the group has joined; if someone doesn't show up, it simply
  doesn't start for the group (no one's individual streak is penalized).
- Distinct identity from Battle Mode — suggested name: **"Quiz Squad"** or
  **"Study Circle"** — same underlying tech, different tone (collaborative
  peer group vs. anonymous ladder-style battle).
- Strong potential to make daily quiz habit-forming — turns a solo
  5-10 question routine into something social and anticipated.

This slots naturally after Phase B/C of Battle Mode, since it reuses the
same real-time room infrastructure already being built.

---

## New idea — Institution-scoped chat (schools/coaching centers only)

A further refinement worth capturing: **chat between students should only
ever exist inside a school/coaching-institution-verified closed group** —
never in the public open-challenge pool. A school or coaching center that
officially onboards its own class (e.g., 50 students under one institution
account) creates a fundamentally different trust context than public
matchmaking, since an adult has already vetted who's in that group.

Guardrails to build in alongside this, when the time comes:
- Chat exists **only** within institution-verified groups — this boundary
  should be enforced technically, not just as a policy choice.
- The institution must **explicitly opt in** — not a default-on feature.
- A **teacher/admin account can view chat logs** for their own group, for
  oversight (not surveillance) purposes.
- **Basic profanity/safety filtering** on all messages, even within a
  trusted group.
- The public/open Battle Mode and Quiz Squad flows remain permanently
  chat-free, as established above.

This is a distinct, longer-term feature (essentially a "schools" product
tier) rather than part of core Battle Mode — worth scoping separately once
institution accounts/verification exist as a concept in the platform.

