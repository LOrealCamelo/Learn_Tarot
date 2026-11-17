/* Static host adapter. learning-page.js, learning.js, artwork.js and source CSS
   are copied from Spiritual_Vibez_App; all deck meaning text is unchanged. */
'use strict';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(text,action,other='',extra='')=>'<button class="btn '+other+'" data-action="'+action+'" '+extra+'>'+text+'</button>';
const chip=(text,action,active=false,attrs='')=>'<button class="chip '+(active?'active':'')+'" data-action="'+action+'" '+attrs+'>'+e(text)+'</button>';
const notice=(text,kind='')=>'<div class="note '+kind+'">'+e(text)+'</div>';
const artButton=(file,label,action,attrs='',extra='')=>'<button class="art-button '+panelClasses(file)+'" data-panel="'+file+'" data-action="'+action+'" aria-label="'+e(label)+'" '+attrs+'>'+panelContents(file,extra)+'</button>';
const artHeader=(file,label)=>'<section class="art-header '+panelClasses(file)+'" data-panel="'+file+'" aria-label="'+e(label)+'">'+panelContents(file)+'</section>';
const riderStorageKey='ink-intuition-rider-waite-v1';
function readProgress(){try{const s=JSON.parse(localStorage.getItem(riderStorageKey)||'{}');return {studied:[...new Set(Array.isArray(s.studied)?s.studied.filter(id=>RIDER_CARDS.some(c=>c.id===id)):[])],quizProgress:Number.isFinite(s.quizProgress)&&s.quizProgress>=0?s.quizProgress:0};}catch{return {studied:[],quizProgress:0}}}
const state={...readProgress(),cards:RIDER_CARDS,filter:'all',learningModule:null,cardDetail:null,quiz:null,answer:'',tool:null};
function saveProgress(){try{localStorage.setItem(riderStorageKey,JSON.stringify({studied:state.studied,quizProgress:state.quizProgress}));}catch{document.getElementById('save-status').textContent='Progress could not be saved. Browser storage may be full or disabled.';}}
const studiedCount=cards=>cards.filter(c=>state.studied.includes(c.id)).length;
function progressMarkup(completed,total){return '<span class="panel-progress"><meter min="0" max="'+Math.max(total,1)+'" value="'+completed+'" aria-label="Cards studied"></meter><span>'+completed+' / '+total+' cards</span></span>';}
function studyArt(file,label,module,cards){return artButton(file,label,'learn-module','data-module="'+module+'"',progressMarkup(studiedCount(cards),cards.length));}
function tarotImage(card,cls='',reversed=false){const name=card.name.replaceAll('Coins','Pentacles');const file=String(card.id).padStart(2,'0')+'-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.webp';return '<img class="tarot-image '+cls+(reversed?' tarot-reversed':'')+'" src="assets/tarot/'+e(file)+'" alt="'+e(name)+(reversed?' — reversed':'')+'" loading="lazy">';}
function shuffle(cards){const a=[...cards];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function askQuiz(){const card=state.cards[Math.floor(Math.random()*state.cards.length)];state.learningModule='quiz';state.answer='';state.quiz={card_id:card.id,card_name:card.name,prompt:'Which upright meaning matches this card?',correct_answer:card.upright,options:shuffle([card.upright,...shuffle(state.cards.filter(c=>c.id!==card.id)).slice(0,3).map(c=>c.upright)])};render();}
function render(){document.getElementById('rider-app').innerHTML=clearGlassFilter()+(state.tool==='houses'?housesGuide():state.tool==='numbers'?numberReference():learningPage());}
// Retain the source number and house content. The personal natal-chart/Life Path
// calculators are not part of this static Tarot tab; no API requests are made.
function numberReference(){return '<h2>Number patterns</h2>'+btn('← Learn Tarot','learn-back','cream')+'<div class="reference-grid">'+LEARNING_LIBRARY.numbers.map(numberLesson).join('')+'</div>'+tarotNumberLessons();}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
 if(a==='learn-module'){state.learningModule=b.dataset.module;state.filter=['all','reversed'].includes(b.dataset.module)?'all':b.dataset.module;state.cardDetail=null;state.tool=null;}
 else if(a==='learn-back'||a==='nav:learn'){state.learningModule=null;state.cardDetail=null;state.tool=null;}
 else if(a==='learn-filter')state.filter=b.dataset.filter;
 else if(a==='card'){state.cardDetail=state.cards.find(c=>String(c.id)===b.dataset.card);if(!state.studied.includes(state.cardDetail.id))state.studied.push(state.cardDetail.id);saveProgress();}
 else if(a==='close-card')state.cardDetail=null;
 else if(a==='quiz'){askQuiz();return;}
 else if(a==='quiz-answer'){if(state.answer)return;const ok=b.dataset.answer===state.quiz.correct_answer;state.answer=ok?'Correct! ✨ You got it!':'Keep learning! The answer is '+state.quiz.correct_answer;state.quizProgress++;if(ok&&!state.studied.includes(state.quiz.card_id))state.studied.push(state.quiz.card_id);saveProgress();}
 else if(a==='tool:houses')state.tool='houses';
 else if(a==='tool:numbers')state.tool='numbers';
 else if(a==='tool:natal'){location.href='https://app.neurospicymystic.com/#explore/natal';return;}
 else return;
 render();if(a==='card')document.getElementById('selected-card')?.scrollIntoView({block:'start'});
});
render();
