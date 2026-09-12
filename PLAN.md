# Kiez Diary — prototype specification

Status: hackathon plan, ready to guide implementation.

## 1. Concept

**The neighborhood, told by its people.**

Kiez Diary is a collective diary of life in a neighborhood. Each Kiez has one shared page, like a wiki organized around a place rather than individual people. Anyone currently in that neighborhood can contribute an observation, experience, thought, or moment.

Contributions form a stack. Only today's latest contribution is visible on the Kiez page. A new contribution replaces the visible top of the stack, while every earlier contribution remains stored for the daily Chronicle. This is a visual replacement, never a destructive overwrite.

At the end of each day, the Chronicle agent turns that day's contributions into one prose diary entry. **The narrator speaks as “I”: the Kiez itself, a single common, unified, merged voice.** It does not speak as “we,” impersonate a particular contributor, or present separate contributor summaries.

Daily Chronicles form the neighborhood's browsable archive. **Every place has a diary. People do not need to share a language to share a place.** Speak naturally, review what Kiez Diary understood, contribute to the collective memory, and listen to the neighborhood in your preferred language.

## 2. Product principles

- The place is the protagonist. No accounts, profiles, followers, likes, or personal feeds.
- Contributing should take only a few steps: establish location, choose a nickname, speak or write, review, publish.
- Everyone's contribution receives equal consideration in the Chronicle, regardless of length, nickname, or submission time.
- The current moment and the accumulated memory coexist: today's latest contribution alongside the archive of completed days.
- A quiet, mobile-first interface using shadcn/ui components, with an early map and equally discoverable speech and text entry.
- Voice and multilingual listening are core product capabilities, supporting people who prefer speech, are not fluent in the interface language, or have literacy or accessibility needs. Text remains fully usable.

## 3. Scope and phases

### Phase 0 — Demo dataset

Define the demo content before building the UI; implement the repeatable seed loader as soon as storage is scaffolded.

- Seed 3–4 supported Kieze, with 3–5 completed days of history and a populated current day. Aim for 6–12 contributions per populated Kiez/day.
- Write original contributions in German, Turkish, English, Arabic, and Spanish, with varied nicknames, times, everyday observations, and lengths. Do not use translations of one observation as separate contributions.
- Deliberately include conflicting moods: construction as disruption and welcome improvement, rain as inconvenience and relief, canal crowds as convivial and overwhelming. Preserve these differences in the resulting Chronicle.
- Prepare several finished, reviewed daily Chronicles from the seeded historical inputs using the same narrative contract and source coverage checks as live generation. Keep today's entries available for the next daily run.
- Example six-entry day for the Kreuzberg area (final diary name follows the boundary decision): German construction-noise complaint; Turkish bread-buying moment; English visitor noticing people along the canal; Arabic account of meeting a friend; Spanish sudden-rain observation; German story of a dog refusing to leave the park. Add contrasting perspectives within the 6–12 entry range.
- Keep a separate quiet-day fixture to verify **Waiting** without making emptiness the demo's opening experience.
- Use fictional demo content with explicit demo provenance and a brief dataset label. Store stable fixture IDs and relative Berlin day offsets; resolve dates against an explicit demo anchor date so rehearsals open on populated pages. Reruns with the same anchor must not duplicate records. Re-anchoring/resetting is confined to the demo dataset and must preserve real submissions.

The opening demo should immediately show **individual voices → accumulated neighborhood memory → multilingual playback**.

### Phase 1 — spatial diary and archive

- Next.js with TypeScript and shadcn/ui.
- A small, curated set of supported Berlin neighborhoods with stable IDs, names, search aliases, and defined boundaries.
- A required simple Leaflet map showing those areas. Tap a polygon to see its name, today's latest contribution or “Waiting,” and a link to its canonical page. Use an accessible preview/bottom sheet on mobile.
- Reuse the working Leaflet reference patterns described in section 9. No sophisticated geospatial features are required.
- Public neighborhood search, list navigation, and reading without location permission.
- Browser location lookup before writing, with confirmation of the resolved Kiez.
- Lightweight nickname session without registration, email, password, or public profile.
- Append-only submissions preserving original text and source language, and one visible latest contribution per Kiez per day.
- Exact empty-state line: **Waiting**.
- Daily canonical Chronicle generation, seeded completed Chronicles, and a browsable archive.
- Persistent storage, basic submission controls, and deployed scheduling.

### Phase 2 — core multilingual voice loop

This phase is required for the complete hackathon prototype. Validate Google's transcription and speech endpoints early, alongside Phase 1, so voice is not left as a final stretch goal.

- Contribution: **Speak → transcribe in the source language → show editable transcript → explicitly publish**.
- Reading: **Listen → choose language → translate if necessary → read aloud**. Offer this for both a Chronicle and the currently visible contribution.
- Show the original contribution and offer Translate without requiring audio playback.
- Initial target languages: Deutsch, Türkçe, English, العربية, and Español. Verify each across transcription, translation, and speech generation before enabling it.
- Provide visible recording, stop, cancel, transcription, review, playback, and error states. Request microphone access only when recording starts; never autoplay speech.
- Keep text entry and reading available if voice fails or permission is denied. Preserve drafts and allow retries without publishing automatically.
- Do not publish unreviewed transcripts or retain raw recordings by default. Discard temporary audio after transcription/cancellation.
- Keep provider credentials on the server. Confirm models, deployment limits, supported audio formats, pricing, and data handling during the early integration spike.

### Google API approach

Google/Gemini is the intended voice provider. Google's [Live transcription documentation](https://ai.google.dev/gemini-api/docs/live-api/live-transcribe) describes streaming transcription and automatic language detection. Investigate that capability in the early spike, but a persistent conversational session is not required.

For the default record-and-stop journey, start with a bounded browser recording sent to a server transcription operation using Google's [audio transcription API](https://ai.google.dev/gemini-api/docs/transcribe). Use Live transcription only if incremental transcripts materially improve the simple recording experience. Select and verify exact model IDs during implementation.

Translate requested text with a server-side text generation operation, then pass that version to [Gemini text-to-speech](https://ai.google.dev/gemini-api/docs/speech-generation), which Google distinguishes from interactive Live audio and describes as suited to reciting supplied text. Use a consistent configured narrator voice where supported. These are separate capabilities; one Live session need not perform the entire workflow. Documentation reviewed on 2026-09-12; endpoint/model availability must be checked in the project's account.

### Out of scope for the first prototype

User profiles, social graphs, comments, reactions, direct messages, meetups, photo/video uploads, public browsing of the raw contribution stack, user editing of published Chronicles, full-city boundary coverage, a fully conversational real-time voice agent, and permanent pretranslation of every item into every language.

## 4. Core journeys

### Discover and read

1. Open the landing page with a short explanation, the populated neighborhood map, and “Find my Kiez.”
2. Tap a map area and its preview, grant location access, or search/select a supported neighborhood.
3. Open its canonical page.
4. See today's latest contribution, its time and nickname, or “Waiting” if today has none.
5. Read the original, optionally translate it, or choose Listen and a playback language.
6. Browse previous daily Chronicles through an archive link or date list.

Reading is public and does not require a nickname or physical presence. Search results always resolve to the same canonical Kiez page.

### Contribute

1. Tap “Add to the diary.”
2. Obtain a fresh browser location and resolve it to a supported neighborhood.
3. Show “You're writing in [Kiez]” before submission. If the reader is browsing another neighborhood, route the composer to the detected Kiez with a clear explanation.
4. Ask for a nickname if the current browser session has none. Explain that it is a display name, not an account or verified identity.
5. Speak, stop recording, and review/edit the source-language transcript, or type directly. Proposed published-text limit: 2,000 characters. Show detected language and allow correction; preserve mixed-language text rather than forcing it into the interface language.
6. Publish explicitly. The server validates the submission and derives the destination from the location check.
7. Show the saved contribution as the new top of today's stack. Retain previous submissions for the Chronicle.

Preserve the draft if publication fails. Prevent duplicate submissions caused by retries or double taps. Contributors cannot edit or delete other people's entries.

### Read the archive

Open the Kiez archive, choose a date, and read that day's Chronicle. Show the date, neighborhood, contribution count, and a short label explaining that the Chronicle was generated from shared contributions. Provide previous/next available day navigation and a return to today. Offer “Listen in” with a language selector; show the translated text used for playback while keeping the canonical original available.

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
2. Interpret the original multilingual texts and extract distinct moments and themes with source IDs, preserving uncertainty and contrasting moods across languages.
3. Draft the unified first-person story using all extracted material.
4. Check source coverage, unsupported details, and narrator consistency.
5. Save the Chronicle, source IDs, contribution count, model/prompt version, and completion time atomically.

For the hackathon, use one complete input batch when it fits. If volume exceeds the model context, process all contributions through balanced batches and preserve source coverage during synthesis; never silently truncate the oldest entries. Story length should grow with the diversity of the day's material rather than enforce a short cap that excludes contributors.

### Language and on-demand playback

Store each contribution's original submitted text (the reviewed transcript for speech), source/detected language, nickname, Kiez, and timestamp. Record input mode and allow language correction; use an explicit unknown/mixed value where detection is inconclusive. Raw audio is not the archival source.

Generate and persist **one canonical Chronicle per Kiez/day**, with its language. Proposed default: English, matching the initial interface; confirm English versus German before prompt polishing. The generation model must synthesize all source languages directly; no permanently translated contribution collection is required.

When a reader requests Translate or Listen, translate only the selected contribution or Chronicle into the chosen language. Skip translation when the source already matches. Preserve facts, conflicting moods, and the Chronicle's first-person neighborhood narrator. Show the translated text, label it as a translation, and synthesize that exact version for playback. Never replace the original contribution or canonical Chronicle with a translation.

Translations and audio are disposable request results, not additional canonical records. Start without persistent caching; if latency warrants a cache, bound its lifetime and key it by source ID/content version, target language, and relevant model/voice settings. Regeneration or removal invalidates derived results. No fan-out jobs to populate every language. Failures leave the original readable and offer retry; changing language stops stale playback.

The Chronicle model/provider remains an implementation choice separate from the Google speech endpoints.

## 8. Interface and design

- Mobile-first, responsive layout with comfortable reading width, generous spacing, and clear typography.
- Restrained diary aesthetic; the story is the main visual element.
- Kiez page: neighborhood name, local date, latest contribution or “Waiting,” contribution action, and archive access.
- A subtle stacked-paper treatment may suggest stored contributions without exposing a scrolling raw feed.
- Composer: destination Kiez, nickname, prominent Speak and type options, recording controls, editable transcript/text area, source language, character count, and explicit publish action.
- Reading: original text, Translate and Listen actions, language selector, translated-text label, and accessible playback controls. Support Arabic right-to-left text with appropriate language/direction attributes without changing the whole interface direction.
- Archive: simple chronological date list and readable story pages; no calendar widget required initially.
- Use shadcn/ui buttons, inputs, text areas, dialogs/sheets, alerts, and skeletons as appropriate.
- Support keyboard navigation, accessible labels, visible focus, readable contrast, and reduced motion.
- Keep search/list navigation available alongside the map and if map tiles fail.
- Include loading, empty, permission-denied, unsupported-location, save-error, Chronicle-pending, microphone-denied, transcription-error, translation-error, and audio-loading/error states.

## 9. Technical outline

### Proposed stack

- Next.js App Router and TypeScript.
- Tailwind CSS and shadcn/ui.
- Managed PostgreSQL with a typed database access layer and migrations.
- Server-side submission and location validation; server-only AI calls.
- Hosting with a scheduler or external scheduled job support.
- Leaflet and React Leaflet for the required neighborhood map.
- Google transcription and TTS behind server operations, plus on-demand text translation.

Select compatible package versions and deployment services when scaffolding. This plan does not require a specific database vendor or AI provider for the Chronicle.

### Minimal data model

| Entity | Essential fields |
| --- | --- |
| Neighborhood | ID, slug, display name, search aliases, boundary geometry/reference, boundary version |
| Contribution | ID, neighborhood ID, nickname snapshot, original body/reviewed transcript, source language, input mode (text/voice), server timestamp, diary date, submission idempotency key, visibility/moderation state |
| Chronicle | ID, neighborhood ID, diary date, canonical prose, canonical language, source contribution IDs, contribution count, generation status, model/prompt version, generated/published timestamps |
| Anonymous session | Opaque browser session identifier and nickname; no account or profile |

Enforce one Chronicle per neighborhood/date. Order submissions by server timestamp with a stable ID tie-breaker. Index neighborhood/date/time for latest-entry and Chronicle-input queries. Published text is rendered as text, not arbitrary HTML. Seeded contributions and Chronicles also carry a demo dataset/fixture identifier so demo loading and cleanup can be scoped safely. No permanent per-language translation table is required.

### Routes and operations

- `/`: introduction, location action, neighborhood search/list and required map with area previews.
- `/kiez/[slug]`: today's shared page.
- `/kiez/[slug]/archive`: daily Chronicle index.
- `/kiez/[slug]/archive/[date]`: a published Chronicle or explicit pending/empty state.
- Server operations: resolve location, establish nickname session, submit contribution, retrieve latest contribution, browse Chronicles, run protected Chronicle job, transcribe a bounded recording, translate selected content on demand, synthesize requested text for playback.

After publication, refresh the visible latest entry. Other open clients should refresh periodically and on window focus; proposed polling interval: 15 seconds. Fresh navigation must receive the latest saved entry. Real-time subscriptions are optional.

### Reference project: map integration only

Inspected local reference files:

- `~/Desktop/Clash/clash/components/map/map.tsx`
- `~/Desktop/Clash/clash/components/map/leaflet-map.tsx`
- `~/Desktop/Clash/clash/lib/data/map.ts` — the supplied directory-like path resolves to this file.

Useful patterns: a client wrapper dynamically imports Leaflet with SSR disabled, provides a loading skeleton, loads Leaflet CSS, renders tile attribution, and accepts typed data/interaction props. The reference renders event/venue markers; Kiez Diary needs neighborhood polygon layers and latest-entry previews instead.

Use the reference solely to inform map integration. Do not import its meetup workflows, account concepts, database schema, or product styling. Choose a tile provider and verify its usage terms and attribution during implementation.

## 10. Basic operational safeguards

- Validate text length, nickname length, supported Kiez, and location-session freshness server-side. Bound audio duration/upload size and rate-limit transcription, translation, and speech operations. Validate target languages and check content visibility before translating or speaking stored entries.
- Use anonymous-session rate limiting and a simple spam control; nicknames are not unique identities.
- Provide a lightweight way to flag harmful content and an internal removal mechanism before a public demo.
- Exclude removed content from the public latest-entry query and future Chronicle inputs. If a source is removed after publication, flag the affected Chronicle for review.
- State briefly that contributions are public and retained to create the daily diary. Discourage sensitive personal details.
- Keep secrets and AI credentials on the server; avoid logging raw location or unnecessary personal data.
- Preserve original contributions when generation fails. Publish no placeholder story as if it were a completed Chronicle.

## 11. Build order

1. Phase 0: define 3–4 diary areas and multilingual fixtures, contrasting perspectives, historical Chronicle targets, and a repeatable demo date strategy.
2. Scaffold the app/database and implement the seed loader. In parallel with core development, validate Google transcription, translation, and TTS for the five target languages with short samples.
3. Build the Leaflet area map and previews from the reference patterns, search/list navigation, canonical Kiez pages, and responsive reading layout. Load seeded current entries immediately.
4. Implement location resolution, nickname session, composer, persistent stack behavior, and Speak → editable transcript → publish.
5. Implement canonical multilingual Chronicle synthesis and review seeded historical outputs for coverage, conflicting moods, and grounding; populate the archive with finished entries.
6. Add Translate and Listen in the chosen language for visible contributions and Chronicles, with playback controls and failure recovery.
7. Complete scheduling, retries, day-boundary handling, accessibility, basic abuse controls, and deployment.
8. Rehearse the complete demo: map → current original voice → archived collective memory → playback in another language → a reviewed spoken contribution. Verify a separate quiet-day case.

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
- The landing map shows 3–4 supported areas; tapping one opens a preview and its canonical page. Map, search, and geolocation use the same neighborhood identities and boundaries.
- A fresh demo load includes 3–5 completed days of history, 6–12 contributions per populated day, current-day entries, and several finished archived Chronicles. Re-running the same seed creates no duplicates or changes to real submissions.
- The demo contains original German, Turkish, English, Arabic, and Spanish contributions and explicit contrasting perspectives; human review confirms these survive canonical synthesis and requested translation.
- Speak → stop → transcript review/edit → explicit publish works, including language correction. No recording is published automatically; microphone/transcription failure preserves typed drafts and permits text submission.
- Readers can translate the visible contribution and listen to it or an archived Chronicle in each enabled target language. Same-language playback skips translation; other-language playback speaks the displayed translated version.
- Original text/source language and one canonical Chronicle remain stored unchanged after translation/playback requests; no all-language generation is triggered.
- Arabic originals and translations render correctly. Playback can be stopped, language changes stop previous audio, and service failures leave readable content with retry controls.
- The complete prototype includes both the simple map and multilingual voice loop. Neither is a stretch goal, although individual users can use text and search throughout.

## 13. Decisions to confirm during implementation

These do not block the initial specification:

- Initial supported Kieze, their naming, and the licensed boundary dataset.
- Calendar-day cutoff at Berlin midnight, as proposed above.
- English or German as the initial interface and Chronicle language.
- Chronicle model/provider and deployment services.
- Exact Google transcription/TTS model IDs, recorded-upload versus Live transcription after the early spike, and the desired narrator voice.

Confirmed: the Chronicle uses **first-person singular “I” as the common merged voice of the Kiez**. The demo dataset is Phase 0. The simple Leaflet map and multilingual voice loop are required prototype scope. Store original contributions and one canonical Chronicle; translate and speak on demand. A conversational real-time agent is out of scope.
