<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kiez Diary — session handoff

Last updated: 2026-09-12.

## Scope and working style

This is a **hackathon MVP**, not a production-ready system. The user explicitly reinforced this during implementation. Prioritize a convincing, usable demo and small fixes. Do not expand infrastructure, add elaborate hardening, or spend time on speculative scale concerns. Give brief progress updates and make clear when work has stopped; the user asked several times whether work was still underway.

Read `PLAN.md` for the product specification and `README.md` for practical setup and demo instructions. The implementation is a first pass, not proof that every acceptance criterion in the plan is complete. Continue from the existing app; do not scaffold it again.

## Product decisions to preserve

- “Every place has a diary.” Map discovery and multilingual voice are core scope, not optional stretch goals.
- No accounts, profiles, likes, followers, or public raw contribution feed. A nickname is an unverified display name.
- Only today’s latest eligible contribution is public on a Kiez page. Publication appends; earlier contributions remain stored for the Chronicle.
- A Chronicle is one canonical English prose story, narrated as **“I,” the neighborhood**. Preserve conflicting moods, source coverage, and factual uncertainty; do not manufacture consensus.
- Preserve original contribution text/reviewed transcript and source language. Translate and speak on demand; do not persist versions in every language.
- Voice flow: record → original-language transcript → user review/edit → explicit publish. No conversational real-time agent. Text remains available.
- Reading is public. Writing requires a fresh location check. Manual Kiez selection only enables reading.
- Calendar days use Europe/Berlin midnight. An unpopulated current day says exactly **Waiting**; an empty day gets no invented Chronicle.

## Implemented state

- Next.js App Router + TypeScript, Tailwind CSS, shadcn-style UI primitives with Radix dialogs, Leaflet/React Leaflet, and lucide icons. The installed Next.js version during this session was 16.3.5; use `package-lock.json` for reproducibility.
- Responsive paper-diary design, landing map/list/search, selected-area preview, Kiez page, archive index and individual Chronicle pages.
- Four hand-drawn, approximate prototype areas: Graefekiez and Bergmannkiez (Kreuzberg), Reuterkiez and Schillerkiez (Neukölln). These are explicitly not official boundaries. Map and server location resolution share the same geometry.
- First launch seeds 160 fictional original contributions: 4 Kieze × 5 dates × 8 contributions. Four historical days have 16 **editorial fixture Chronicles**, not outputs verified against a live Google API. German, Turkish, English, Arabic and Spanish are represented, with contrasting feelings.
- Persistent embedded PostgreSQL (PGlite) for local use, plus a `pg` adapter for `DATABASE_URL`. SQL schema is applied at startup.
- Signed anonymous sessions/location results, location-gated text publication, retry idempotency, deterministic latest entry, 15-second/focus refresh, basic rate limits and reporting/removal endpoints.
- Google transcription, translation and TTS server operations; microphone composer, editable transcript, language selection, translated-text display and playback controls.
- Protected catch-up Chronicle job with claiming, source extraction, drafting and review. It processes at most one candidate day per invocation. No external scheduler is connected.

## What is not verified or finished

- **No Gemini key was configured during implementation.** Check local configuration without exposing secrets; do not assume this remains true in a later session. Live transcription, translation, TTS, five-language quality and generated Chronicle quality have NOT been validated against Google. The browser tests verify the missing-provider error, not successful speech.
- The default transcription implementation uses bounded recorded audio with Gemini audio understanding (`generateContent`), not the dedicated Live transcription API. Models are configurable in `.env.example`; verify availability in the user’s project before changing them.
- No public deployment, managed database account, or external scheduler was set up. Do not describe these as deployed or tested.
- Human/native-speaker review of the multilingual demo and generated outputs remains useful before presenting. Fixture coverage metadata is illustrative, not independent evidence of a completed human review.
- Large Chronicle inputs fail explicitly above the configured budget; balanced high-volume batching from the broader plan is not implemented. Keep this outside the MVP unless the actual demo requires it.
- Admin removal flags affected Chronicles for review; there is no admin dashboard or complete regeneration workflow.

## Start and rehearse

- `npm run dev` → http://localhost:3000. A server was left running at the end of the implementation session; check before starting another. Do not assume it survives overnight.
- Both `dev` and `build` explicitly use **Webpack**. Turbopack’s worker failed in this workspace; do not switch back casually.
- `.env.example` documents configuration. Only copy it to `.env.local` if that file does not already exist. Keep API keys server-side and out of messages, logs, source control and `NEXT_PUBLIC_` variables.
- Local DB: `.data/kiez` (ignored by Git). Run only one process against this directory; stop the app before running a seed/reset CLI. Do not erase real contributions.
- **Tomorrow’s demo may show Waiting:** the seed anchor is persisted once, not advanced at restart. To rehearse with populated current-day entries, stop the server and run `npm run seed -- YYYY-MM-DD --reset-demo` using the actual Berlin date, then restart. This resets only demo-tagged records and preserves real submissions.
- For writing while away from Berlin: Chrome DevTools → More tools → Sensors → custom location **52.4917, 13.4150** (Graefekiez). Keep the server-side presence check; do not add a public location bypass. Real phone microphone/location access needs HTTPS.
- Google setup: set `GEMINI_API_KEY` locally, restart, test a short recording, edit the transcript, publish, then Translate/Listen on a contribution and a Chronicle. Target languages are `en,de,tr,ar,es`; `ENABLED_AUDIO_LANGUAGES` controls the offered list.

## Useful file map

- `app/page.tsx`, `app/globals.css`: landing page and visual design.
- `components/explore.tsx`, `components/map.tsx`, `components/leaflet-map.tsx`: discovery and map; dynamic import avoids Leaflet SSR.
- `components/diary.tsx`, `components/composer.tsx`, `components/listen.tsx`: latest moment, contribution and voice flows.
- `app/kiez/[slug]/...`: diary and archive routes.
- `app/api/[...action]/route.ts`: server HTTP operations, including cron and internal moderation.
- `lib/neighborhoods.ts`, `lib/dates.ts`: shared areas/location resolution and Berlin date handling.
- `lib/fixtures.ts`, `lib/db.ts`, `lib/store.ts`, `migrations/001_initial.sql`, `scripts/seed.ts`: seed content, persistence and reads.
- `lib/ai.ts`, `lib/chronicle-job.ts`, `lib/security.ts`: provider operations, Chronicle workflow and basic submission protections.
- Original map reference: `~/Desktop/Clash/clash/components/map/`; reuse integration patterns only, not its meetup/account product concepts.

## Validation and repository status

During the 2026-09-12 session:

- `npm run typecheck` passed.
- `npm test`: all 5 core tests passed (Berlin/DST dates, polygon resolution, fixtures, database persistence/idempotency/claiming, WAV header).
- `npm run build` passed with Webpack.
- `npm run test:e2e`: all 3 browser tests passed (map/archive/missing-Google state, location-checked text publication/retries, mobile width/dialog keyboard access). The mobile test was rerun successfully after the last visual adjustment.
- Fixed first-run creation of the `.data` parent directory, mobile decorative overflow, and an overly broad focus-outline selector.
- Browser tests use installed Chrome on this Mac, or `PLAYWRIGHT_CHROMIUM_EXECUTABLE`/Playwright Chromium elsewhere. They intercept OSM tile requests; screenshots therefore do not demonstrate real tile delivery. Do not use automated runs to bulk-download map tiles.
- Browser publication tests write `Test visitor` contributions to the local database. Their six test entries were removed before leaving the demo running; rerunning that test creates new ones. Preserve genuine user content when cleaning up.
- Most implementation files were still **untracked/uncommitted** at handoff. No commit, push or deployment was made. Inspect `git status` before working; do not discard this implementation.

Suggested next step: ask what the user wants to focus on, or follow their new task. If continuing the demo, prioritize the date anchor and real Google integration rehearsal over additional architecture.
