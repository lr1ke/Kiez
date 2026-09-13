import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { diaryDate,shiftDate } from '../lib/dates';
import { neighborhoods,pointInPolygon,resolveLocation } from '../lib/neighborhoods';
import { makeFixtures } from '../lib/fixtures';
import { seed,type Database } from '../lib/db';
import { pcmToWav } from '../lib/ai';

test('Berlin day boundaries handle winter, summer and daylight-saving changes',()=>{
 assert.equal(diaryDate(new Date('2026-01-01T23:00:00Z')),'2026-01-02');
 assert.equal(diaryDate(new Date('2026-07-01T21:59:59Z')),'2026-07-01');
 assert.equal(diaryDate(new Date('2026-07-01T22:00:00Z')),'2026-07-02');
 assert.equal(diaryDate(new Date('2026-03-28T23:00:00Z')),'2026-03-29');
 assert.equal(diaryDate(new Date('2026-03-29T22:00:00Z')),'2026-03-30');
 assert.equal(diaryDate(new Date('2026-10-25T22:59:59Z')),'2026-10-25');
 assert.equal(diaryDate(new Date('2026-10-25T23:00:00Z')),'2026-10-26');
 assert.equal(shiftDate('2026-01-01',-1),'2025-12-31');
});
test('map areas and presence checks agree and reject uncertain or outside positions',()=>{
 for(const n of neighborhoods){const [lat,lng]=n.center;assert.equal(resolveLocation(lat,lng,10).status,'resolved');assert.equal(neighborhoods.filter(k=>pointInPolygon(lng,lat,k.geometry.coordinates[0])).length,1);assert.equal(resolveLocation(lat,lng,1000).status,'uncertain');}
 assert.equal(resolveLocation(48.85,2.35,10).status,'outside');
 const [lng,lat]=neighborhoods[0].geometry.coordinates[0][0];assert.notEqual(resolveLocation(lat+.00001,lng+.00001,100).status,'resolved');
});
test('demo fixtures contain 4 Kieze, 4 archived days, 8 distinct voices per day in 5 languages',()=>{
 const groups=makeFixtures('2026-09-12');assert.equal(groups.length,20);assert.equal(groups.filter(g=>g.chronicle).length,16);
 for(const g of groups){assert.equal(g.entries.length,8);assert.equal(new Set(g.entries.map(e=>e.body)).size,8);assert.deepEqual(new Set(g.entries.map(e=>e.language)),new Set(['de','tr','en','ar','es']));for(const e of g.entries)assert.equal(diaryDate(new Date(e.created_at)),e.diary_date);}
 assert.ok(groups.filter(g=>!g.chronicle).every(g=>g.entries.every(e=>Date.parse(e.created_at)<Date.parse('2026-09-12T00:00:00Z'))));
});
test('database retains concurrent entries, seeds idempotently, and atomically claims one Chronicle',async()=>{
 const database=new PGlite();await database.exec(await readFile('migrations/001_initial.sql','utf8'));
 for(const n of neighborhoods)await database.query('INSERT INTO neighborhoods VALUES($1,$2,$3,$4,$5)',[n.id,n.name,JSON.stringify(n.aliases),JSON.stringify(n.geometry),'test']);
 await seed(database as Database,'2026-09-12');await seed(database as Database,'2026-09-12');
 assert.equal((await database.query<{count:number}>('SELECT count(*)::int AS count FROM contributions')).rows[0].count,160);
 assert.equal((await database.query<{count:number}>('SELECT count(*)::int AS count FROM chronicles')).rows[0].count,16);
 const insert=(id:string,key:string)=>database.query("INSERT INTO contributions(id,neighborhood_id,nickname,body,language,input_mode,diary_date,idempotency_key,created_at) VALUES($1,'graefekiez','Test','A moment','en','text','2026-09-12',$2,'2026-09-12T12:00:00Z') ON CONFLICT(idempotency_key) DO NOTHING",[id,key]);
 await Promise.all([insert('live-a','a'),insert('live-b','b'),insert('retry-b','b')]);
 const live=(await database.query<{id:string}>("SELECT id FROM contributions WHERE demo_dataset IS NULL ORDER BY created_at DESC,id DESC")).rows;assert.deepEqual(live.map(e=>e.id),['live-b','live-a']);
 assert.equal((await database.query("SELECT id FROM contributions WHERE diary_date='2026-09-13'")).rows.length,0);
 await database.query("INSERT INTO chronicles(id,neighborhood_id,diary_date) VALUES('claim','graefekiez','2026-09-12')");
 const claim=(token:string)=>database.query("UPDATE chronicles SET status='generating',claim_token=$1 WHERE id='claim' AND status='pending' RETURNING id",[token]);
 const claims=await Promise.all([claim('one'),claim('two')]);assert.equal(claims.reduce((n,c)=>n+c.rows.length,0),1);
 await database.query("UPDATE contributions SET visibility='removed' WHERE id='live-b'");
 assert.equal((await database.query<{id:string}>("SELECT id FROM contributions WHERE demo_dataset IS NULL AND visibility='visible' ORDER BY created_at DESC,id DESC LIMIT 1")).rows[0].id,'live-a');
 await database.close();
});
test('Google PCM is wrapped in a playable mono WAV header',()=>{const audio=pcmToWav(Buffer.from([1,2,3,4]));assert.equal(audio.toString('ascii',0,4),'RIFF');assert.equal(audio.toString('ascii',8,12),'WAVE');assert.equal(audio.readUInt32LE(24),24000);assert.equal(audio.readUInt32LE(40),4);assert.equal(audio.length,48);});

test('Hamburg presentation venue resolves with realistic accuracy, outside area stays blocked', () => {
 const venue = resolveLocation(53.54057, 9.99437, 100);
 assert.equal(venue.status, 'resolved');
 if (venue.status === 'resolved') assert.equal(venue.neighborhood.id, 'hafencity');
 assert.equal(resolveLocation(53.54057, 9.99437, 300).status, 'uncertain');
 assert.equal(resolveLocation(53.55, 9.99437, 10).status, 'outside');
 assert.ok(neighborhoods.find(n => n.id === 'hafencity')?.aliases.includes('20457'));
});
