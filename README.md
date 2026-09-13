# Kiez Diary

A hackathon prototype: explore four Berlin diary areas, leave a moment, and return to a day’s collective memory.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000**. No database account is required locally: embedded PostgreSQL persists in `.data/kiez`. Run one local app process against that directory.

The first load seeds **4 Kieze, 160 original contributions in five languages, and 16 editorial demo Chronicles**. Stories are fictional and labeled. Graefekiez and Bergmannkiez are search results for Kreuzberg; Reuterkiez and Schillerkiez are in Neukölln. The hand-drawn polygon dataset is an illustrative prototype convention, not an official boundary source.

## Connect Google

Set `GEMINI_API_KEY` in `.env.local` and restart the server. Never put the key in a `NEXT_PUBLIC_` variable. Model IDs and narrator voice are configurable in the same file. The initial integration uses Gemini audio understanding for a short uploaded recording, text generation for translation and Chronicles, and Gemini TTS for playback; it does not open a conversational Live session.

- **Speak:** record up to 60 seconds → editable original-language transcript → explicitly publish.
- **Translate / Listen:** request a language for the visible contribution or a Chronicle. Translations and audio are generated on demand and are not stored permanently.
- Without a key, reading and text contributions work. Voice/translation requests show a clear unavailable state.

The integration is implemented, but live Google calls and the five-language quality check require a real project key. Verify English, German, Turkish, Arabic and Spanish with your project’s models before the demo; `ENABLED_AUDIO_LANGUAGES` controls the offered list. Google model availability and preview access vary by account. Raw recordings are not saved by this app; provider data handling follows your Google project’s terms.

References: [audio understanding](https://ai.google.dev/gemini-api/docs/generate-content/audio), [Live transcription](https://ai.google.dev/gemini-api/docs/live-api/live-transcribe), [text-to-speech](https://ai.google.dev/gemini-api/docs/speech-generation).

## Demo walkthrough

1. Open the map and choose a Kiez. Its current moment is already populated.
2. Open its diary, then the archive and a completed Chronicle.
3. With Google configured, choose another language and Listen.
4. Add a moment: check location, enter a nickname, speak or type, review, publish.
5. See the new moment replace the visible top. Earlier contributions remain stored.

Writing requires a fresh browser location inside a supported polygon. Reading never does. For a rehearsal away from Berlin, use Chrome DevTools → More tools → Sensors → a custom location, for example **52.4917, 13.4150** (Graefekiez). This uses the actual presence-check flow rather than a public posting bypass. On a phone, microphone and geolocation need HTTPS.

Demo dates are anchored once at first launch; restarting does not silently move historical records. To refresh the demo for another day, **stop the local app first**, then run:

```sh
npm run seed -- 2026-09-12 --reset-demo
npm run dev
```

This replaces only records tagged as demo fixtures and preserves real contributions. Use the actual rehearsal date. Without `--reset-demo`, the seed is idempotent for the same anchor. Quiet dates have no invented Chronicle; the next unpopulated day displays **Waiting**.

## Daily Chronicles

Days use Europe/Berlin midnight, including DST. The protected `/api/cron` operation catches up closed, unprocessed days. It claims each day, extracts moments from every eligible source, drafts an English first-person neighborhood Chronicle, checks coverage and grounding, then publishes. Failures retain contributions and retry on the next run. Published Chronicles are stable. Extremely large days fail explicitly rather than silently dropping contributions; high-volume batching is outside this hackathon build.

Set `CRON_SECRET`, then have a scheduler call `GET /api/cron` with `Authorization: Bearer <CRON_SECRET>` every five minutes. No scheduler or hosting account has been connected in this workspace.

## Optional deployment

Use a Node-compatible Next.js host. Set `DATABASE_URL` to managed PostgreSQL and configure `SESSION_SECRET`, `CRON_SECRET`, `ADMIN_SECRET`, and the Google variables. Generate independent secrets using `openssl rand -hex 32`. The schema in `migrations/001_initial.sql` is applied at startup. Use `npm run build` and `npm start`; this is a server app, not a static export. Embedded storage is for a single local process and is rejected on Vercel.

A report button records a contribution flag. Internal operations `GET /api/admin/reports` and `POST /api/admin/remove` (JSON `{ "id": "contribution-id" }`) require `Authorization: Bearer <ADMIN_SECRET>`. Removing a source hides it and places affected Chronicles under review. There is no admin dashboard in this MVP.

Map tiles use the standard [OpenStreetMap tile service](https://operations.osmfoundation.org/policies/tiles/) with visible attribution and normal browser caching, no offline downloads. `NEXT_PUBLIC_TILE_URL` can change the endpoint; update attribution too if changing provider. Map polygons remain selectable if tiles fail, and search/list navigation is always available.

## Checks

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Unit tests cover Berlin day boundaries, location resolution, multilingual fixtures, seed idempotency, concurrent writes, Chronicle claiming, and WAV formatting. Browser tests cover map navigation, archive reading, text publication, retries, mobile width, and the composer. Browser tests use Chrome and intercept tile requests so automated runs do not download OSM tiles. They create clearly named test contributions in the local demo database. Live Google quality and microphone recording require a manual rehearsal with credentials.

The build uses Next.js’s Webpack compiler because Turbopack’s worker failed in this workspace. This is a hackathon MVP: approximate boundaries, editorial demo Chronicles, simple polling, limited moderation, and no high-volume or production-readiness claim.
