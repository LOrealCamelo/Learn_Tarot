"use strict";
(() => {
 const button=document.getElementById('offlineSave');
 const status=document.getElementById('offlineStatus');
 const connection=document.getElementById('connectionStatus');
 const supported='serviceWorker' in navigator && window.isSecureContext;
 function network(){connection.textContent=navigator.onLine?'Online · download once to study anywhere.':'You’re offline · study using your saved download.';}
 network();window.addEventListener('online',network);window.addEventListener('offline',network);
 if(!supported){button.disabled=true;status.textContent='Open the hosted app in Safari or Chrome to enable offline study.';return;}
 function ask(worker){return new Promise((resolve,reject)=>{const channel=new MessageChannel();const timer=setTimeout(()=>reject(Error('Unable to check the offline download.')),6000);channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data)};worker.postMessage({type:'STATUS'},[channel.port2]);});}
 function ready(){button.textContent='✓ Saved for offline study';button.disabled=false;status.textContent='Both decks, lessons and quizzes are saved on this device. Add this page to your home screen, then open it once there while online.';}
 async function check(reg){if(!reg?.active)return;try{const result=await ask(reg.active);if(result.ready)ready();}catch{}}
 navigator.serviceWorker.addEventListener('message',event=>{if(event.data?.type==='CACHE_PROGRESS'){status.textContent=`Saving offline files… ${event.data.done} of ${event.data.total}. Keep this page open.`;}});
 navigator.serviceWorker.getRegistration(new URL('./',location.href).href).then(reg=>check(reg));
 button.addEventListener('click',async()=>{
  button.disabled=true;status.textContent='Downloading the app and both decks. Keep this page open…';
  try{
   // Ask the browser to retain downloaded files when supported; a denial is harmless.
   if(navigator.storage?.persist)await navigator.storage.persist().catch(()=>false);
   const reg=await navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'});
   await reg.update();
   const worker=reg.installing||reg.waiting||reg.active;
   if(!worker)throw Error('Offline download could not start.');
   if(worker.state!=='activated')await new Promise((resolve,reject)=>{
    const listener=()=>{if(worker.state==='activated'){worker.removeEventListener('statechange',listener);resolve();}else if(worker.state==='redundant'){worker.removeEventListener('statechange',listener);reject(Error('Download interrupted. Check your connection and free storage, then try again.'));}};
    worker.addEventListener('statechange',listener);listener();
   });
   const result=await ask(reg.active||worker);
   if(!result.ready)throw Error('The offline download is incomplete. Please try again online.');
   ready();
  }catch(error){button.disabled=false;button.textContent='Try offline download again';status.textContent=error.message||'Could not finish downloading. Try again online.';}
 });
})();
