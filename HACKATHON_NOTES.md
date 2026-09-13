# Tomorrow’s hackathon priorities

Keep this a hackathon MVP: finish and rehearse the demo before adding scope.

1. **Connect Google.** Set `GEMINI_API_KEY` and model/voice settings in `.env.local`; use server-side environment variables on the host. Never overwrite an existing env file or expose keys through `NEXT_PUBLIC_` variables.
2. **Test multilingual speech-to-text.** Try German, Turkish, English, Arabic and Spanish: speak → review/edit the original-language transcript → explicitly publish. Include mixed-language speech and microphone denial/retry.
3. **Test multilingual listening.** For both a visible contribution and an archived Chronicle, choose a language → translate if needed → play the displayed text aloud. Check Arabic direction, language switching, stop and error recovery.
4. **Rehearse the full demo.** Map → Kiez preview → current moment → archived Chronicle → listening in another language → new spoken contribution. Verify contrasting moods survive synthesis. Refresh the demo date if necessary (stop the local server before reseeding; preserve real contributions).
5. **Choose and connect hosted persistence, likely Supabase.** Use the existing PostgreSQL adapter and `DATABASE_URL`; apply the schema, seed the hosted demo, and verify contributions survive app restarts. No new account/profile system is needed.
6. **Deploy.** Configure hosting secrets, HTTPS and the protected Chronicle scheduler. Re-run the complete flow on the deployed URL, including phone microphone/location permissions and persistent writes.

## Current status

The local map, diary, archive, seeded multilingual content and location-checked text submission work. There are four Kieze, 160 fictional contributions and 16 editorial demo Chronicles. Google integration code exists, but real speech/translation/generation still needs credentials and live validation. Hosted PostgreSQL, scheduling and public deployment are not connected.

Use `README.md` for commands and `AGENTS.md` for the detailed handoff. Local environment files and credential-file patterns are excluded by `.gitignore`; `.env.example` intentionally contains only safe configuration examples. Ignoring files does not remove previously tracked secrets.
