import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const server=createServer(async(req,res)=>{
 try{const path=resolve(root,'.'+decodeURIComponent(req.url==='/'?'/index.html':req.url));if(!path.startsWith(root+'/'))throw Error('Invalid path');const body=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg'})[extname(path)]||'application/octet-stream');res.end(body)}catch{res.statusCode=404;res.end('Not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const results=[];
try{
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  await page.getByRole('button',{name:'The Deck',exact:true}).click();await page.locator('#cards .tile').last().waitFor();assert.equal(await page.locator('#cards .tile').count(),78);
  const loaded=await page.evaluate(async()=>{
   return await Promise.all(deck.map(c=>new Promise(r=>{const i=new Image();i.onload=()=>r({id:c.id,file:c.file,width:i.naturalWidth,height:i.naturalHeight});i.onerror=()=>r({id:c.id,error:true});i.src='assets/cards/'+c.file})))
  });
  assert(loaded.every(x=>!x.error&&x.width===720&&x.height===1200));
  const mapping=JSON.parse(await readFile(resolve(root,'docs/card-image-mapping.json'),'utf8')).cards;
  const deckMap=await page.evaluate(()=>deck.map(c=>({id:c.id,name:c.name,file:c.file})));
  for(const c of deckMap){const m=mapping.find(m=>m.id===c.id);assert.equal(c.file,m.file);assert.equal(c.name,m.name)}
  assert.equal(deckMap[8].name,'Justice');assert.equal(deckMap[11].name,'Strength');
  await page.locator('#search').fill('Page of Pentacles');assert.equal(await page.locator('#cards .tile').count(),1);await page.locator('#cards .tile').click();
  await page.locator('#study').waitFor({state:'visible'});assert.equal(await page.locator('#studyName').innerText(),'Knave of Coins');assert(await page.locator('#studyMeaning').isHidden());
  await page.locator('#flip').click();assert(await page.locator('#studyMeaning').isVisible());assert((await page.locator('#studyMeaning').innerText()).includes('Study'));assert(await page.locator('#cardFace img').isVisible());
  await page.locator('#learn').click();await page.reload();await page.getByRole('button',{name:'My Journey',exact:true}).click();assert.equal(await page.locator('#learnedCount').innerText(),'1');
  await page.getByRole('button',{name:'Study',exact:true}).click();const before=await page.locator('#studyName').innerText();await page.locator('#next').click();assert.notEqual(await page.locator('#studyName').innerText(),before);await page.locator('#random').click();
  await page.getByRole('button',{name:'Quiz',exact:true}).click();const correct=await page.evaluate(()=>quizQuestion.name);await page.locator('#choices').getByRole('button',{name:correct,exact:true}).click();assert.match(await page.locator('#feedback').innerText(),/^Correct/);assert.equal(await page.locator('#choices button:disabled').count(),4);
  assert.equal(await page.locator('#lessonTestOptions button:disabled').count(),0,'Quiz must not disable lesson-test controls');
  await page.reload();assert.equal(await page.evaluate(()=>state.correct),1);
  await page.getByRole('button',{name:'Lessons',exact:true}).click();await page.locator('#lessonFlip').click();assert.equal(await page.locator('#lessonFront').innerText(),await page.evaluate(()=>curriculum[lessonPosition].back));
  await page.locator('#lessonLearn').click();await page.locator('#lessonTopic').selectOption('numbers');assert.match(await page.locator('#lessonTitle').innerText(),/0/);await page.locator('#lessonNext').click();assert.match(await page.locator('#lessonTitle').innerText(),/1/);
  for(let i=0;i<5;i++){
   const correct=await page.evaluate(()=>lessonQuestion.back);await page.locator('#lessonTestOptions').getByRole('button',{name:correct,exact:true}).click();assert.equal(await page.locator('#lessonTestOptions button:disabled').count(),4);
   await page.locator('#lessonTestNext').click();
  }
  assert.match(await page.locator('#lessonTestQuestion').innerText(),/Mini test complete · 5 \/ 5/);
  await page.locator('#lessonTestNext').click();assert.equal(await page.locator('#lessonTestOptions button:not(:disabled)').count(),4);
  await page.reload();assert.equal(await page.evaluate(()=>state.lessons.length),1);assert.equal(await page.evaluate(()=>state.miniRight),5);assert.equal(await page.evaluate(()=>state.miniTotal),5);
  for(const section of ['home','library','study','quiz','lessons']){
   await page.locator(`nav [data-nav="${section}"]`).click();
   if(section==='library')await page.locator('#search').fill('');
   assert(await page.locator('#'+section).isVisible());
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}px on ${section}`);
  }
  await page.locator('nav [data-nav="home"]').click();await mkdir(resolve(root,'test-results'),{recursive:true});await page.screenshot({path:resolve(root,`test-results/home-${width}.png`),fullPage:true});assert.deepEqual(errors,[]);results.push(`${width}px: all 78 assets and mappings; navigation; flips; aliases; quizzes; five-question mini test; persistence; no horizontal overflow or runtime errors`);
  // Corrupted legacy values must not inflate progress or break startup.
  await page.evaluate(()=>localStorage.setItem(storageKey,JSON.stringify({learned:['major-0','major-0','invalid'],correct:-4})));await page.reload();assert.equal(await page.evaluate(()=>state.learned.length),1);assert.equal(await page.evaluate(()=>state.correct),0);
  await context.close();
 }
 console.log('PASS\n'+results.join('\n'));
}finally{await browser.close();await new Promise(r=>server.close(r))}
