# Kiez Notes

**Every place has a story.**  
The neighborhood, told by its people.  
[Explore the live project](https://kiez-ten.vercel.app/)

Kiez Notes is a wiki-style shared page for a neighborhood, continually updated by the people who are there. Each Kiez holds a stack of written or spoken notes, with only today’s latest note visible. Anyone in the area can add the next note, replacing what the page shows and offering a fresh glimpse of the place. Past days take a different form: an archive of AI-summarized Chronicles, narrated as “I,” the neighborhood. Together, this changing present and accumulated memory explore how new narratives emerge from everyday observations—and how a shared narrative can hold different experiences and languages together.

**Why this matters**

People share streets while experiencing them differently. A busy canal can feel welcoming to one person and overwhelming to another; rain can interrupt a journey or bring relief. These small observations often remain separate, especially across languages. Kiez Notes explores how they might become a shared local memory, giving residents, newcomers and visitors a way to encounter perspectives beyond their own.

**A shared page for the present**

Visitors discover a Kiez on a map or through search and open its shared page. Like a wiki, the page can be updated by different people: no single contributor owns its visible state. Anyone can read; writing requires a fresh location check and a nickname, with no accounts, profiles, likes or followers. Contributors type a note or record one, review and edit its original-language transcript, then explicitly publish.

Each new note goes on top of the stack and overwrites the visible moment. The page shows the most recent contribution, rather than a browsable history of individual notes. Earlier notes stay stored beneath it; replacing the visible note does not delete them. A day with no notes shows “Waiting.”

**An archive for shared memory**

Past days are explored through summarized AI Chronicles. The Chronicle pipeline turns a day’s collected notes into one English prose story, told from the neighborhood’s perspective. Its aim is to bring observations into a shared narrative while preserving contrasting moods and uncertainty. These stories form the archive; days without contributions receive no invented Chronicle. Original notes retain their text and source language, while both the latest note and archived Chronicles can be translated or read aloud on demand in English, German, Turkish, Arabic or Spanish.

**What AI contributes**

Google Gemini supports transcription, language detection, translation and speech. OpenAI powers the Chronicle pipeline through extraction, writing and review. Together, these capabilities explore new narratives grounded in contributed moments, with people retaining control over the notes they publish. The synthesis is a distinct interpretation of those notes; factual grounding and the preservation of different perspectives remain central evaluation priorities.

**Built with:** Next.js, TypeScript, Tailwind CSS, Leaflet/OpenStreetMap, Supabase PostgreSQL, Vercel, Google Gemini and OpenAI.

*People don’t need to share a language to share a place.*
