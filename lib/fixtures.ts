import { neighborhoods } from './neighborhoods';
import { shiftDate } from './dates';
import type { SourceLanguage } from './types';
// Original fictional material. Each day has eight distinct voices in five languages.
const days: { title: string; entries: [SourceLanguage,string][]; story: string }[] = [
 { title: 'A little room for everyone', entries: [
 ['de','Seit sieben wird nebenan gebohrt. Ich wollte heute einfach nur in Ruhe frühstücken.'],
 ['tr','Fırından sıcak ekmek aldım. Eve varmadan ucundan bir parça koparıp yedim.'],
 ['en','Visiting for the first time. People were sitting along the canal with their feet dangling. I stayed a while.'],
 ['ar','التقيت بصديقتي عند الزاوية. لم نلتق منذ شهر، وبقينا نتحدث طويلاً.'],
 ['es','La lluvia me pilló sin paraguas. Llegué a casa con los zapatos empapados.'],
 ['de','Mein Hund hat sich mitten im Park hingelegt und wollte nicht mehr nach Hause. Ich musste lachen.'],
 ['tr','Yağmur başlayınca hava serinledi. Açık pencerenin yanında rahat bir nefes aldım.'],
 ['en','The construction is loud, but I am glad the broken pavement is finally being repaired.']],
 story:'I woke to drilling that made a quiet breakfast impossible. I was tired of the noise, and I was also glad to see broken pavement being repaired. Neither feeling cancelled the other. I carried warm bread home, a piece already torn from its end. Along my canal, I lingered with a first-time visitor watching feet dangle over the water. At a corner, I caught up with a friend after a month apart. Rain soaked my shoes on the way home; beside an open window, that same rain brought cooler air and relief. In the park, I laughed at a dog who had decided the walk was not over.' },
 { title:'The space between the noise', entries:[
 ['de','Der Lieferwagen stand schon wieder auf dem Radweg. Ich musste mit dem Rad auf die Straße ausweichen.'],
 ['tr','Komşum fazla yaptığı mercimek çorbasını kapıma getirdi. Akşam yemeğim hazır oldu.'],
 ['en','A saxophone player was practising the same phrase by an open window. I liked hearing it get better.'],
 ['ar','كنت أريد النوم بعد العمل، لكن صوت الموسيقى من النافذة أبقاني مستيقظاً.'],
 ['es','Encontré un libro de cocina en una caja de cosas gratis. Tiene notas a lápiz en los márgenes.'],
 ['de','An der Kasse hat mich jemand vorgelassen, weil ich nur eine Zitrone hatte.'],
 ['tr','Otobüsü kaçırdım. Durakta beklerken annemi aradım.'],
 ['en','The square was full of people tonight. I wanted a quieter place and went home.']],
 story:'I swerved around a delivery van blocking my cycle lane, frustrated to be pushed into the road. At a doorway I received a neighbour’s spare lentil soup, and dinner was suddenly taken care of. A saxophone phrase repeated through an open window: I enjoyed hearing it improve, yet I also lay awake after work wishing the music would stop. I found a cookbook in a giveaway box, its margins filled with pencil notes. At the checkout, someone let me go ahead with my single lemon. A missed bus left time to call my mother. My square was full of people tonight; I wanted quiet, and went home.' },
 { title:'Things that take their time', entries:[
 ['de','Die Schlange beim Bäcker war lang. Für zwei Brötchen war mir das heute zu viel.'],
 ['tr','Fırının önünde beklerken eski komşumla karşılaştım. Sohbet etmek iyi geldi.'],
 ['en','Someone was teaching a child to ride a bike. I saw three wobbly metres without a helping hand.'],
 ['ar','اشتريت نعناعاً من السوق. رائحته بقيت في حقيبتي طوال الطريق.'],
 ['es','Me senté en el parque con un café. El viento me lo tiró sobre los pantalones.'],
 ['de','Endlich Wind! Meine Wohnung hat sich nach den warmen Tagen etwas abgekühlt.'],
 ['tr','Kanal kenarı çok kalabalıktı. Kitabımı okuyacak sessiz bir yer bulamadım.'],
 ['en','I loved the bustle by the canal. I ate my sandwich there and listened to all the different conversations.']],
 story:'I had little patience for a long bakery queue when all I wanted was two rolls. But waiting outside also gave me a welcome conversation with a former neighbour. I watched a child ride three wobbly metres without a helping hand. Fresh mint from the market scented my bag on the journey home. In the park, wind spilled coffee over my trousers; at home, moving air finally cooled the rooms after warm days. Along the canal I could not find the quiet I needed for my book. I also enjoyed its bustle, eating a sandwich among conversations in different voices. I held both the wish for silence and the pleasure of company.' },
 { title:'Small gestures, long evening', entries:[
 ['de','Ich habe meine Schlüssel gesucht. Sie lagen die ganze Zeit unten in der Einkaufstasche.'],
 ['tr','Manav kapanmak üzereydi ama bana son bir demet maydanoz sattı.'],
 ['en','I spent the afternoon alone on a bench. Today the quiet felt lonely.'],
 ['ar','جلست وحدي على مقعد لبعض الوقت. كنت أحتاج إلى هذا الهدوء بعد يوم مزدحم.'],
 ['es','Un vecino me ayudó a subir la bici por la escalera. No sabía su nombre.'],
 ['de','Auf dem Heimweg roch es aus einem Fenster nach gebratenen Zwiebeln. Ich bekam Hunger.'],
 ['tr','Sokaktaki kahkahalar gece geç saate kadar sürdü. Uyumakta zorlandım.'],
 ['en','I laughed with friends outside this evening. It had been a difficult week, and I needed that.']],
 story:'I searched for keys that had been at the bottom of my shopping bag all along. Just before the greengrocer closed, I bought one last bunch of parsley. I sat alone on a bench and felt lonely; in another quiet pause, being alone was exactly what I needed after a busy day. A neighbour whose name I did not know helped carry my bicycle upstairs. The smell of frying onions from a window made me hungry on the way home. Laughter outside brought relief after a difficult week, and it also kept me awake late into the night. The comfort of company and the need for sleep shared my streets without becoming the same feeling.' },
 { title:'A morning that kept unfolding', entries:[
 ['de','Die Baustelle hat mich früh geweckt. Ich habe meinen Kaffee ziemlich müde getrunken.'],
 ['tr','Bugün fırındaki görevli her zamanki ekmeğimi ben söylemeden uzattı. Tanınmak hoşuma gitti.'],
 ['en','A visitor asked me the way to the canal. We unfolded an enormous paper map together.'],
 ['ar','قابلت صديقي بعد العمل. اشترينا الشاي وجلسنا نتحدث عن يومنا.'],
 ['es','Empezó a llover justo cuando tendí la ropa fuera. Tuve que recogerla corriendo.'],
 ['de','Der Hund vor mir wollte unbedingt im Park bleiben. Seine Besitzerin hat sich schließlich zu ihm gesetzt.'],
 ['tr','Yağmur bitkilerime iyi geldi. Bu akşam sulamam gerekmeyecek.'],
 ['en','The pavement repairs are inconvenient, but that uneven patch really did need fixing.']],
 story:'I drank my coffee tired after an early start from the building work. The pavement repairs were inconvenient, but I knew the uneven patch needed attention. At the bakery I was handed my usual bread before asking, glad to be recognised. I unfolded an enormous paper map with a visitor looking for the canal. After work I bought tea with a friend and talked about the day. When rain arrived, I rushed to bring the washing inside; it also watered my plants and spared me an evening task. In the park a dog insisted on staying, and its owner eventually sat down beside it.' }
];
const names = ['Leni','Deniz','Sam','نور','Lucía','Mika','Ece','Alex'];
export function makeFixtures(anchor: string) {
 return neighborhoods.flatMap((n, ni) => Array.from({length:5},(_,offset) => {
  const day = days[(offset+ni)%days.length], date = shiftDate(anchor,-offset);
  const entries = day.entries.map(([language,body],i) => ({ id:`demo-v1-${anchor}-${n.id}-${offset}-${i}`, neighborhood_id:n.id, nickname:names[(i+ni)%names.length], body, language, input_mode:'text' as const,
   // Current-day fixtures occupy the first seconds of the Berlin day, so live posts always supersede them.
   created_at: offset===0 ? berlinMidnight(date,i+1) : `${date}T${String(7+i).padStart(2,'0')}:15:00Z`, diary_date:date, demo_dataset:`demo-v1-${anchor}` }));
  return { entries, chronicle: offset===0?null:{id:`demo-v1-${anchor}-${n.id}-${offset}`,neighborhood_id:n.id,diary_date:date,title:day.title,body:day.story,source_ids:entries.map(e=>e.id),coverage:Object.fromEntries(entries.map((e,i)=>[e.id,`Reviewed fixture detail ${i+1}; see source-language entry and canonical prose.`])),demo_dataset:`demo-v1-${anchor}`} };
 }));
}
function berlinMidnight(date: string, seconds: number) {
 const noon = new Date(`${date}T12:00:00Z`);
 const hour = Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',hour:'2-digit',hourCycle:'h23'}).format(noon));
 return new Date(Date.parse(`${date}T00:00:00Z`)-(hour-12)*3600000+seconds*1000).toISOString();
}
