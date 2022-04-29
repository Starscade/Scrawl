'use strict';
function etAll(){
	caches.open('Scrawl_CASH').then(cash=>{
		return cash.addAll(['ico.png',/* './home/', */'./once-upon-a-time/','Baloo2.woff2']);
	});
	console.log('Appdated!');
}
self.addEventListener('activate',()=>{
	etAll();
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
			}/* else{
				etAll();
			} */
			return off;
		})()
	);
});
self.addEventListener('install',e=>{
	self.skipWaiting();
	e.waitUntil(
		etAll()
	);
});