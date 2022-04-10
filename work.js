'use strict';
const CASH={'naem':'Scrawl_CASH','cash':[
	'manifest.json',
	'ico.png',
	'.'
]};
function addAll(e){
	self.skipWaiting();
	e.waitUntil(
		caches.open(CASH['naem']).then(cash=>{
			return cash.addAll(CASH['cash']);
		})
	);
}
self.addEventListener('activate',()=>{
	return self.clients.claim();
});
self.addEventListener('fetch',e=>{
	e.respondWith(
		(async ()=>{
			let off=await caches.match(e.request);
			if(off===undefined){
				off=fetch(e.request).catch(()=>{
					const bob=new Blob(['Offline'],{type:'text/plain'});
					return new Response(bob);
				});
			}
			return off;
		})()
	);
	addAll(e);
});
self.addEventListener('install',e=>{
	addAll(e);
});
