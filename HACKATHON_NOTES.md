# Kiez Notes — project and presentation handoff

Updated: 2026-09-13. This is the current handoff; it supersedes earlier setup-status notes. Older references to “Kiez Diary” in PLAN.md and AGENTS.md describe the same project under its previous name.

## Submission materials update — 2026-09-13

- `docs/PROJECT_ONE_PAGER.md` now centers the wiki-style shared page, the stack with only today’s latest note visible, and the archive of summarized AI Chronicles. “New narratives” and “shared narrative” are central terms requested by the user.
- The user uploaded `docs/Kiez_Notes_Presentation.pdf` as the slide submission. It contains five slides. Open the PDF in Mac Preview; the editor may display binary PDF data as text.
- Video limit: three minutes. The user requested a synthetic female narrator and a static female avatar, explicitly without lip-sync.
- `docs/Kiez_Notes_Project_Video.mp4` is the video export: approximately 2:22, 4.35 MB, 720p H.264/AAC. It integrates all five slides, current website screenshots, captions and a static illustrated presenter with an audio waveform. The user has not yet confirmed upload of the video.
- Video narration uses OpenAI `gpt-4o-mini-tts` / `coral` after Gemini speech returned HTTP 500 and 429 responses. The app’s providers and configuration were not changed. The presenter is fictional and labeled “AI narrator.”
- `docs/VIDEO_SPEC.md` contains the production plan. `docs/video-assets/README.md` records actual methods, assets, generation prompt and rebuild instructions. Video capture was read-only; no live contributions were created or removed.
- The video decoded fully without warnings; automated transcription recovered the complete spoken script. Final browser playback results are saved in `docs/video-assets/playback-check.json`. No human listening review is claimed.

The earlier presentation outlines below are retained as planning history; the materials listed above supersede their “not created yet” status.

## Current direction

The user considers the deployed app ready to demo/showcase as a proof of concept. Keep the working product as it is for now. Next, create the presentation materials in this order:

1. A project one-pager / abstract.
2. A slide deck of **at most five slides**.
3. A project video.

These deliverables have not been created yet. The outlines below are proposed starting points, not approved final copy. Audience, submission template, video duration/aspect ratio and deadline still need to be established when preparing the materials. Default to English, matching the current conversation and UI, unless directed otherwise.

## Project essentials for all three deliverables

- **Name:** Kiez Notes. Use this spelling throughout new materials.
- **Live app:** https://kiez-ten.vercel.app/
- **Headline:** Every place has a story.
- **Core message:** The neighborhood, told by its people.
- **Supporting line:** People don’t need to share a language to share a place.
- **Concept:** A place-based collection of everyday observations. People discover a neighborhood on a map, leave a short written or spoken note while there, and explore its collective memory through Chronicles.
- **Problem framing:** People share streets while experiencing them differently and speaking different languages. Small observations are easily lost; Kiez Notes explores how to make them part of a shared local memory. This is the project’s premise, not a claim backed by user research.
- **Intended audience:** Residents, newcomers and visitors curious about everyday neighborhood life. No adoption, retention or impact metrics have been established.
- **Distinctive approach:** The place is central. No accounts, profiles, likes or followers. Reading is public; writing requires a fresh location check. A nickname is an unverified display name.
- **Multilingual experience:** English, German, Turkish, Arabic and Spanish are offered. Original text and source language are preserved; translation and speech are requested on demand.
- **Voice contribution:** Record → original-language transcript → review/edit → explicitly publish. This is a recorded contribution flow, not a conversational voice agent.
- **Public notes:** Only today’s latest eligible contribution appears on a neighborhood page. Earlier contributions stay stored for the Chronicle; they are not exposed as a public feed.
- **Chronicles:** One canonical English prose story for a day, narrated as “I,” the neighborhood. The intended narrative preserves different moods and uncertainty instead of inventing consensus. Readers can translate and listen on demand.
- **Quiet days:** Display exactly “Waiting” when today has no contribution. Empty days receive no invented Chronicle. Calendar boundaries use Europe/Berlin time.

## What is built and deployed

- Responsive map/search discovery, neighborhood pages, contribution composer, archive and Chronicle pages.
- Five approximate prototype areas: Graefekiez, Bergmannkiez, Reuterkiez and Schillerkiez in Berlin; HafenCity around the KLU presentation venue in Hamburg. These are illustrative areas, not official boundaries.
- 160 fictional multilingual seed contributions across four Berlin areas and five dates; 16 labeled editorial fixture Chronicles. HafenCity was introduced without seeded notes and can receive real submissions.
- Next.js App Router + TypeScript, Tailwind, Radix-based UI components, Leaflet/OpenStreetMap.
- Vercel production hosting, with function region dub1; Supabase PostgreSQL for hosted persistence. PGlite remains available for local use without DATABASE_URL.
- Google Gemini handles transcription, language detection, translation and text-to-speech. Last verified configuration: gemini-3.6-flash for text/transcription, gemini-2.5-flash-preview-tts for speech, voice Kore.
- OpenAI Responses API handles Chronicle extraction → writing → review, using gpt-4.1 in the last rehearsal.
- Protected Chronicle catch-up endpoint exists and processes at most one candidate day per invocation. **No external scheduler is connected.** Do not claim unattended daily publication is operational.
- Hosted requests skip schema/seed initialization. Run the documented setup/seed process explicitly when required; preserve real contributions.

## Latest work and verification

- Investigated deployed Listen failure. A production speech request returned HTTP 200 and valid WAV audio, and playback succeeded in an automated Chrome check. The user also confirmed Chrome works and identified Safari as the failing browser.
- Removed the entire decorative stack of notes from the landing page, including the Turkish sample note.
- Renamed visible branding from Kiez Diary to Kiez Notes; changed actions to “Read notes” and “Leave a note,” updated metadata and supporting copy, and changed the headline to “Every place has a story.”
- Removed the unused hero layout column and changed the top navigation label to simply “Explore.”
- User pushed the UI changes. Latest deployed source commit: `c50291b` (`ui fix`). Working tree was clean before this documentation update.
- Deployed successfully to the existing Vercel project `kiez`; production alias remains https://kiez-ten.vercel.app/.
- Deployment URL: https://kiez-pm79rk2nz-ulrikes-projects-82e56a52.vercel.app
- Typecheck and local production build passed for the UI work; Vercel production build passed. Live HTML checks verified Kiez Notes branding, Explore navigation and removal of the stack/old branding.
- Earlier sessions recorded eight passing unit tests and browser flow checks. The full browser suite was not rerun for the latest UI copy changes; existing test selectors were updated.
- A live German translation → speech → transcription round trip passed locally. A live three-stage OpenAI Chronicle rehearsal completed, but manual review found unsupported chronology.

## Demo limits and deferred work

- **Use Chrome for the demo and video capture.** Safari playback remains unresolved. No Safari fix was implemented.
- Translation and speech can feel slow. The current flow waits for translation and the complete generated audio before playback. An earlier hosted check measured about 6.7 seconds for German translation and 9.4 seconds for translation plus speech; these are individual observations, not benchmarks or guarantees.
- Streaming playback and reuse of translations/audio were discussed, but the user chose to defer them. No latency optimization or provider switch was implemented. Gemini Omni was discussed; it is not integrated.
- Five-language quality, browser microphone recording and phone permissions still need focused rehearsal. Do not equate one German API round trip with full multilingual validation.
- Visible seeded Chronicles are editorial fixtures, not proof of live automated generation quality. Clearly distinguish the implemented generation pipeline and its rehearsal from the displayed demo stories.
- No production-readiness, adoption, measured social impact or fully validated grounding claims. This is a working hackathon PoC.
- No additional architecture work is needed for the presentation. Later priorities can include Safari, first-playback latency, multilingual review, Chronicle grounding and scheduling.

## One-pager / abstract brief

Aim for one readable page, with a short abstract at the top that can also serve as submission copy. Suggested order:

1. Name, headline and live project link.
2. The problem and intended audience.
3. The solution and concrete journey: discover a place → contribute a note → revisit its collective memory → read/listen across languages.
4. What AI does: language access and synthesis, while contributors retain review before publication.
5. What the PoC demonstrates, with an explicit sentence distinguishing fictional fixtures from real contributions and generated-story rehearsals.
6. A compact technology line and the next improvements.

Lead with the human experience. Keep model IDs and operational details in supporting notes unless the submission asks for them. Preserve the distinction between a person’s original note and the neighborhood’s synthesized Chronicle.

## Slide deck brief — maximum five slides

| Slide | Purpose | Suggested content / visual |
| --- | --- | --- |
| 1 | Introduce the idea | Kiez Notes, “Every place has a story,” the everyday-language problem and intended audience. |
| 2 | Show the experience | Map discovery → Leave a note → review/publish. Use current UI screenshots. |
| 3 | Explain the shared memory | Original multilingual notes → daily Chronicle → translated text and speech. Label fixture examples. |
| 4 | Establish what works | Deployed PoC screenshot and a small diagram: browser → Next.js → Supabase; Gemini for language/voice, OpenAI for Chronicle synthesis. Mention current limits briefly. |
| 5 | Close with the value and next step | Supporting line about sharing a place across languages, demo link/QR, and concise next improvements. |

Keep text sparse. Show the product and one concrete example rather than reading out technical implementation details. Do not add a sixth appendix slide unless the user changes the limit.

## Project video brief

Proposed starting format: a short narrated screen recording, approximately 60–90 seconds, subject to submission requirements. This duration is a suggestion, not a user requirement.

Suggested storyboard:

1. Title and premise: Kiez Notes, Every place has a story.
2. Explore: choose a neighborhood on the map and open its notes.
3. Contribute: show location check, a short note or recording, transcript review when using voice, and explicit publication.
4. Remember: open an archived Chronicle and explain that it gathers a day’s different voices into the neighborhood’s perspective.
5. Cross languages: show translation and a short audible playback sample in Chrome.
6. Close: live URL and the supporting line about sharing a place across languages.

Record a rehearsed successful flow. If trimming generation waits, label the transition as shortened for the demo; do not imply instant playback. Keep fictional content labeled and do not imply that a newly submitted note immediately produced an existing fixture Chronicle. Capture only approved demo content and keep credentials/settings out of frame. A recording of publication will create a real stored submission; choose its content intentionally.

## Before preparing assets or recording

- Confirm the submission audience, required abstract length, deck format and video specifications.
- Rehearse the live Chrome flow and choose the exact neighborhood, Chronicle and playback language.
- Check today’s populated state. Demo seed dates are anchored, not advanced at restart, so a later day may show Waiting. Use README.md for an intentional demo-only reset if needed; never erase real notes.
- Location is required to write. Venue test coordinates: HafenCity/KLU 53.54057, 9.99437; Graefekiez rehearsal coordinates: 52.4917, 13.4150. If simulating location for a recording, identify it as a demo rather than evidence of physical presence.
- Use the deployed Kiez Notes UI for screenshots; older images may show the former brand and removed stack.
- Prepare screenshot captures, a short approved sample note and an audible TTS sample. No presentation assets or video have been created in this handoff task.

## Working references

- README.md: local setup, provider rehearsals, database and seed commands. Some prose still uses the old name or pre-deployment status; this handoff records the current deployment state.
- PLAN.md: original product specification, not a checklist of verified completion.
- AGENTS.md: implementation guardrails and file map; its older provider/deployment status has been superseded here.
- lib/ai.ts and lib/openai.ts: current provider implementation and Chronicle prompts.
- app/page.tsx, components/header.tsx, components/explore.tsx: current landing page, branding and map discovery.

Keep API keys server-side and out of source control, screenshots, slides, video and notes. Do not assume a local development server is still running between sessions.
