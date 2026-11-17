/* Unchanged learningPage from Spiritual_Vibez_App/frontend/app.js. */
function learningPage(){
 const total=state.cards.length,n=studiedCount(state.cards),percent=Math.round(n/Math.max(1,total)*100);
 let out=artHeader('learn_header','Learn Tarot — build your knowledge, one fun lesson at a time');
 out+=artButton('learn_progress','Your Learning Journey','learn-module','data-module="all"','<span class="panel-meta">'+percent+'% complete</span>'+progressMarkup(n,total));
 out+='<p class="art-note">'+n+' / '+total+' cards studied this session</p>';
 if(!state.learningModule){
  out+=studyArt('learn_major_arcana','Major Arcana','Major',state.cards.filter(c=>c.suit==='Major'));
  out+=studyArt('learn_minor_arcana','Minor Arcana','minor',state.cards.filter(c=>c.suit!=='Major'));
  out+=studyArt('learn_card_meanings','Card Meanings','all',state.cards);
  out+=studyArt('learn_reversed_cards','Reversed Cards','reversed',state.cards);
  return out+artButton('learn_quiz_me','Quiz Me','quiz')+learningConnections();
 }
 out+=btn('← Learning modules','learn-back','cream');
 if(state.learningModule==='quiz'){
  if(!state.quiz)return out+notice('Loading your question…');
  const q=state.quiz;return out+'<div class="glass"><h3>🎯 '+e(q.card_name)+'</h3>'+tarotImage(state.cards.find(c=>c.id===q.card_id)||{id:q.card_id,name:q.card_name},'study-tarot')+'<p>'+e(q.prompt||'What can this card represent?')+'</p><div class="chips">'+q.options.map(x=>'<button class="chip" data-action="quiz-answer" data-answer="'+e(x)+'" '+(state.answer?'disabled':'')+'>'+e(x)+'</button>').join('')+'</div>'+(state.answer?notice(state.answer,state.answer.startsWith('Correct')?'ok':''):'')+btn('Next question','quiz')+'</div>';
 }
 if(state.cardDetail){const c=state.cardDetail;out+='<div class="glass" id="selected-card"><h3>'+e(c.icon)+' '+e(c.name)+'</h3>'+tarotImage(c,'study-tarot',state.learningModule==='reversed')+'<p><strong>Upright:</strong> '+e(c.description_upright||c.upright)+'</p><p><strong>Reversed:</strong> '+e(c.description_reversed||c.reversed)+'</p><p><strong>Mantra:</strong> '+e(c.mantra||'Reflect on what resonates.')+'</p>'+btn('Close card','close-card','cream')+'</div>'}
 out+='<div class="chips">'+['all','Major','Wands','Cups','Swords','Coins'].map(f=>chip(f==='all'?'All cards':f,'learn-filter',state.filter===f,'data-filter="'+f+'"')).join('')+'</div><div class="deck-cards">'+state.cards.filter(c=>state.filter==='all'||(state.filter==='minor'?c.suit!=='Major':c.suit===state.filter)).map(c=>'<button class="deck-card" data-action="card" data-card="'+c.id+'">'+tarotImage(c,'deck-tarot',state.learningModule==='reversed')+''+e(c.name)+'<small>'+e(c.suit)+'</small></button>').join('')+'</div>';
 return out;
}

