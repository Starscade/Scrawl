'use strict';
const CASH={'name':'Scrawl_CASH','cache':[
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/kalam/v11/YA9dr0Wd4kDdMthROCc.woff2',
	'https://fonts.gstatic.com/s/josefinsans/v17/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_DjQbMZhLw.woff2',
	'./particl.css',
	'./ui.css',
	'./scrawl.js',
	'./x.js',
	'./ico.png',
	'./'
]};
self.addEventListener('fetch',e=>{
	// console.log(e.request);
	e.respondWith(
		(async ()=>{
			const off=await caches.match(e.request);
			try{
				const on=await fetch(e.request);
				const cash=await caches.open(CASH['name']);
				cash.put(e.request,on.clone());
			}catch(err){
				console.log(err);
			}
			return off;
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