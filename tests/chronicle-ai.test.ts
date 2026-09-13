import test from 'node:test';
import assert from 'node:assert/strict';
import { createChronicle } from '../lib/ai';
import { generateChronicleJSON } from '../lib/openai';
import { makeFixtures } from '../lib/fixtures';

test('Chronicle uses OpenAI for all three stages and retains source coverage and review gates', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-only';
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey; });
  const entries = makeFixtures('2026-09-12')[0].entries;
  const draft = { title: 'Rain and noise', body: 'I held both relief and frustration in my streets.', coverage: Object.fromEntries(entries.map(e => [e.id, e.body])) };
  const review = { grounded: true, allSourcesRepresented: true, firstPersonNeighborhood: true, conflictingMoodsPreserved: true };
  const requests: Array<{ instructions: string; input: string }> = [];
  let outputs: unknown[] = [];
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(url, 'https://api.openai.com/v1/responses');
    const body = JSON.parse(String(init.body));
    assert.equal(body.store, false);
    if (body.instructions.startsWith('Independently review')) {
      assert.equal(body.text.format.type, 'json_schema');
      assert.equal(body.text.format.strict, true);
    } else assert.deepEqual(body.text, { format: { type: 'json_object' } });
    assert.ok(body.input.startsWith('JSON source data:\n'));
    requests.push({ ...body, input: body.input.slice('JSON source data:\n'.length) });
    return Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(outputs.shift()) }] }] });
  });
  outputs = [{ moments: [] }, draft, review];
  assert.deepEqual(await createChronicle(entries), draft);
  assert.equal(requests.length, 3);
  assert.match(requests[0].instructions, /^Extract every distinct observation/);
  assert.match(requests[1].instructions, /^Write one coherent English/);
  assert.match(requests[2].instructions, /^Independently review/);
  assert.equal(JSON.parse(requests[0].input).length, entries.length);
  assert.deepEqual(JSON.parse(requests[2].input).draft, draft);
  outputs = [{ moments: [] }, { ...draft, coverage: {} }];
  await assert.rejects(createChronicle(entries), /Coverage check failed/);
  outputs = [{ moments: [] }, draft, { ...review, grounded: false }];
  await assert.rejects(createChronicle(entries), /Narrative review failed/);
});

test('OpenAI missing credentials, HTTP failures, incomplete output and refusals fail explicitly', async (t) => {
  const previousKey = process.env.OPENAI_API_KEY;
  t.after(() => { if (previousKey === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = previousKey; });
  delete process.env.OPENAI_API_KEY;
  await assert.rejects(generateChronicleJSON({}, 'Return JSON.'), /not connected/);
  process.env.OPENAI_API_KEY = 'test-only';
  let response = new Response('', { status: 429 });
  t.mock.method(globalThis, 'fetch', async () => response);
  await assert.rejects(generateChronicleJSON({}, 'Return JSON.'), /could not generate/);
  response = Response.json({ status: 'incomplete' });
  await assert.rejects(generateChronicleJSON({}, 'Return JSON.'), /did not complete/);
  response = Response.json({ status: 'completed', output: [{ type: 'message', content: [{ type: 'refusal' }] }] });
  await assert.rejects(generateChronicleJSON({}, 'Return JSON.'), /declined/);
});
