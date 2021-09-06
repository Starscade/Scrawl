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
    caches.open(CASH['Scrawl_CASH']).then(cash=>{
      const on=fetch(e.request).then(resp=>{
        cash.put(e.request,resp.clone());
        return resp;
      });
    });
    if(off){
      return off;
    }else{
      return on;
    }
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
