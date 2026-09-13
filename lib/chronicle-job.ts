import { randomUUID } from 'node:crypto';
import { db } from './db';
import { diaryDate } from './dates';
import { createChronicle } from './ai';
import { chronicleModel } from './openai';
import type { Contribution } from './types';
export async function runChronicles() {
 const d=await db();
 await d.query(`INSERT INTO chronicles(id,neighborhood_id,diary_date) SELECT neighborhood_id||':'||diary_date,neighborhood_id,diary_date FROM contributions WHERE diary_date<$1 AND visibility='visible' GROUP BY neighborhood_id,diary_date ON CONFLICT DO NOTHING`,[diaryDate()]);
 const candidates=(await d.query<{id:string}>(`SELECT id FROM chronicles WHERE status IN ('pending','failed') OR (status='generating' AND claimed_at<now()-interval '10 minutes') ORDER BY diary_date LIMIT 1`)).rows;
 let published=0,failed=0;
 for(const {id} of candidates) {
  const token=randomUUID(); const claim=(await d.query<{neighborhood_id:string;diary_date:string}>(`UPDATE chronicles SET status='generating',claim_token=$2,claimed_at=now() WHERE id=$1 AND (status IN ('pending','failed') OR (status='generating' AND claimed_at<now()-interval '10 minutes')) RETURNING neighborhood_id,diary_date`,[id,token])).rows[0];
  if(!claim) continue;
  const entries=(await d.query<Contribution>("SELECT * FROM contributions WHERE neighborhood_id=$1 AND diary_date=$2 AND visibility='visible' ORDER BY created_at,id",[claim.neighborhood_id,claim.diary_date])).rows;
  if(!entries.length) {await d.query('DELETE FROM chronicles WHERE id=$1 AND claim_token=$2',[id,token]);continue;}
  try {
   let draft; for(let attempt=0;attempt<2;attempt++){try{draft=await createChronicle(entries);break;}catch(error){if(attempt===1)throw error;}}
   if(!draft) throw new Error('No draft');
   // Publication checks that no source was removed while generation ran.
   const result=await d.query(`UPDATE chronicles SET body=$3,title=$4,coverage=$5,source_ids=$6,contribution_count=$7,model=$8,prompt_version='chronicle-v1',status='published',generated_at=now(),published_at=now(),last_error=NULL WHERE id=$1 AND claim_token=$2 AND status='generating' AND NOT EXISTS(SELECT 1 FROM contributions WHERE id IN (SELECT jsonb_array_elements_text($6::jsonb)) AND visibility<>'visible') RETURNING id`,[id,token,draft.body,draft.title,JSON.stringify(draft.coverage),JSON.stringify(entries.map(e=>e.id)),entries.length,chronicleModel()]);
   if(!result.rows.length) throw new Error('Source changed');published++;
  }catch {await d.query("UPDATE chronicles SET status='failed',last_error='Generation or source review failed; retry available.' WHERE id=$1 AND claim_token=$2 AND status='generating'",[id,token]);failed++;}
 }
 await d.query('DELETE FROM rate_limits WHERE expires_at<now()');
 return {published,failed,attempted:candidates.length};
}
