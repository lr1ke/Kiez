import { HttpError } from './security';

export function chronicleModel() {
  return process.env.OPENAI_CHRONICLE_MODEL || 'gpt-4.1';
}

interface OpenAIResponse {
  status?: string;
  output?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string }>;
  }>;
}

// Each stage receives its original instruction and explicit source data independently.
export async function generateChronicleJSON(source: unknown, instruction: string, schema?: Record<string, unknown>): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new HttpError(503, 'OpenAI Chronicle generation is not connected yet.');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: chronicleModel(),
      instructions: instruction,
      input: `JSON source data:\n${JSON.stringify(source)}`,
      text: { format: schema ? { type: 'json_schema', name: 'chronicle_review', strict: true, schema } : { type: 'json_object' } },
      store: false,
    }),
    signal: AbortSignal.timeout(90000),
  });
  if (!response.ok) {
    // Report only the provider's status/code, never its raw response or credentials.
    const failure = await response.json().catch(() => null) as { error?: { code?: string } } | null;
    const code = failure?.error?.code;
    const safeCode = typeof code === 'string' && /^[a-z0-9_]{1,80}$/i.test(code) ? `, ${code}` : '';
    throw new HttpError(502, `OpenAI could not generate the Chronicle (HTTP ${response.status}${safeCode}). Please retry.`);
  }

  const data = await response.json() as OpenAIResponse;
  if (data.status !== 'completed') throw new HttpError(502, 'OpenAI Chronicle generation did not complete.');
  const content = (data.output || []).filter(item => item.type === 'message').flatMap(item => item.content || []);
  if (content.some(part => part.type === 'refusal')) throw new HttpError(502, 'OpenAI declined this Chronicle request.');
  const text = content.filter(part => part.type === 'output_text').map(part => part.text || '').join('').trim();
  if (!text) throw new HttpError(502, 'OpenAI returned no Chronicle text.');
  return text;
}
