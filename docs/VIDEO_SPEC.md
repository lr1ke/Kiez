# Kiez Notes — hackathon video specification

Implementation note, 2026-09-13: the finished cut is approximately 2:22 and 4.35 MB. It uses OpenAI’s synthetic female `coral` voice because Gemini speech returned server errors and then rate-limit responses. The static avatar, all five slides, labeled website screenshots, audio waveform and captions are included. See `video-assets/README.md` for the actual production details; the plan below records the original approach.

## Deliverable and approach

Produce one upload-ready video, `docs/Kiez_Notes_Project_Video.mp4`, targeting 2:30–2:45 and strictly below 3:00. Reuse the submitted `Kiez_Notes_Presentation.pdf`, add current website screenshots, and narrate in English with a synthetic female voice. A small illustrated female presenter avatar represents the speaker. No lip-sync, talking-head service, personal voice recording, or avatar training is needed.

Use a fictional presenter, not an assumed likeness of the project creator. Keep her visible in a dedicated side area beside the slides and screenshots, with a subtle speech-active indicator. Her mouth does not move. Label her “AI narrator” unobtrusively. The narration speaks about the project; only a clearly introduced Chronicle excerpt uses the neighborhood’s “I.”

The production budget is the remainder of the user’s one-hour submission window. Prioritize a complete, readable video and reserve at least ten minutes for review and upload.

## Visual and audio direction

- Preserve the presentation’s warm paper background, dark green type and muted terracotta accents.
- Reuse all five slides as rendered images. The PDF was verified through the macOS renderer; using rendered slide images avoids font substitution during video export.
- Use a simple editorial illustration of an adult woman, shoulders up, in muted green clothing on a plain cream background. Generate one asset and reuse it throughout. No resemblance to a particular person is required.
- Give the presenter a slim side panel on slide scenes; show website detail crops at a readable scale. Keep the avatar clear of text, controls and map attribution.
- Narration: warm, clear, conversational female voice, approximately 135–145 words per minute. Listen to a short sample before rendering the complete script. Check “Kiez” (approximately “keets”) and neighborhood names.
- Use the existing Gemini speech integration and configured voice as the starting point. Audition it for the requested female voice; choose another available voice if necessary. A configured key is present, but production narration has not yet been generated or checked.
- Generate narration in scene-sized chunks, using the same voice and direction. Measure each audio file and set scene lengths from the actual recording, rather than forcing the voice into provisional timings.
- Use restrained fades and occasional close-up crops. Avoid background music so the voice stays clear and no additional music sourcing is needed.
- Include readable English captions in a reserved bottom band, synchronized to short narration segments. Keep captions to two lines; verify timing against the generated audio.

## Storyboard

Timings are provisional; the final cut follows the recorded narration.

| Time | Visual | Purpose |
| --- | --- | --- |
| 0:00–0:22 | Slide 1, presenter avatar | Introduce the place-based idea and new narratives. |
| 0:22–0:42 | Current website: landing/map, then neighborhood page | Establish that the product exists and show how a visitor discovers a Kiez. |
| 0:42–1:09 | Slide 2 and a close-up of the latest-note area | Explain the wiki-style shared page, replacement of the visible note, and retained stack. |
| 1:09–1:37 | Slide 3, then archive and one Chronicle screenshot | Explain the shared narrative and distinction between the current moment and past days. |
| 1:37–2:08 | Slide 4, with a close-up of Translate/Listen controls | Describe voice contribution, transcript review, multilingual reading and listening, and the AI roles. |
| 2:08–2:40 | Slide 5, presenter, project URL | State the prototype scope, a brief honest status note, and the closing invitation. |

## Proposed narration

### 1 — Every place has a story

Every place has a story. But the people who share a street can experience it very differently. Kiez Notes explores how those everyday perspectives can become new narratives of a place—a shared narrative told by the people who are there.

### 2 — Discover a neighborhood

Start with the map, choose a neighborhood, and open its shared page. Residents, newcomers and visitors can all read. To leave a written or spoken note, you confirm your location and choose a nickname. There are no accounts, profiles, likes or followers.

### 3 — A changing present

Think of it as a wiki-style page for a place. No single person owns what it says. Each new note goes on top of a stack and replaces the visible moment. Only today’s latest note appears. Earlier notes remain stored beneath it, ready to become part of the neighborhood’s memory.

### 4 — A shared memory

Past days take a different form. The Chronicle pipeline gathers a day’s notes into one summarized story, narrated as “I,” the neighborhood. The aim is to preserve different moods and uncertainty: a lively canal can feel welcoming to one person and overwhelming to another. These Chronicles form the archive. Empty days receive no invented story.

### 5 — Across languages

People don’t need to share a language to share a place. Spoken notes become transcripts that contributors review and edit before publishing. Original text and language are preserved. Readers can request translation or speech in English, German, Turkish, Arabic and Spanish. Gemini supports these language and voice features; OpenAI powers Chronicle extraction, writing and review.

### 6 — Explore Kiez Notes

The prototype covers four Berlin neighborhoods and Hamburg’s HafenCity. The demo archive contains labeled editorial stories; live Chronicle generation has been rehearsed, with grounding and daily scheduling still to improve. Kiez Notes brings together a changing present and a shared memory. Explore the project, and imagine what story your neighborhood could tell.

## Website capture scope

Use Chrome and the deployed app at https://kiez-ten.vercel.app/. Capture the current landing/map view, one neighborhood’s latest-note area, its archive and a Chronicle with language controls. Preserve any fictional-content labels and OpenStreetMap attribution. Label screenshots as “Website capture” and seeded stories as “Editorial demo Chronicle.”

Check current content before selecting shots. If a page says “Waiting,” show that honestly or use an archive view; do not reset seed data to improve a screenshot. Avoid exposing genuine contributors’ personal details. Do not publish a new contribution for this video. The existing slide diagram explains note replacement without altering live data.

Screenshots are the baseline: they establish the working interface with fewer capture and editing dependencies. Optionally replace the discovery screenshots with a short map → neighborhood → archive recording if it can be captured cleanly within five minutes. Do not make the final video depend on microphone permissions, location simulation or provider response times. Any shortened waiting period in an optional recording must be labeled; screenshots must not be presented as a recorded successful interaction.

## Production steps and time limits

1. **First 5 minutes:** verify slide assets, create output folders, obtain an FFmpeg executable in a temporary environment, and test a short female voice sample.
2. **Next 10 minutes:** generate the single presenter illustration, capture website views, and finalize the narration. If image generation is unavailable or too slow, use a simple original vector illustration for the presenter.
3. **Next 10 minutes:** generate six narration clips, listen for missing words or pronunciation issues, and measure durations. Retry only affected clips. If Gemini fails repeatedly, use an installed macOS female system voice after auditioning it; do not start a new provider onboarding process.
4. **Next 15 minutes:** compose slides, website captures, avatar, captions and audio. Export a first complete MP4. Adjust pacing by shortening copy if necessary, rather than cutting off narration or applying conspicuous speed-up.
5. **Final 10 minutes:** watch the actual MP4 from beginning to end, check duration and size, and make only essential corrections. Leave the remaining time for upload. Shorten optional capture/animation work if less time is available.

## Export settings

- MP4 container; H.264 video; AAC audio; `yuv420p`; 16:9 landscape.
- Default 1280 × 720 at 24 fps for a compact upload. Render source slides/screenshots at higher resolution before scaling.
- Start with constant-quality encoding around CRF 24 and AAC mono at 96 kb/s. Inspect small text and increase quality if required. Use fast-start metadata for playback before a full download completes.
- Aim for approximately 10–30 MB; this is an estimate, not a guaranteed size. Optimize readability before pursuing the smallest possible file. Do not produce 4K or lossless video for submission.
- Keep intermediate images, audio and render scripts in a working directory. Deliver the MP4 plus this specification; the user does not need editing software to upload it.

## Completion checks

- Final file plays correctly in Mac QuickTime or Chrome, with both picture and audible female narration.
- Actual duration is below 180 seconds, including the closing frame.
- All five presentation slides are integrated and at least two current website views are legible.
- Avatar, captions and slide text do not overlap. No font corruption, black gaps or clipped endings.
- Voice and captions follow the visuals; original notes and summarized Chronicles remain clearly distinct.
- Demo labels remain visible. The video does not imply automatic daily scheduling is operational or that displayed editorial stories were generated live.
- End card shows `kiez-ten.vercel.app` for at least four seconds.

## Technical references

- [Gemini speech generation](https://ai.google.dev/gemini-api/docs/speech-generation): configurable voices and prompting for delivery style; reuse the project’s working integration.
- [imageio-ffmpeg](https://github.com/imageio/imageio-ffmpeg): Python wheels provide an FFmpeg executable for common platforms. FFmpeg is not currently on this workspace’s PATH; installation and encoder availability must be checked before rendering.
- [FFmpeg MP4 options](https://ffmpeg.org/ffmpeg-formats.html): `+faststart` moves MP4 metadata to the beginning for easier playback.

No lip-sync service is required under the clarified brief. No subscription purchase is part of this plan.
