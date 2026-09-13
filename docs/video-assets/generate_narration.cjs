const fs=require('fs');
process.loadEnvFile('/Users/ulrike/Desktop/Kiez/.env.local');
const dir='/Users/ulrike/Desktop/Kiez/docs/video-assets';
const clips=JSON.parse(fs.readFileSync(dir+'/narration.json','utf8'));
async function render(c){const p=dir+'/'+c.file;if(fs.existsSync(p)){console.log('Already saved',c.id);return;}
 const r=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{'content-type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:'gpt-4o-mini-tts',voice:'coral',input:c.text,instructions:'Speak as a warm, clear female narrator presenting a thoughtful neighborhood project. Natural conversational delivery, gently enthusiastic, about 145 words per minute, with short pauses. Keep the same relaxed voice throughout. Pronounce Kiez as keets. Read the script exactly, without adding words.',response_format:'wav'}),signal:AbortSignal.timeout(90000)});
 if(!r.ok)throw new Error('Speech request HTTP '+r.status);fs.writeFileSync(p,Buffer.from(await r.arrayBuffer()));console.log('Saved clip',c.id);}
(async()=>{const subset=process.argv.includes('--sample')?clips.slice(0,1):clips;for(let i=0;i<subset.length;i+=2)await Promise.all(subset.slice(i,i+2).map(render));fs.writeFileSync(dir+'/voice-info.json',JSON.stringify({provider:'OpenAI',model:'gpt-4o-mini-tts',voice:'coral',synthetic:true},null,2));})().catch(e=>{console.error(e.message);process.exitCode=1;});
