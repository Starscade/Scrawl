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
self.addEventListener('activate',e=>{
	addAll(e);
	return self.clients.claim();
});
self.addEventListener('fetch',e=>{
	e.respondWith(
		(async ()=>{
			try{
				const off=await caches.match(e.request);
				if(off){
					console.log(off);
					return off;
				}
			}catch(err){
				const bob=new Blob('Offline',{type:'text/plain'});
				const res=new Response(bob);
				console.log(res);
				return res;
			}
		})()
	);
});
self.addEventListener('install',e=>{
	addAll(e);
});
