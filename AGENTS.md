# Kiez Notes

**Every place has a story.**
*The neighborhood, told by its people.*

[Explore the live project](https://kiez-ten.vercel.app/)

## The idea

**Kiez Notes is a collective, place-based memory of a neighborhood.**

Each Kiez has one shared page, continually shaped by the people who live there or pass through it. Visitors can leave a short written or spoken note about what they see, feel or experience.

Only the latest note of the day is visible on the Kiez page. When somebody adds a new note, it becomes the new visible moment. Earlier notes are not deleted: they remain underneath as part of that day’s collective record.

At the end of the day, these individual notes are transformed into a shared **Chronicle**: an AI-generated prose entry narrated as **“I,” the neighborhood itself**.

The result is a changing present alongside an accumulating local memory.

## Why this matters

People can share the same street while experiencing it very differently.

A crowded canal might feel lively to one person and overwhelming to another. Rain might ruin somebody’s journey while bringing relief to somebody else. A visitor may notice something a resident stopped seeing years ago.

These small observations usually remain separate — particularly when the people sharing a place do not share a language.

Kiez Notes explores what happens when those fragments are allowed to coexist and gradually form a shared narrative.

**People don’t need to share a language to share a place.**

## How it works

Visitors find a Kiez through the map or search and open its shared page. Anyone can read. To contribute, a person provides a nickname and confirms that they are currently in the area.

Notes can be typed or spoken. Spoken contributions are transcribed in the original language, shown for review, and only then published. Every new note becomes the visible note for that Kiez, while earlier notes remain stored for the day’s Chronicle.

There are no profiles, followers, likes or personal feeds. A day with no contributions simply shows **“Waiting.”**

## Shared memory, across languages

At the end of the day, OpenAI turns the collected notes into one grounded Chronicle narrated in the first person: **“I” is the Kiez.** The aim is not to force agreement, but to preserve different moods, observations and uncertainties within one shared account.

Google Gemini supports speech transcription, language detection, translation and text-to-speech. Original contributions remain in their source language, while current notes and archived Chronicles can be translated or read aloud in English, German, Turkish, Arabic or Spanish.

Voice features are currently optimized for **Google Chrome**; text-based interaction remains available everywhere.

## Hackathon prototype

The prototype supports a **small curated set of neighborhoods** and includes **synthetic seed contributions and Chronicles** so the experience can be explored immediately.

Hackathon participants in **Hamburg HafenCity** can also add real notes during the event. Their contributions can then become part of a shared end-of-day Chronicle — creating a small collective memory of the hackathon itself.

## Built with

**Next.js · TypeScript · Tailwind CSS · Leaflet · OpenStreetMap · Supabase PostgreSQL · Vercel · Google Gemini · OpenAI**

The Leaflet implementation was informed by the open-source [Clash project](https://github.com/pawsaw/clash/tree/main), used as a technical reference for integrating Leaflet into a Next.js application.

The prototype is deliberately narrow: a handful of Kieze, lightweight location verification, synthetic demo history and Chrome-focused voice functionality.

**The goal is simple: let a place collect fragments of everyday life and, over time, tell its own story.**
