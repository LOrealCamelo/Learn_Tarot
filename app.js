
"use strict";
const major=[
["The Fool","Beginnings, openness, a leap of faith","What new experience invites your curiosity?","✧"],
["The Magician","Resourcefulness, intention, turning ideas into action","What tools do you already have?","✦"],
["The High Priestess","Inner knowing, mystery, quiet intuition","Where could you listen inward?","☽"],
["The Empress","Nurturing, creativity, abundance","What deserves gentle care?","❀"],
["The Emperor","Structure, stability, responsible leadership","What healthy boundary supports you?","♜"],
["The Hierophant","Tradition, learning, spiritual teaching","Which wisdom is worth studying?","✥"],
["The Lovers","Alignment, relationships, meaningful choice","Which choice matches your values?","♡"],
["The Chariot","Determination, direction, self-control","Where will focused effort take you?","♞"],
["Strength","Compassion, courage, patient resilience","How can kindness be a strength?","♌"],
["The Hermit","Reflection, solitude, inner guidance","What becomes clear in quiet?","✺"],
["Wheel of Fortune","Cycles, change, turning points","How might you adapt to change?","☼"],
["Justice","Fairness, accountability, clear judgment","What is the balanced next step?","⚖"],
["The Hanged Man","Pause, surrender, fresh perspective","What changes when you look differently?","⌛"],
["Death","Endings, release, transformation","What chapter is ready to close?","✶"],
["Temperance","Balance, patience, integration","Where can you find a middle path?","⚗"],
["The Devil","Attachment, limitation, reclaiming choice","What pattern no longer serves you?","⛓"],
["The Tower","Disruption, revelation, rebuilding","What truth is asking for change?","⚡"],
["The Star","Hope, renewal, inspiration","What helps restore your hope?","☆"],
["The Moon","Uncertainty, dreams, subconscious patterns","What needs gentle exploration?","☾"],
["The Sun","Joy, clarity, vitality","Where is light already present?","☀"],
["Judgement","Awakening, reflection, a new calling","What lesson are you ready to honor?","♬"],
["The World","Completion, integration, fulfillment","What journey deserves celebration?","◎"]];
const suitMeanings={
Cups:[
["Ace","Emotional beginnings, openness, connection"],["Two","Partnership, mutual care, rapport"],["Three","Friendship, celebration, community"],["Four","Contemplation, reassessing emotional needs"],["Five","Grief, disappointment, acknowledging loss"],["Six","Nostalgia, tenderness, memories"],["Seven","Choices, imagination, possibilities"],["Eight","Walking away, seeking deeper meaning"],["Nine","Contentment, gratitude, personal satisfaction"],["Ten","Harmony, belonging, shared happiness"],["Page","Emotional curiosity, heartfelt messages"],["Knight","Romance, idealism, following the heart"],["Queen","Empathy, sensitivity, intuitive care"],["King","Emotional maturity, compassionate steadiness"]],
Wands:[
["Ace","Inspiration, creative spark, new energy"],["Two","Planning, vision, future possibilities"],["Three","Expansion, momentum, looking ahead"],["Four","Celebration, homecoming, joyful stability"],["Five","Competition, differing opinions, friction"],["Six","Recognition, confidence, achievement"],["Seven","Courage, defending your position"],["Eight","Speed, movement, timely communication"],["Nine","Persistence, boundaries, resilience"],["Ten","Responsibility, burdens, carrying too much"],["Page","Exploration, enthusiasm, new ideas"],["Knight","Passion, bold action, adventurous spirit"],["Queen","Confidence, warmth, creative leadership"],["King","Vision, enterprise, inspired leadership"]],
Swords:[
["Ace","Clarity, insight, a breakthrough idea"],["Two","Indecision, difficult choices, pause"],["Three","Heartache, sorrow, emotional truth"],["Four","Rest, recovery, mindful pause"],["Five","Conflict, tension, questioning victory"],["Six","Transition, moving toward calmer waters"],["Seven","Strategy, discretion, independent thinking"],["Eight","Restriction, fear, perceived limits"],["Nine","Worry, anxiety, restless thoughts"],["Ten","Painful endings, a turning point"],["Page","Curiosity, questions, mental alertness"],["Knight","Direct action, ambition, decisive thought"],["Queen","Discernment, honesty, clear boundaries"],["King","Logic, fairness, intellectual mastery"]],
Pentacles:[
["Ace","Material opportunity, new practical beginnings"],["Two","Adaptability, juggling priorities, balance"],["Three","Craftsmanship, teamwork, shared skill"],["Four","Security, saving, holding tightly"],["Five","Hardship, isolation, seeking support"],["Six","Generosity, reciprocity, fair exchange"],["Seven","Patience, investment, long-term growth"],["Eight","Practice, mastery, dedicated work"],["Nine","Independence, self-worth, earned comfort"],["Ten","Legacy, family security, lasting abundance"],["Page","Study, diligence, practical opportunity"],["Knight","Consistency, discipline, dependable progress"],["Queen","Resourcefulness, care, grounded abundance"],["King","Stewardship, stability, practical success"]]};
const glyphs={Cups:"♒",Wands:"✶",Swords:"⚔",Pentacles:"✿"};
const deck=major.map((a,i)=>({id:"major-"+i,name:a[0],family:"Major Arcana",meaning:a[1],prompt:a[2],glyph:a[3],file:"major-"+String(i).padStart(2,"0")+".png"}));
Object.keys(suitMeanings).forEach(suit=>suitMeanings[suit].forEach((a,i)=>deck.push({id:suit.toLowerCase()+"-"+i,name:a[0]+" of "+suit,family:suit,meaning:a[1],prompt:"Where does "+a[1].toLowerCase()+" appear in your experience?",glyph:glyphs[suit],file:suit.toLowerCase()+"-"+String(i+1).padStart(2,"0")+".png"})));
// Stable legacy IDs preserve progress from PR #1. Display names follow the printed deck.
for (const card of deck) {
  card.legacyName=card.name;
  card.name=card.name.replace('Pentacles','Coins').replace('Page of','Knave of');
  if(card.family==='Pentacles')card.family='Coins';
  card.file=card.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.jpg';
  if (window.deckContent && window.deckContent[card.id]) Object.assign(card,window.deckContent[card.id]);
  card.prompt="Which details in this artwork help you remember its upright themes?";
}
// Marseille-style printed order, with legacy progress IDs retained.
[deck[8],deck[11]]=[deck[11],deck[8]];
const storageKey="ink-intuition-v1";
function load(){try{const s=JSON.parse(localStorage.getItem(storageKey)||"{}");return {learned:[...new Set(Array.isArray(s.learned)?s.learned.filter(id=>deck.some(c=>c.id===id)):[])],correct:Number.isFinite(s.correct)&&s.correct>=0?Math.floor(s.correct):0,lessons:Array.isArray(s.lessons)?s.lessons.filter(id=>Number.isInteger(id)&&id>=0&&id<26):[],miniRight:Number.isFinite(s.miniRight)&&s.miniRight>=0?Math.floor(s.miniRight):0,miniTotal:Number.isFinite(s.miniTotal)&&s.miniTotal>=0?Math.floor(s.miniTotal):0}}catch{return {learned:[],correct:0,lessons:[],miniRight:0,miniTotal:0}}}
let state=load(),position=0,revealed=false,quizQuestion=null,answered=false;
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(state))}catch{document.getElementById('storageStatus').textContent='Progress could not be saved. Browser storage may be disabled or full.'}}
const el=id=>document.getElementById(id);
function stats(){el("learningSummary").textContent=state.lessons.length+" lessons completed · "+state.miniRight+" / "+state.miniTotal+" mini-test answers correct";el("learnedCount").textContent=state.learned.length;el("quizCount").textContent=state.correct;el("learnedBar").style.width=(100*state.learned.length/78)+"%";el("progressText").textContent=state.learned.length+" of 78 cards learned ("+Math.round(100*state.learned.length/78)+"%).";}
function navigate(page){["home","library","study","quiz","lessons"].forEach(id=>el(id).classList.toggle("hidden",id!==page));document.querySelectorAll("[data-nav]").forEach(b=>{if(b.classList.contains("tab")){if(b.dataset.nav===page)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")}});if(page==="library")renderLibrary();if(page==="study")renderStudy();if(page==="quiz"&&!quizQuestion)newQuestion();window.scrollTo({top:0,behavior:"instant"});}
document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.nav)));
function cardArt(card,klass){
 const box=document.createElement("div");box.className=klass;
 const img=new Image();img.alt=card.name+" — original Ink & Intuition artwork";img.loading="lazy";
 img.onerror=()=>{img.remove();const message=document.createElement('span');message.className='asset-error';message.textContent='Artwork unavailable: '+card.name;box.append(message)};
 box.appendChild(img);img.src="assets/cards/"+card.file;return box;
}
function renderLibrary(){const q=el("search").value.toLowerCase().trim(),f=el("family").value,lf=el("learnFilter").value;const subset=deck.filter(c=>(f==="all"||c.family===f||(f==="minor"&&c.family!=="Major Arcana"))&&(lf==="all"||(lf==="learned"&&state.learned.includes(c.id))||(lf==="new"&&!state.learned.includes(c.id)))&&(!q||(c.name+" "+c.legacyName+" "+c.meaning).toLowerCase().includes(q)));el("resultCount").textContent=subset.length+" cards";const root=el("cards");root.replaceChildren();for(const c of subset){const btn=document.createElement("button");btn.className="tile";btn.setAttribute("aria-label","Study "+c.name);btn.appendChild(cardArt(c,"mini"));const small=document.createElement("small");small.textContent=c.family;const name=document.createElement("b");name.textContent=c.name;const mark=document.createElement("span");mark.className="mark small";mark.textContent=state.learned.includes(c.id)?"✓ Learned":"";btn.append(small,name,mark);btn.onclick=()=>{position=deck.indexOf(c);revealed=false;navigate("study")};root.appendChild(btn)}if(!subset.length){const p=document.createElement("p");p.className="empty";p.textContent="No matching cards. Try another search or filter.";root.appendChild(p)}}
["search","family","learnFilter"].forEach(id=>el(id).addEventListener(id==="search"?"input":"change",renderLibrary));
function renderStudy(){const c=deck[position];el("studyFamily").textContent=c.family+" · Upright";el("studyName").textContent=c.name;el("studyMeaning").textContent=c.meaning;el("studySource").textContent=c.source+" · Upright study summary";el("studySource").classList.toggle("hidden",!revealed);el("studyPrompt").textContent="Reflect: "+c.prompt;el("studyMeaning").classList.toggle("hidden",!revealed);el("studyPrompt").classList.toggle("hidden",!revealed);el("studyHint").classList.toggle("hidden",revealed);el("studyIndex").textContent="Card "+(position+1)+" of 78";el("learn").textContent=state.learned.includes(c.id)?"✓ Learned — undo":"Mark learned";const face=el("cardFace");face.replaceChildren();
face.appendChild(cardArt(c,"big-art"));
const label=document.createElement('div');label.className='back-title';label.textContent=revealed?c.meaning:'What is the upright meaning?';face.appendChild(label);
el('flip').classList.toggle('flipped',revealed);
el("flip").setAttribute("aria-label",revealed?"Hide meaning of "+c.name:"Reveal meaning of "+c.name);}
el("flip").onclick=()=>{revealed=!revealed;renderStudy()};
el("next").onclick=()=>{position=(position+1)%deck.length;revealed=false;renderStudy()};
el("random").onclick=()=>{position=Math.floor(Math.random()*deck.length);revealed=false;renderStudy()};
el("learn").onclick=()=>{const id=deck[position].id;state.learned=state.learned.includes(id)?state.learned.filter(x=>x!==id):[...state.learned,id];persist();stats();renderStudy()};
function shuffle(a){const arr=[...a];for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function newQuestion(){answered=false;quizQuestion=deck[Math.floor(Math.random()*deck.length)];const options=shuffle([quizQuestion,...shuffle(deck.filter(x=>x.id!==quizQuestion.id)).slice(0,3)]);el("question").textContent="Which card represents: “"+quizQuestion.meaning+"”?";el("choices").replaceChildren();options.forEach(card=>{const b=document.createElement("button");b.className="choice";b.textContent=card.name;b.onclick=()=>answer(b,card.id);el("choices").appendChild(b)});el("feedback").textContent="";el("another").classList.add("hidden");el("quizScore").textContent=state.correct+" correct";}
function answer(button,id){if(answered)return;answered=true;const ok=id===quizQuestion.id;if(ok){state.correct++;persist();stats()}document.querySelectorAll("#choices .choice").forEach(b=>{b.disabled=true;if(b.textContent===quizQuestion.name)b.classList.add("correct");else if(b===button)b.classList.add("wrong")});el("feedback").textContent=ok?"Correct! "+quizQuestion.name+" is a great match.":"Not quite — the answer is "+quizQuestion.name+".";el("another").classList.remove("hidden");el("quizScore").textContent=state.correct+" correct";}
el("another").onclick=newQuestion;
el("resetQuiz").onclick=()=>{if(confirm("Reset your correct-answer count? Learned cards will be kept.")){state.correct=0;persist();stats();newQuestion()}};
stats();navigate("home");
