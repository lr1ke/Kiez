# Hackathon priorities — updated 2026-09-13

Keep this a hackathon MVP: finish and rehearse the demo before adding scope.

1. **Connect Google.** Set `GEMINI_API_KEY` and model/voice settings in `.env.local`; use server-side environment variables on the host. Never overwrite an existing env file or expose keys through `NEXT_PUBLIC_` variables.
2. **Test multilingual speech-to-text.** Try German, Turkish, English, Arabic and Spanish: speak → review/edit the original-language transcript → explicitly publish. Include mixed-language speech and microphone denial/retry.
3. **Test multilingual listening.** For both a visible contribution and an archived Chronicle, choose a language → translate if needed → play the displayed text aloud. Check Arabic direction, language switching, stop and error recovery.
4. **Rehearse the full demo.** Map → Kiez preview → current moment → archived Chronicle → listening in another language → new spoken contribution. Verify contrasting moods survive synthesis. Refresh the demo date if necessary (stop the local server before reseeding; preserve real contributions).
5. **Choose and connect hosted persistence, likely Supabase.** Use the existing PostgreSQL adapter and `DATABASE_URL`; apply the schema, seed the hosted demo, and verify contributions survive app restarts. No new account/profile system is needed.
6. **Deploy.** Configure hosting secrets, HTTPS and the protected Chronicle scheduler. Re-run the complete flow on the deployed URL, including phone microphone/location permissions and persistent writes.

## Current status

- Both provider keys are configured locally. Never copy their values into notes or source control.
- OpenAI Chronicle extraction → writing → review completed with `gpt-4.1` on eight fictional contributions. Output: `.data/chronicle-rehearsal.md`. Not published. Manual review found unsupported chronology despite automated review passing; refine before presenting it as fully grounded.
- Gemini translation → German TTS → transcription passed live; transcription matched the generated sentence exactly. The user listened to and approved the audio. Browser microphone and the remaining languages still need rehearsal. Audio latency is deferred.
- Google rejected `gemini-2.5-flash` for this new user. Local text/transcription settings now use `gemini-3.6-flash`; TTS remains `gemini-2.5-flash-preview-tts`, voice `Kore`.
- Demo refreshed to Berlin date 2026-09-13, preserving real contributions. Verified eight current-day entries and four archive days in each of four Kieze. Archive stories remain editorial fixtures.
- Production Webpack build passed on 2026-09-13. Local app restarted at http://localhost:3000.
- Hosted PostgreSQL, scheduler and deployment remain unconnected. No `DATABASE_URL` or deployment secrets are configured. User chose Supabase for hosted PostgreSQL. Project connection URI is still needed; app host remains undecided.

Next: connect hosted PostgreSQL using the existing adapter, prepare a preview deployment, then rehearse the complete flow over HTTPS. Do not describe the provider smoke tests as complete multilingual browser validation.

Use `README.md` for commands and `AGENTS.md` for the detailed handoff. Local environment files and credential-file patterns are excluded by `.gitignore`; `.env.example` intentionally contains only safe configuration examples. Ignoring files does not remove previously tracked secrets.
