'use strict';
const scrawl=new Scrawl();
const scrops={'name':'Untitled','dark':false,'apiurl':'http://localhost:8000/myapi.php',"edition":"free"};
const f=document.getElementsByTagName('input')[0];
const ui_new=document.getElementById('ui-new');
const ui_opn=document.getElementById('ui-open');
const ui_sav=document.getElementById('ui-save');
const ui_prln=document.getElementById('ui-print');
const ui_un=document.getElementById('ui-undo');
const ui_re=document.getElementById('ui-redo');
/* const ui_b=document.getElementById('ui-bold');
const ui_i=document.getElementById('ui-italic');
const ui_u=document.getElementById('ui-underline');
const ui_s=document.getElementById('ui-strike'); */
const ui_eng=document.getElementById('ui-spell');
const ui_num=document.getElementById('ui-words');
const ui_get=document.getElementById('ui-find');
const ui_see=document.getElementById('ui-see');
const ui_drk=document.getElementById('ui-dark');
const ui_go=document.getElementById('ui-send');
const ui_cfg=document.getElementById('ui-config');
const ui_out=document.getElementById('ui-exit');
let ops=scrops;
function config(ky,valu){
	if(!localStorage.Scrawl_CFG){
		localStorage.Scrawl_CFG=JSON.stringify(scrops);
	}
	let cfg=JSON.parse(localStorage.Scrawl_CFG);
	if(ky){
		cfg[ky]=valu;
		localStorage.Scrawl_CFG=JSON.stringify(cfg);
	}else{
		init(cfg);
	}
	ops=cfg;
}
function daerk(){
	if(document.body.classList.contains('day')){
		document.body.classList.remove('day');
		config('dark',true);
	}else{
		document.body.classList.add('day');
		config('dark',false);
	}
	config();
}
function init(c){
	if(!c['dark']==true){
		document.body.classList.add('day');
	}
}
function lokc(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.NOTEPAD.classList.remove('ugly');
		ui_see.textContent='lock';
	}else{
		scrawl.NOTEPAD.classList.add('ugly');
		ui_see.textContent='lock_open';
	}
	scrawl.WYSIWYG();
	naem();
}
function naem(){
	const h1=scrawl.NOTEPAD.innerHTML.match(/<h1>(.*)<\/h1>/);
	if(h1){
		config('name',h1[1]);
	}
}
function neu(){
	localStorage.Scrawl_TXT='';
	config('name',scrops['name']);
	location.reload();
}
function notif(msg='',h='S c r a w l',ico='./ico.png'){
	if(!window.Notification){
		console.log('Notifications unsupported!');
	} else{
		const noet=new Notification(h,{body:msg,icon:ico});
		if(Notification.permission==='granted'){
			noet;
		} else{
			Notification.requestPermission().then((perm)=>{
				if(perm==='granted'){
					noet;
				} else{
					console.log('Notification blocked!');
				}
			}).catch((err)=>{
				console.error(err);
			});
		}
	}
}
function ok(albak,argz,msg='Unsaved changes will be lost!'){
	let ok=confirm(msg);
	if(ok){
		albak(argz);
	}
}
function opn(){
	scrawl.opaen(f);
}
function prln(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		lokc();
	}
	window.print();
}
function pro(){
	if(navigator.userAgent.split('_')[0]==='ScrawlDaesk'){
		return true;
	}else{
		return false;
	}
}
function saen(){
	let apiurl=window.prompt('Please enter a URL...',ops['apiurl']);
	if(apiurl){
		config('apiurl',apiurl);
		const form=new FormData();
		const bob=new Blob([scrawl.md2htm()],{type:"text/html"});
		if(!ops['name']){
			ops['name']=scrops['name'];
		}
		form.append(0,bob,ops['name']);
		fetch(apiurl,{
			method:'POST',
			body:form
		}).then(
			resp=>resp.text()
		).then(
			resp=>{
				notif(resp);
			}
		)
	}
}
function saerk(){
	const w=window.prompt('Replace instances of...');
	if(w){
		if(scrawl.NOTEPAD.contentEditable=='false'){
			lokc();
		}
		notif(scrawl.saerk(w));
	}
}
function sav(){
	if(!ops['name']){
		ops['name']=scrops['name'];
	}
	scrawl.saef(ops['name']);
}
window.addEventListener('print',(e)=>{
	e.preventDefault();
	prln();
});
document.body.addEventListener('keydown',(e)=>{
	if(e.ctrlKey||e.metaKey){
		switch(e.key.toUpperCase()){
			case'H':e.preventDefault();saerk();break;
			case'K':e.preventDefault();scrawl.biu('~');break;
			case'N':e.preventDefault();ok(neu);break;
			case'O':e.preventDefault();opn();break;
			case'Q':e.preventDefault();ok(window.close);break;
			case'S':
				e.preventDefault();
				if(pro()){
					sav();
				}else{
					prln();
				}
				break;
			case'T':e.preventDefault();notif(scrawl.tally());break;
			case'W':e.preventDefault();ok(neu);break;
			case'Y':e.preventDefault();scrawl.undo(true);break;
			case'Z':e.preventDefault();scrawl.undo();break;
		}
	}else{
		switch(e.key){
			case' ':
				if(scrawl.NOTEPAD.contentEditable=='false'){
					e.preventDefault();
					notif(scrawl.tally());
				}
				break;
			case'Tab':
				e.preventDefault();
				lokc();
				break;
			case'F7':
				e.preventDefault();
				scrawl.spael();
				break;
			case'F8':
				e.preventDefault();
				notif(scrawl.tally());
				break;
			case'F9':
				e.preventDefault();
				saerk();
				break;
			case'F10':
				e.preventDefault();
				daerk();
				break;
			/* case'F12':
				e.preventDefault();
				saen();
				break; */
		}
	}
});
ui_new.onclick=()=>{
	ok(neu);
}
ui_opn.onclick=()=>{
	opn();
}
ui_sav.onclick=()=>{
	sav();
}
ui_prln.onclick=()=>{
	prln();
}
ui_un.onclick=()=>{
	scrawl.undo();
}
ui_re.onclick=()=>{
	scrawl.undo(true);
}
/* ui_b.onclick=()=>{
	scrawl.biu('**');
}
ui_i.onclick=()=>{
	scrawl.biu();
}
ui_u.onclick=()=>{
	scrawl.biu('_');
}
ui_s.onclick=()=>{
	scrawl.biu('~');
} */
ui_eng.onclick=()=>{
	scrawl.spael();
}
ui_num.onclick=()=>{
	notif(scrawl.tally());
}
ui_get.onclick=()=>{
	saerk();
}
ui_see.onclick=()=>{
	lokc();
}
ui_go.onclick=()=>{
	saen();
}
ui_drk.onclick=()=>{
	daerk();
}
ui_out.onclick=()=>{
	window.close();
}
if(pro()){
	ui_cfg.style.display='inline';
	ui_sav.style.display='inline';
}
config();
naem();
document.body.style.opacity='1';
notif(navigator.userAgent);