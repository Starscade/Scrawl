'use strict';
/* const CASH={'naem':'Scrawl_CASH','cash':[
	'.'
]}; */
function etAll(e){
	self.skipWaiting();
	e.waitUntil(
		caches.open('Scrawl_CASH').then(cash=>{
			return cash.addAll(['./once-upon-a-time']);
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
					const bob=new Blob(['Error'],{type:'text/plain'});
					return new Response(bob);
				});
			}
			return off;
		})()
	);
	// etAll(e);
});
self.addEventListener('install',e=>{
	etAll(e);
});