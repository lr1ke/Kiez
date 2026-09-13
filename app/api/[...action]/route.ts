import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { db } from '@/lib/db';
import { diaryDate } from '@/lib/dates';
import { resolveLocation } from '@/lib/neighborhoods';
import { latest, summaries, readable } from '@/lib/store';
import { HttpError, authorize, sameOrigin, session, sign, verify, rateLimit } from '@/lib/security';
import { audioLanguages, aiAvailable, detectLanguage, translate, transcribe, speak } from '@/lib/ai';
import { runChronicles } from '@/lib/chronicle-job';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=300;
const lang=z.enum(['en','de','tr','ar','es']);
const contentSchema=z.object({kind:z.enum(['contribution','chronicle']),id:z.string().min(1).max(200),language:lang});
function json(value:unknown,status=200){return NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});}
async function body(request:Request) {const length=Number(request.headers.get('content-length')||0);if(length>32000)throw new HttpError(413,'Request too large.');const text=await request.text();if(text.length>32000)throw new HttpError(413,'Request too large.');return JSON.parse(text);}
async function handle(request:NextRequest,method:string) {
 try {
 const action=request.nextUrl.pathname.replace('/api/','');
 if(action==='cron' && (method==='GET'||method==='POST')){authorize(request,'CRON_SECRET');return json(await runChronicles());}
 if(method==='GET') {
  if(action==='neighborhoods') return json(await summaries());
  if(action==='latest') return json(await latest(request.nextUrl.searchParams.get('kiez')||''));
  if(action==='capabilities') return json({available:aiAvailable(),languages:audioLanguages()});
  if(action==='session'){const sid=await session(),d=await db();return json((await d.query('SELECT nickname FROM sessions WHERE id=$1',[sid])).rows[0]);}
  if(action==='admin/reports'){authorize(request,'ADMIN_SECRET');const d=await db();return json((await d.query('SELECT r.id,r.contribution_id,r.created_at,c.body,c.nickname,c.visibility FROM reports r JOIN contributions c ON c.id=r.contribution_id ORDER BY r.created_at DESC LIMIT 100')).rows);}
  throw new HttpError(404,'Not found.');
 }
 sameOrigin(request);
 if(action==='admin/remove'){
  authorize(request,'ADMIN_SECRET');const {id}=z.object({id:z.string()}).parse(await body(request));const d=await db();
  await d.query("UPDATE contributions SET visibility='removed' WHERE id=$1",[id]);
  await d.query("UPDATE chronicles SET status='review' WHERE source_ids @> $1::jsonb",[JSON.stringify([id])]);return json({ok:true});
 }
 const sid=await session(); await rateLimit(`requests:${sid}`,60);
 if(action==='location'){
  const input=z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),accuracy:z.number().positive().max(50000)}).parse(await body(request));
  const result=resolveLocation(input.latitude,input.longitude,input.accuracy);
  if(result.status==='outside')throw new HttpError(422,'You are outside the supported neighborhood areas. You can still explore every Kiez.');
  if(result.status==='uncertain')throw new HttpError(422,'Your location is too uncertain near a boundary. Move into the area and try again.');
  return json({neighborhood:result.neighborhood,token:sign({sid,kiez:result.neighborhood.id,exp:Date.now()+5*60000})});
 }
 if(action==='contributions'){
  const input=z.object({nickname:z.string().trim().min(1).max(32),body:z.string().trim().min(1).max(2000),language:z.enum(['en','de','tr','ar','es','mixed','und']),inputMode:z.enum(['text','voice']),locationToken:z.string(),idempotencyKey:z.string().uuid(),website:z.string().max(0).optional()}).parse(await body(request));
  const d=await db();const key=`${sid}:${input.idempotencyKey}`;
  const existing=(await d.query<{id:string;neighborhood_id:string}>('SELECT id,neighborhood_id FROM contributions WHERE idempotency_key=$1',[key])).rows[0];if(existing)return json(existing);
  const token=verify(input.locationToken);if(!token||token.sid!==sid||typeof token.kiez!=='string')throw new HttpError(403,'Please check your location again before publishing. Your draft is safe.');
  await rateLimit(`publish:${sid}`,4,60);
  if((input.body.match(/https?:\/\//g)||[]).length>3)throw new HttpError(422,'Please share a moment with fewer links.');
  const language=input.language==='und'&&aiAvailable()?await detectLanguage(input.body):input.language;
  const result=(await d.query<{id:string;neighborhood_id:string}>(`INSERT INTO contributions(id,neighborhood_id,nickname,body,language,input_mode,diary_date,session_id,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(idempotency_key) DO UPDATE SET idempotency_key=EXCLUDED.idempotency_key RETURNING id,neighborhood_id`,[randomUUID(),token.kiez,input.nickname,input.body,language,input.inputMode,diaryDate(),sid,key])).rows[0];
  await d.query('UPDATE sessions SET nickname=$2 WHERE id=$1',[sid,input.nickname]);return json(result,201);
 }
 if(action==='report'){
  await rateLimit(`reports:${sid}`,5);const {id}=z.object({id:z.string()}).parse(await body(request));if(!await readable('contribution',id))throw new HttpError(404,'That moment is no longer visible.');const d=await db();await d.query('INSERT INTO reports(id,contribution_id,session_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[randomUUID(),id,sid]);return json({ok:true});
 }
 if(action==='transcribe'){
  await rateLimit(`audio:${sid}`,6,60);await rateLimit('global:audio',60,60);
  if(Number(request.headers.get('content-length')||0)>4500000)throw new HttpError(413,'Recording is too large. Keep it under one minute.');
  const form=await request.formData();const file=form.get('audio'),duration=Number(form.get('duration'));
  if(!(file instanceof File)||file.size>4000000||file.size<1||!Number.isFinite(duration)||duration<=0||duration>61)throw new HttpError(422,'Use a recording up to one minute and 4 MB.');
  const mime=file.type.split(';')[0];if(!['audio/webm','audio/mp4','audio/ogg','audio/wav'].includes(mime))throw new HttpError(422,'This recording format is not supported. Try another browser or type your moment.');
  return json(await transcribe(Buffer.from(await file.arrayBuffer()),mime));
 }
 if(action==='translate'||action==='speech'){
  await rateLimit(`language:${sid}`,12,60);await rateLimit('global:language',120,60);
  const input=contentSchema.parse(await body(request));if(!audioLanguages().includes(input.language))throw new HttpError(422,'This language is not enabled yet.');
  const source=await readable(input.kind,input.id);if(!source)throw new HttpError(404,'This entry is no longer available.');
  const text=source.language===input.language?source.body:await translate(source.body,input.language);
  // Recheck visibility after a potentially slow provider request.
  if(!await readable(input.kind,input.id))throw new HttpError(404,'This entry is no longer available.');
  if(action==='translate')return json({text,language:input.language,translated:source.language!==input.language});
  const wav=await speak(text,input.language);
  if(!await readable(input.kind,input.id))throw new HttpError(404,'This entry is no longer available.');
  return json({text,language:input.language,translated:source.language!==input.language,audio:`data:audio/wav;base64,${wav.toString('base64')}`});
 }
 throw new HttpError(404,'Not found.');
 }catch(error){if(error instanceof HttpError)return json({error:error.message},error.status);if(error instanceof z.ZodError||error instanceof SyntaxError)return json({error:'Please check the submitted fields and try again.'},400);return json({error:'Something went wrong. Your saved contributions are safe. Please try again.'},500);}
}
export const GET=(request:NextRequest)=>handle(request,'GET');
export const POST=(request:NextRequest)=>handle(request,'POST');
