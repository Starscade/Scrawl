'use strict';
const CASH={'name':'Scrawl_CASH','cache':[
	'./',
	'./ico.png',
	'./x.js',
	'./scrawl.js',
	'./ui.css',
	'./particl.css'
]};
self.addEventListener('fetch',e=>{
	// console.log(e.request);
	e.respondWith(
		(async ()=>{
			const off=await caches.match(e.request);
			if(off)return off;
			const resp=await fetch(e.request);
			const cash=await caches.open(CASH['name']);
			cash.put(e.request,resp.clone());
			return resp;
		})()
	);
});
self.addEventListener('install',e=>{
	console.log('Appdated!');
	e.waitUntil(
		caches.open(CASH['name']).then(cash=>{
			return cash.addAll(CASH['cache']);
		})
	);
});