import { loadEnvConfig } from '@next/env';
import { mkdir, writeFile } from 'node:fs/promises';
import { translate, speak, transcribe } from '../lib/ai';

async function main() {
  loadEnvConfig(process.cwd());
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (!response.ok) {
      const body = await response.clone().json().catch(() => ({}));
      const message = String(body.error?.message || '').replaceAll(process.env.GEMINI_API_KEY || 'UNSET_KEY', '[redacted]');
      console.log(JSON.stringify({ http: response.status, message }));
    }
    return response;
  };
  const translated = await translate('The rain cooled my neighborhood, but my shoes got wet.', 'de');
  console.log('Translation:', translated);
  const wav = await speak(translated, 'de');
  await mkdir('.data', { recursive: true });
  await writeFile('.data/gemini-rehearsal-de.wav', wav);
  console.log('Speech generated:', wav.length, 'bytes');
  const transcript = await transcribe(wav, 'audio/wav');
  console.log('Transcription:', JSON.stringify(transcript));
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : 'Gemini rehearsal failed.');
  process.exitCode = 1;
});
