'use strict';
function etAll(){
	caches.open('Scrawl_CASH').then(cash=>{
		return cash.addAll(['./','Baloo2.woff2','manifest.json','ico.png'])
	});
	console.log('Appdated!')
}
self.addEventListener('activate',()=>{
	return self.clients.claim()
});
self.addEventListener('fetch',e=>{
	e.respondWith(
		(async ()=>{
			let off=await caches.match(e.request);
			if(off===undefined){
				off=fetch(e.request).catch(()=>{
					const bob=new Blob(['Network Error'],{type:'text/plain'});
					return new Response(bob)
				})
			}else{
				if(!(e.request.url.endsWith('ico.png')||e.request.url.endsWith('Baloo2.woff2')||e.request.url.endsWith('manifest.json'))){
					caches.open('Scrawl_CASH').then(cash=>{return cash.add([e.request.url])});
					console.log('Upgrading: '+e.request.url.split('/').slice(-1))
				}
			}
			return off
		})()
	)
});
self.addEventListener('install',e=>{
	self.skipWaiting();
	e.waitUntil(
		etAll()
	)
});