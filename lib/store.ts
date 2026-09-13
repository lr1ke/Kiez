import { db } from './db';
import { diaryDate } from './dates';
import { neighborhoods } from './neighborhoods';
import type { Chronicle, Contribution, KiezSummary } from './types';
// Normalize pg Date values and embedded PostgreSQL string values for server/client boundaries.
const plain = <T>(value:T):T => JSON.parse(JSON.stringify(value));
export async function latest(id:string,date=diaryDate()) { const d=await db(); return plain((await d.query<Contribution>("SELECT id,neighborhood_id,nickname,body,language,input_mode,created_at,diary_date,demo_dataset FROM contributions WHERE neighborhood_id=$1 AND diary_date=$2 AND visibility='visible' ORDER BY created_at DESC,id DESC LIMIT 1",[id,date])).rows[0]??null); }
export async function archive(id:string) { const d=await db(); return plain((await d.query<Chronicle>('SELECT id,neighborhood_id,diary_date,title,body,language,source_ids,contribution_count,status,demo_dataset FROM chronicles WHERE neighborhood_id=$1 ORDER BY diary_date DESC',[id])).rows).map(c=>c.status==='published'?c:{...c,body:'',title:'',source_ids:[]}); }
export async function summaries():Promise<KiezSummary[]> {
 const d=await db(); return Promise.all(neighborhoods.map(async neighborhood=>({ neighborhood,latest:await latest(neighborhood.id),count:Number((await d.query<{count:string}>("SELECT count(*) FROM contributions WHERE neighborhood_id=$1 AND diary_date=$2 AND visibility='visible'",[neighborhood.id,diaryDate()])).rows[0].count),archiveCount:Number((await d.query<{count:string}>("SELECT count(*) FROM chronicles WHERE neighborhood_id=$1 AND status='published'",[neighborhood.id])).rows[0].count) })));
}
export async function readable(kind:'contribution'|'chronicle',id:string) {
 const d=await db();
 if(kind==='contribution') {
  const row=(await d.query<Contribution>("SELECT * FROM contributions WHERE id=$1 AND visibility='visible'",[id])).rows[0];
  if(!row || (await latest(row.neighborhood_id))?.id!==id) return null;
  return {body:row.body,language:row.language};
 }
 const row=(await d.query<Chronicle>("SELECT * FROM chronicles WHERE id=$1 AND status='published'",[id])).rows[0];
 return row?{body:row.body,language:row.language}:null;
}
