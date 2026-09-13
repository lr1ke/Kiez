import { test,expect } from '@playwright/test';
// Avoid requesting OSM tiles from an automated browser; polygons and previews still exercise Leaflet.
test.beforeEach(async({page})=>{await page.route('**/tile.openstreetmap.org/**',route=>route.fulfill({status:200,contentType:'image/png',body:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')}));});
test('map discovery, archive and missing Google errors remain usable',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Every place has a diary.'})).toBeVisible();
 await expect(page.locator('.leaflet-container')).toBeVisible();await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
 await page.getByRole('button',{name:/Reuterkiez/}).click();await expect(page.locator('.map-preview h3')).toHaveText('Reuterkiez');
 await page.getByRole('link',{name:'Open diary',exact:true}).click();await expect(page.getByRole('heading',{name:'Reuterkiez.'})).toBeVisible();
 await page.getByRole('link',{name:'Open the archive'}).click();await page.locator('.archive-list > a').first().click();await expect(page.locator('.chronicle-prose')).not.toBeEmpty();
 await page.getByRole('button',{name:'Listen',exact:true}).click();await expect(page.locator('.listen-block [role=alert]')).toContainText('not connected');
});
test('location-gated publication keeps both entries, retries are idempotent, removal is protected',async({page,context})=>{
 await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:52.4917,longitude:13.415,accuracy:10});
 await page.goto('/kiez/graefekiez');await page.getByRole('button',{name:/Add to the diary/}).click();await expect(page.getByRole('button',{name:'Publish my moment'})).toBeDisabled();await page.getByRole('button',{name:'Check location'}).click();await expect(page.getByText('You’re writing in')).toBeVisible();await page.getByLabel('Your nickname').fill('Test visitor');await page.getByLabel('Your moment',{exact:true}).fill('A bicycle bell and a quiet afternoon.');await page.getByLabel('Source language',{exact:true}).selectOption('en');await page.getByRole('button',{name:'Publish my moment'}).click();await expect(page.locator('.entry-text')).toHaveText('A bicycle bell and a quiet afternoon.');
 const result=await page.evaluate(async()=>{const location=await (await fetch('/api/location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({latitude:52.4917,longitude:13.415,accuracy:10})})).json();const payload={nickname:'Test visitor',body:'Second moment, same place.',language:'en',inputMode:'text',locationToken:location.token,idempotencyKey:crypto.randomUUID()};const post=()=>fetch('/api/contributions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}).then(r=>r.json());return [await post(),await post()];});expect(result[0].id).toBe(result[1].id);
 await page.reload();await expect(page.locator('.entry-text')).toHaveText('Second moment, same place.');
 const response=await page.request.post('/api/admin/remove',{data:{id:result[0].id}});expect(response.status()).toBe(401);
});
test('mobile pages fit without horizontal overflow and composer is keyboard accessible',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
 await page.goto('/kiez/graefekiez');await page.getByRole('button',{name:/Add to the diary/}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
