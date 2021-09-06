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
  console.log(e.request.url);
  e.respondWith(fetch(e.request).catch(e=>{
        console.error('Fetching offline resource...',e);
        return caches.open(CASH['name']).then(cash=>{
          return cash.match(e.request.url);
        }););
});
self.addEventListener('install',e=>{
  console.log('Installed!');
  e.waitUntil(
    caches.open(CASH['name']).then(cash=>{
      return cash.addAll(CASH['cache']);
    })
  );    
});
