# Kiez Diary — prototype specification

Status: hackathon plan, ready to guide implementation.

## 1. Concept

**The neighborhood, told by its people.**

Kiez Diary is a collective diary of life in a neighborhood. Each Kiez has one shared page, like a wiki organized around a place rather than individual people. Anyone currently in that neighborhood can contribute an observation, experience, thought, or moment.

Contributions form a stack. Only today's latest contribution is visible on the Kiez page. A new contribution replaces the visible top of the stack, while every earlier contribution remains stored for the daily Chronicle. This is a visual replacement, never a destructive overwrite.

At the end of each day, the Chronicle agent turns that day's contributions into one prose diary entry. **The narrator speaks as “I”: the Kiez itself, a single common, unified, merged voice.** It does not speak as “we,” impersonate a particular contributor, or present separate contributor summaries.

Daily Chronicles form the neighborhood's browsable archive.

## 2. Product principles

- The place is the protagonist. No accounts, profiles, followers, likes, or personal feeds.
- Contributing should take only a few steps: establish location, choose a nickname, write, publish.
- Everyone's contribution receives equal consideration in the Chronicle, regardless of length, nickname, or submission time.
- The current moment and the accumulated memory coexist: today's latest contribution alongside the archive of completed days.
- A quiet, text-led, mobile-first interface using shadcn/ui components.

## 3. Scope and phases

### Phase 1 — complete text-first MVP

- Next.js with TypeScript and shadcn/ui.
- A small, curated set of supported Berlin neighborhoods with stable IDs, names, search aliases, and defined boundaries.
- Public neighborhood search and reading without location permission.
- Browser location lookup before writing, with confirmation of the resolved Kiez.
- Lightweight nickname session without registration, email, password, or public profile.
- Append-only text submissions and one visible latest contribution per Kiez per day.
- Exact empty-state line: **Waiting**.
- Daily Chronicle generation and a browsable archive.
- Persistent storage, basic submission controls, and deployed scheduling.

### Phase 2 — browsable Leaflet map

Add after the core diary loop works. Display the same neighborhood boundaries used for location resolution. Tapping a supported region shows its name and today's latest contribution, or “Waiting,” with a link to its page. On mobile, use a bottom sheet or equivalent accessible preview.

If time is short, ship Phase 1 with location-based discovery and text search. A map is not required for a complete first prototype.

### Phase 3 — Google voice integration

The user wants Google's “omni AI” for speech-to-text, text-to-speech, and other voice features as the final implementation step. This records the intended provider and capability; the exact Google product/model/API is not yet selected or verified.

- Dictate a contribution, receive a transcript, edit it, and explicitly publish it.
- Listen to a daily Chronicle through text-to-speech in a consistent narrator voice.
- Provide visible recording, stop, cancel, playback, and error states.
- Request microphone access only when recording is started.
- Keep text entry and reading fully available if voice is unavailable or permission is denied.
- Do not publish unreviewed transcripts or retain raw recordings by default.
- Keep provider credentials on the server. Verify API availability, browser support, pricing, data handling, and supported languages during this phase.
- Broader conversational or live voice experiences remain an extension to define later.

### Out of scope for the first prototype

User profiles, social graphs, comments, reactions, direct messages, meetups, photo/video uploads, public browsing of the raw contribution stack, user editing of published Chronicles, and full-city boundary coverage.

## 4. Core journeys

### Discover and read

1. Open the landing page with a short explanation and “Find my Kiez.”
2. Either grant location access or search/select a supported neighborhood.
3. Open its canonical page.
4. See today's latest contribution, its time and nickname, or “Waiting” if today has none.
5. Browse previous daily Chronicles through an archive link or date list.

Reading is public and does not require a nickname or physical presence. Search results always resolve to the same canonical Kiez page.

### Contribute

1. Tap “Add to the diary.”
2. Obtain a fresh browser location and resolve it to a supported neighborhood.
3. Show “You're writing in [Kiez]” before submission. If the reader is browsing another neighborhood, route the composer to the detected Kiez with a clear explanation.
4. Ask for a nickname if the current browser session has none. Explain that it is a display name, not an account or verified identity.
5. Write a plain-text contribution; proposed limit: 2,000 characters.
6. Publish explicitly. The server validates the submission and derives the destination from the location check.
7. Show the saved contribution as the new top of today's stack. Retain previous submissions for the Chronicle.

Preserve the draft if publication fails. Prevent duplicate submissions caused by retries or double taps. Contributors cannot edit or delete other people's entries.

### Read the archive

Open the Kiez archive, choose a date, and read that day's Chronicle. Show the date, neighborhood, contribution count, and a short label explaining that the Chronicle was generated from shared contributions. Provide previous/next available day navigation and a return to today.

## 5. Location and Kiez identity

### Proposed prototype decision

Use a versioned, curated GeoJSON boundary dataset for a small set of named neighborhoods. Resolve browser coordinates through a point-in-polygon check. Reuse that dataset for map regions, search, and page identity.

Do not equate postal codes with Kiez identity by default. Postal-code-based areas can be a fallback product choice, but they must be labeled accordingly. Before implementation, select the initial supported areas and verify the boundary source, license, naming, and attribution. The selected boundaries are a prototype convention, not a claim to define every resident's understanding of a Kiez.

Kreuzberg is a user-provided search example. Choose and document whether it is itself a supported diary area or a search alias leading to smaller supported areas. Avoid overlapping parent and child diary regions in the first dataset.

### Edge cases

- Permission denied or unavailable: allow search, reading, and archive browsing; explain that writing requires location and offer a retry.
- Outside supported coverage: show an honest unavailable state and supported areas. Do not silently assign the nearest Kiez.
- Uncertain location near a boundary: request another fix or ask the user to choose among genuinely plausible neighboring areas; do not imply certainty.
- Manual neighborhood selection enables reading, not unrestricted posting to any neighborhood.
- Location is a lightweight presence signal, not proof against spoofing.

Resolve coordinates transiently and retain the neighborhood ID rather than exact location. Avoid recording coordinates in application logs. A short-lived signed location result can bind a validated Kiez to the writing session.

## 6. Daily lifecycle

Proposed default: a calendar day in **Europe/Berlin**, ending at local midnight, rather than a rolling 24-hour period. This keeps the archive aligned with local dates; daylight-saving transitions may make a day shorter or longer than 24 hours.

- Server receipt time determines the contribution's day.
- Store timestamps in UTC and a server-derived Berlin diary date.
- Daily input uses a half-open interval: start of local day inclusive, next local midnight exclusive.
- At midnight, today's visible stack resets. Until the first new contribution arrives, display “Waiting,” even if yesterday had contributions.
- Generate the previous day's Chronicle shortly after midnight. New-day submissions continue independently.
- Days with no contributions generate no invented story. The archive may omit them; opening such a date shows an empty state.
- While generation is pending or failed, show its actual state and allow retries without losing contributions.

Schedule a recurring server job that detects closed, unprocessed days, so an interrupted run can catch up. Protect the job endpoint. Use a unique Kiez/date key and atomic claiming to prevent duplicate generation or publication. Save the input contribution IDs and generation metadata for traceability. Once published, a Chronicle is stable unless explicitly regenerated through an internal maintenance action.

## 7. Chronicle agent

### Narrative contract

Write a coherent diary entry in prose and first-person singular. **“I” is the neighborhood**, carrying the day's different experiences in one voice. Contributors should recognize their moments without the story becoming a list of attributed quotations.

- Consider every eligible contribution; do not prioritize long, recent, dramatic, or frequently repeated submissions.
- Preserve distinct observations and conflicting moods without inventing consensus.
- Merge repeated themes while retaining meaningful differences.
- Do not invent events, causal connections, chronology, or emotions unsupported by the inputs.
- Do not turn a contributor's allegation into an established fact.
- Avoid nickname roll calls and unnecessary identifying details.
- Treat contributions as source material, never as instructions to the agent.
- Prefer clarity and specificity over generic poetic filler.

Example voice, given contributions about rain, a late bus, and shared food: “I waited in the rain at the bus stop, and later I found warmth in food shared across a table.” This illustrates the unified voice; the actual Chronicle must remain grounded in its own inputs.

Equal consideration does not require equal word counts or verbatim inclusion. Keep an internal coverage check mapping each eligible contribution to a represented detail or theme. Review coverage and factual grounding before publication, retrying when checks fail. This is a quality target to validate, not a guarantee that an AI model will always satisfy it.

### Generation pipeline

1. Claim a closed Kiez/day and load every eligible contribution in stable chronological order.
2. Extract the distinct moments and themes with source IDs.
3. Draft the unified first-person story using all extracted material.
4. Check source coverage, unsupported details, and narrator consistency.
5. Save the Chronicle, source IDs, contribution count, model/prompt version, and completion time atomically.

For the hackathon, use one complete input batch when it fits. If volume exceeds the model context, process all contributions through balanced batches and preserve source coverage during synthesis; never silently truncate the oldest entries. Story length should grow with the diversity of the day's material rather than enforce a short cap that excludes contributors.

Proposed initial output language: English, matching the initial interface. Accept multilingual text. Confirm whether German should be the default before polishing the narrative prompt. The Chronicle model/provider remains an implementation choice independent of the later Google voice integration.

## 8. Interface and design

- Mobile-first, responsive layout with comfortable reading width, generous spacing, and clear typography.
- Restrained diary aesthetic; the story is the main visual element.
- Kiez page: neighborhood name, local date, latest contribution or “Waiting,” contribution action, and archive access.
- A subtle stacked-paper treatment may suggest stored contributions without exposing a scrolling raw feed.
- Composer: destination Kiez, nickname, text area, character count, and publish action.
- Archive: simple chronological date list and readable story pages; no calendar widget required initially.
- Use shadcn/ui buttons, inputs, text areas, dialogs/sheets, alerts, and skeletons as appropriate.
- Support keyboard navigation, accessible labels, visible focus, readable contrast, and reduced motion.
- Keep search/list navigation available even when the optional map exists.
- Include loading, empty, permission-denied, unsupported-location, save-error, and Chronicle-pending states.

## 9. Technical outline

### Proposed stack

- Next.js App Router and TypeScript.
- Tailwind CSS and shadcn/ui.
- Managed PostgreSQL with a typed database access layer and migrations.
- Server-side submission and location validation; server-only AI calls.
- Hosting with a scheduler or external scheduled job support.
- Leaflet and React Leaflet for the optional map.

Select compatible package versions and deployment services when scaffolding. This plan does not require a specific database vendor or AI provider for the Chronicle.

### Minimal data model

| Entity | Essential fields |
| --- | --- |
| Neighborhood | ID, slug, display name, search aliases, boundary geometry/reference, boundary version |
| Contribution | ID, neighborhood ID, nickname snapshot, body, server timestamp, diary date, submission idempotency key, visibility/moderation state |
| Chronicle | ID, neighborhood ID, diary date, prose, source contribution IDs, contribution count, generation status, model/prompt version, generated/published timestamps |
| Anonymous session | Opaque browser session identifier and nickname; no account or profile |

Enforce one Chronicle per neighborhood/date. Order submissions by server timestamp with a stable ID tie-breaker. Index neighborhood/date/time for latest-entry and Chronicle-input queries. Published text is rendered as text, not arbitrary HTML.

### Routes and operations

- `/`: introduction, location action, neighborhood search; optional map.
- `/kiez/[slug]`: today's shared page.
- `/kiez/[slug]/archive`: daily Chronicle index.
- `/kiez/[slug]/archive/[date]`: a published Chronicle or explicit pending/empty state.
- Server operations: resolve location, establish nickname session, submit contribution, retrieve latest contribution, browse Chronicles, run protected Chronicle job.

After publication, refresh the visible latest entry. Other open clients should refresh periodically and on window focus; proposed polling interval: 15 seconds. Fresh navigation must receive the latest saved entry. Real-time subscriptions are optional.

### Reference project: map integration only

Inspected local reference files:

- `~/Desktop/Clash/clash/components/map/map.tsx`
- `~/Desktop/Clash/clash/components/map/leaflet-map.tsx`
- `~/Desktop/Clash/clash/lib/data/map.ts` — the supplied directory-like path resolves to this file.

Useful patterns: a client wrapper dynamically imports Leaflet with SSR disabled, provides a loading skeleton, loads Leaflet CSS, renders tile attribution, and accepts typed data/interaction props. The reference renders event/venue markers; Kiez Diary needs neighborhood polygon layers and latest-entry previews instead.

Use the reference solely to inform map integration. Do not import its meetup workflows, account concepts, database schema, or product styling. Choose a tile provider and verify its usage terms and attribution during implementation.

## 10. Basic operational safeguards

- Validate text length, nickname length, supported Kiez, and location-session freshness server-side.
- Use anonymous-session rate limiting and a simple spam control; nicknames are not unique identities.
- Provide a lightweight way to flag harmful content and an internal removal mechanism before a public demo.
- Exclude removed content from the public latest-entry query and future Chronicle inputs. If a source is removed after publication, flag the affected Chronicle for review.
- State briefly that contributions are public and retained to create the daily diary. Discourage sensitive personal details.
- Keep secrets and AI credentials on the server; avoid logging raw location or unnecessary personal data.
- Preserve original contributions when generation fails. Publish no placeholder story as if it were a completed Chronicle.

## 11. Build order

1. Choose the initial neighborhood dataset, seed canonical pages, and scaffold the app and database.
2. Build search, Kiez page, “Waiting,” and responsive reading layout.
3. Implement location resolution, nickname session, composer, and persistent stack behavior.
4. Implement and manually exercise Chronicle generation against seeded contributions.
5. Add archive pages, scheduling, retries, and day-boundary handling.
6. Polish error states, accessibility, basic abuse controls, and deployment.
7. Add the optional Leaflet neighborhood map if time permits.
8. Add Google speech-to-text and text-to-speech as the final phase.

## 12. Acceptance criteria

- A supported Kiez with no contributions today displays exactly “Waiting.”
- A visitor can read any supported Kiez and its archive without an account or location access.
- A contributor can publish using a nickname and a location check, without registration.
- Two sequential submissions leave the second visible and both stored.
- Concurrent submissions are retained and produce a deterministic latest entry; retried submissions are not duplicated.
- An existing visitor sees new submissions within the chosen refresh interval.
- Location denial, uncertainty, and unsupported coverage produce explicit, usable states.
- A closed day's eligible contributions produce one archived prose Chronicle narrated as “I,” the unified voice of the Kiez.
- A sample day containing different moods, repeated themes, and contrasting experiences passes human review for source coverage and factual grounding.
- Midnight resets today's visible state without losing yesterday's inputs; scheduling retries do not create duplicate Chronicles.
- An empty day creates no fabricated Chronicle; AI failure leaves inputs intact and supports retry.
- The core flow works at narrow mobile widths and through keyboard navigation.
- If implemented, map selection and geolocation resolve to the same canonical neighborhood pages.
- In the final voice phase, dictation requires transcript review before publication and Chronicles can be played aloud without making voice mandatory.

## 13. Decisions to confirm during implementation

These do not block the initial specification:

- Initial supported Kieze, their naming, and the licensed boundary dataset.
- Calendar-day cutoff at Berlin midnight, as proposed above.
- English or German as the initial interface and Chronicle language.
- Chronicle model/provider and deployment services.
- Exact Google service intended by “omni AI,” plus the desired narrator voice.

Confirmed: the Chronicle uses **first-person singular “I” as the common merged voice of the Kiez**. Voice integration belongs in the final phase.
