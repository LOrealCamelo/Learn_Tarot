"use strict";
// Bind after all original scripts initialize, preserving their navigation and state.
window.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-family]').forEach(b=>b.onclick=()=>{el('search').value='';el('family').value=b.dataset.family;navigate('library')});
 document.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>{el('lessonTopic').value=b.dataset.topic;lessonPosition=0;lessonRevealed=false;showLesson();navigate('lessons')});
 document.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{position=deck.findIndex(c=>c.name===b.dataset.card);revealed=false;navigate('study')});
});
