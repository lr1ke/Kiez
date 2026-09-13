import { loadEnvConfig } from '@next/env';
import { db, seed } from '../lib/db';
import { diaryDate } from '../lib/dates';
async function main() {
 loadEnvConfig(process.cwd());
 const database=await db(); const anchor=process.argv.slice(2).find(arg=>!arg.startsWith('--'))||diaryDate();
 if(process.argv.includes('--reset-demo')) {
  await database.query("DELETE FROM chronicles WHERE demo_dataset IS NOT NULL");
  await database.query("DELETE FROM reports WHERE contribution_id IN (SELECT id FROM contributions WHERE demo_dataset IS NOT NULL)");
  await database.query("DELETE FROM contributions WHERE demo_dataset IS NOT NULL");
 }
 await seed(database,anchor); console.log(`Demo seeded at ${anchor}: 4 Kieze, 160 contributions, 16 historical Chronicles. Real submissions preserved.`);
 process.exit(0);
}
main().catch(()=>{console.error('Seed failed. Check the database configuration and anchor date.');process.exit(1);});
