import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve,extname } from 'node:path';
const root=resolve(import.meta.dirname,'..');let breakImage=true;
const server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(!pathname.startsWith('/deck/'))throw Error();
 if(breakImage&&pathname.endsWith('/the-world.jpg')){res.statusCode=503;res.end('Unavailable');return;}
 const rel=pathname.slice('/deck/'.length)||'index.html';const path=resolve(root,rel);if(!path.startsWith(root+'/'))throw Error();
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.webmanifest':'application/manifest+json'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/deck/`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const ctx=await browser.newContext({viewport:{width:390,height:844}});const page=await ctx.newPage();page.setDefaultTimeout(30000);await page.goto(url);
 await page.locator('#offlineSave').click();await page.getByRole('button',{name:'Try offline download again'}).waitFor();assert(!await page.locator('#offlineStatus').innerText().then(t=>t.startsWith('All 78')),'Incomplete download must not say ready');
 breakImage=false;await page.locator('#offlineSave').click();await page.getByRole('button',{name:'✓ Saved for offline study'}).waitFor({timeout:60000});
 const keys=await page.evaluate(()=>caches.keys());assert.equal(keys.filter(k=>k.startsWith('ink-intuition-offline-')).length,1);
 const count=await page.evaluate(async()=>{const c=await caches.open((await caches.keys()).find(k=>k.startsWith('ink-intuition-offline-')));return(await c.keys()).filter(k=>k.url.includes('/assets/cards/')).length});assert.equal(count,78);
 await page.locator('nav [data-nav="study"]').click();await page.locator('#learn').click();await ctx.setOffline(true);
 // New page is a cold offline app navigation, not just an already loaded SPA.
 const cold=await ctx.newPage();await cold.goto(url);await cold.getByRole('button',{name:'✓ Saved for offline study'}).waitFor();assert.equal(await cold.locator('#learnedCount').innerText(),'1');
 await cold.locator('nav [data-nav="library"]').click();assert.equal(await cold.locator('#cards .tile').count(),78);
 const loaded=await cold.evaluate(()=>Promise.all(deck.map(c=>new Promise(r=>{const i=new Image();i.onload=()=>r(i.naturalWidth===720);i.onerror=()=>r(false);i.src='assets/cards/'+c.file}))));assert(loaded.every(Boolean),'All 78 images must load with networking disabled');
 await cold.locator('.tile').first().click();await cold.locator('#flip').click();assert(await cold.locator('#studyMeaning').isVisible());
 await cold.locator('nav [data-nav="quiz"]').click();const answer=await cold.evaluate(()=>quizQuestion.name);await cold.locator('#choices').getByRole('button',{name:answer,exact:true}).click();assert.match(await cold.locator('#feedback').innerText(),/^Correct/);
 await cold.locator('nav [data-nav="lessons"]').click();await cold.locator('#lessonFlip').click();await cold.locator('#lessonLearn').click();await cold.reload();assert.equal(await cold.evaluate(()=>state.correct),1);assert.equal(await cold.evaluate(()=>state.lessons.length),1);
 const manifest=await cold.evaluate(async()=>await(await fetch('manifest.webmanifest')).json());assert.equal(manifest.display,'standalone');
 const rider=await ctx.newPage();await rider.goto(url+'rider/');await rider.getByRole('button',{name:'Major Arcana',exact:true}).waitFor();
 const riderImages=await rider.evaluate(()=>Promise.all(state.cards.map(c=>new Promise(r=>{const div=document.createElement('div');div.innerHTML=tarotImage(c);const img=div.firstChild;img.onload=()=>r(true);img.onerror=()=>r(false);img.loading='eager';document.body.appendChild(div)}))));assert.equal(riderImages.length,78);assert(riderImages.every(Boolean),'All Rider images must load offline');
 await rider.close();await cold.close();await ctx.close();console.log('PASS: failed-download recovery; complete 78-card cache; cold launch with network disabled; every card image; flips, quizzes, lessons, progress persistence; manifest; subdirectory hosting.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
