'use strict';
const CASH={'name':'Scrawl_CASH','cache':[
  '/index.htm',
  '/ico.png',
  '/x.js',
  '/scrawl.js',
  '/ui.css',
  '/particl.css'
]};
self.addEventListener('fetch',e=>{
  console.log(e.request);
  e.respondWith(async ()=>{
    const on=await fetch(e.request);
    return on;
  });
});
self.addEventListener('install',e=>{
  console.log('Installed!');
  e.waitUntil(
    caches.open(CASH['name']).then(cash=>{
      return cash.addAll(CASH['cache']);
    })
  );    
});
