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
  e.respondWith(
    async function() {
      // Try to get the response from a cache.
      const cachedResponse = await caches.match(e.request);
      // Return it if we found one.
      if (cachedResponse) return cachedResponse;
      // If we didn't find a match in the cache, use the network.
      return fetch(e.request);
    }()
  );
});
self.addEventListener('install',e=>{
  console.log('Installed!');
  e.waitUntil(
    caches.open(CASH['name']).then(cash=>{
      return cash.addAll(CASH['cache']);
    })
  );    
});
