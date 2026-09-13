import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,use:{baseURL:'http://localhost:3000',headless:true,launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined)},screenshot:'only-on-failure'},webServer:{command:'npm run dev',url:'http://localhost:3000',reuseExistingServer:true,timeout:120000}});
