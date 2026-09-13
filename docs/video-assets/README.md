# Kiez Notes video assets

Final upload file: [Kiez_Notes_Project_Video.mp4](../Kiez_Notes_Project_Video.mp4).

The video uses all five submitted presentation slides, read-only screenshots captured from the deployed app on 2026-09-13, a static fictional female avatar, an audio-driven waveform and burned-in English captions. No contributions were published, edited or removed during capture. Website screenshots are labeled, and editorial demo provenance is preserved.

Narration was generated with OpenAI `gpt-4o-mini-tts`, voice `coral`, using the existing local API configuration. Gemini speech returned server errors and then rate-limit responses, so it was not used for the final video. This provider change applies only to the video: the app’s Gemini integration is unchanged. The presenter is labeled “AI narrator.”

The final video is 1280 × 720, 24 fps, H.264/yuv420p with AAC mono audio and fast-start MP4 metadata. Duration is approximately 142 seconds. File size is approximately 4.35 MB. One continuous audio stream avoids timing discontinuities between clips.

`narration.json` preserves the spoken copy; `captions.srt` and `timeline.json` preserve the timings. `audio-verification.json` is an automated transcription of the first complete cut: it recovered the full narration, with a phonetic spelling of “Kiez.” It is an automated content check, not a human listening review. `playback-check.json` records the final browser playback check when completed.

Final validation passed: Chrome played the entire 141.896-second MP4 at normal speed, with 3,405 decoded frames, zero dropped frames, a nonzero audio signal and no playback error. FFmpeg decoded the full file without warnings. The exported audio measured −16.9 dB mean volume and −1.2 dB peak.

To rebuild, run `build_video.py` with Pillow and imageio-ffmpeg installed. It uses macOS Arial/Georgia fonts and writes intermediate frames and clips to `/private/tmp/kiez-video/render`. The existing WAV files are reused; rebuilding does not call an AI provider. `generate_narration.cjs` is the separate provider-backed generation script and skips existing narration files.

## Presenter generation

Created using the built-in image-generation tool. Saved asset: `presenter.png`.

Exact prompt:

> Use case: illustration-story. Asset type: small static female narrator avatar for Kiez Notes project video. Create a polished editorial illustration of a fictional adult woman around 35, friendly calm expression, shoulder-length softly wavy dark brown hair, subtle round glasses, wearing a muted forest green sweater. Head and shoulders centered, front-facing, mouth closed with a gentle smile, comfortably cropped upper torso, no hands. Warm minimal paper-cut and ink illustration style with refined simple shapes and slight paper texture, not photorealistic, not childish. Solid warm cream background #f7f5ef, forest green #455840, muted terracotta accents #ac694f. Square composition. No text, no letters, no border, no logos, no speech bubble. This is a fictional presenter, not a depiction of a specific real person.

## Voice direction

> Speak as a warm, clear female narrator presenting a thoughtful neighborhood project. Natural conversational delivery, gently enthusiastic, about 145 words per minute, with short pauses. Keep the same relaxed voice throughout. Pronounce Kiez as keets. Read the script exactly, without adding words.

Provider references: [OpenAI text-to-speech](https://developers.openai.com/api/docs/guides/text-to-speech), [imageio-ffmpeg](https://github.com/imageio/imageio-ffmpeg).
