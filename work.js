'use strict';
const CASH={'naem':'Scrawl_CASH','cash':[
	'manifest.json',
	'./ico.png',
	'./',
	'adapticon.png',
	'Baloo2.woff2'
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
	return self.clients.claim();
});
self.addEventListener('fetch',e=>{
	// console.log(e.request);
	const off=caches.match(e.request);
	if(off){
		e.respondWith(
			(async ()=>{
				try{
					const on=await fetch(e.request);
					const cash=await caches.open(CASH['naem']);
					cash.put(e.request,on.clone());
				}catch(err){
					console.log('Offline...');
				}
				return off;
			})()
		);
	}
});
self.addEventListener('install',e=>{
	addAll(e);
	console.log('Appdated!');
});