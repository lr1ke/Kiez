import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { neighborhoods, boundaryVersion } from './neighborhoods';
import { makeFixtures } from './fixtures';
import { diaryDate } from './dates';
type Result<T> = {rows:T[]};
export interface Database { query<T = Record<string,unknown>>(sql:string,params?:unknown[]):Promise<Result<T>>; }
const globalDb = globalThis as unknown as { kiezDb?:Promise<Database> };
export function db() { return globalDb.kiezDb ??= connect().catch(error=>{globalDb.kiezDb=undefined;throw error;}); }
async function connect():Promise<Database> {
 let database:Database;
 if(process.env.DATABASE_URL) { const pool = new Pool({connectionString:process.env.DATABASE_URL,max:5}); database={query:async<T>(sql:string,params?:unknown[])=>{ const r=await pool.query(sql,params); return {rows:r.rows as T[]}; }}; }
 else {
  if(process.env.VERCEL) throw new Error('Set DATABASE_URL for a serverless deployment.');
  const dataPath = process.env.LOCAL_DATABASE_PATH || path.join(process.cwd(),'.data/kiez');
  await mkdir(path.dirname(dataPath), { recursive: true });
  const local = new PGlite(dataPath);
  database={query:async<T>(sql:string,params?:unknown[])=>local.query<T>(sql,params)};
 }
 // Hosted schema/demo setup is run explicitly with the seed CLI before deployment.
 // A serverless cold start should only connect, not repeat hundreds of seed writes.
 if(process.env.VERCEL) return database;
 const migration=await readFile(path.join(process.cwd(),'migrations/001_initial.sql'),'utf8');
 for(const statement of migration.split(';').map(s=>s.trim()).filter(Boolean)) await database.query(statement);
 for(const n of neighborhoods) await database.query('INSERT INTO neighborhoods(id,name,aliases,geometry,boundary_version) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO UPDATE SET name=$2,aliases=$3,geometry=$4,boundary_version=$5',[n.id,n.name,JSON.stringify(n.aliases),JSON.stringify(n.geometry),boundaryVersion]);
 if(process.env.DEMO_DATA!=='false') {
  const existing=await database.query<{value:string}>("SELECT value FROM settings WHERE key='demo-anchor'");
  const anchor=existing.rows[0]?.value || process.env.DEMO_ANCHOR_DATE || diaryDate();
  if(!existing.rows.length) await seed(database,anchor);
 }
 return database;
}
export async function seed(database:Database,anchor:string) {
 if(!/^\d{4}-\d{2}-\d{2}$/.test(anchor) || Number.isNaN(Date.parse(anchor))) throw new Error('Invalid demo anchor date');
 for(const group of makeFixtures(anchor)) {
  for(const e of group.entries) await database.query(`INSERT INTO contributions(id,neighborhood_id,nickname,body,language,input_mode,created_at,diary_date,idempotency_key,demo_dataset) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$1,$9) ON CONFLICT DO NOTHING`,[e.id,e.neighborhood_id,e.nickname,e.body,e.language,e.input_mode,e.created_at,e.diary_date,e.demo_dataset]);
  const c=group.chronicle;
  if(c) await database.query(`INSERT INTO chronicles(id,neighborhood_id,diary_date,title,body,source_ids,contribution_count,status,coverage,model,prompt_version,generated_at,published_at,demo_dataset) VALUES($1,$2,$3,$4,$5,$6,8,'published',$7,'editorial-fixture','fixture-v1',now(),now(),$8) ON CONFLICT DO NOTHING`,[c.id,c.neighborhood_id,c.diary_date,c.title,c.body,JSON.stringify(c.source_ids),JSON.stringify(c.coverage),c.demo_dataset]);
 }
 await database.query("INSERT INTO settings(key,value) VALUES('demo-anchor',$1) ON CONFLICT(key) DO UPDATE SET value=$1",[anchor]);
}
