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

## Supabase connection completed

Supabase configured in local DATABASE_URL. Password URL encoding fixed locally; TLS uses sslmode=require with libpq compatibility (encryption without certificate identity verification). Schema and demo records initialized; fresh connection verified 5 areas, 160 contributions and 16 editorial fixture Chronicles. Row-level security enabled on all seven diary tables with no browser policies; verified anon sees zero contributions while server sees 160. App restarted with Supabase. Eight tests passed. Local PGlite data remains untouched and was not transferred. Hosting, scheduler and a hosted location-checked submission rehearsal remain outstanding.

## Vercel production repaired

CLI linked to existing project kiez. Production DATABASE_URL replaced securely with tested local credentials using transaction pooler port 6543. Existing sensitive variable update failed in CLI, so production variable was removed and re-added. Deployed local source successfully to https://kiez-ten.vercel.app/ (deployment dpl_FdjyYTL2UVWeeTftyzz49vnxiLwK). Live checks passed: landing page and HafenCity server rendering, API returns five areas, eight current-day entries in each Berlin area and zero in HafenCity. First live request was slow; startup currently reapplies schema and loops through demo seed on each new connection/process. Preview database secret was not repaired. Phone microphone/location, hosted publication, remaining language quality, and scheduler still need rehearsal/setup.

## Page speed and deployed Google repaired

Vercel requests now skip schema/seed initialization; run seed CLI against hosted DB before deployments needing schema changes. Local auto-seed skips existing anchors. Function region set to dub1 beside Supabase eu-west-1. Landing response measured 0.923 seconds (single HTTP check, not full browser load). Production Google settings synchronized; logs exposed a 404 for gemini-2.5-flash. Restored gemini-3.6-flash for text/transcription in local env, example, code defaults and production. Live German translation passed in 6.747s and translation+speech in 9.352s. Deployment dpl_7MmDL4rqVpJWNMwstCHnvTudBdyi at https://kiez-ten.vercel.app/. Typecheck, eight tests and remote build passed. Changes remain uncommitted; preserve them before next Git-based deployment.
