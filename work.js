'use strict';
const CASH={'name':'Scrawl_CASH','cache':[
  './index.htm',
  './ico.png',
  './x.js',
  './scrawl.js',
  './ui.css',
  './particl.css'
]};
self.addEventListener('fetch',e=>{
  e.respondWith(
    const off=await caches.match(e.request);
    const cash=await caches.open(CASH['Scrawl_CASH']);
    const on=await fetch(e.request);
    if(on){cash.put(e.request,on.clone());}
    if(off){return off;}
  );
});
self.addEventListener('install',e=>{
  console.log('Installed!');
  e.waitUntil((async ()=>{
    const cash=await caches.open(CASH['Scrawl_CASH']);
    await cash.addAll(CASH['cache']);
    console.log('Cached!');
  })());
});
