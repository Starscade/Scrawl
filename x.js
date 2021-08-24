'use strict';
const scrawl=new Scrawl();
const scrops=document.getElementById('scrops').innerHTML;
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
// const ui_cfg=document.getElementById('ui-config');
let ops=JSON.parse(scrops);
function config(ky,valu){
	if(!localStorage.getItem('Scrawl_CFG')){
		localStorage.setItem('Scrawl_CFG',scrops);
	}
	let cfg=JSON.parse(localStorage.getItem('Scrawl_CFG'));
	if(ky){
		cfg[ky]=valu;
		localStorage.setItem('Scrawl_CFG',JSON.stringify(cfg));
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
	if(c['dark']==true){
		document.body.classList.remove('day');
	}else{
		if(!document.body.classList.contains('day')){
			document.body.classList.remove('day');
		}
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
	localStorage.setItem('Scrawl_TXT','');
	config('name',JSON.parse(scrops)['name']);
	location.reload();
}
function ok(albak,argz,msg='Unsaved changes will be lost! Proceed?'){
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
function saen(){
	let apiurl=window.prompt('Please enter a URL...',ops['apiurl']);
	if(apiurl){
		config('apiurl',apiurl);
		const form=new FormData();
		const bob=new Blob([scrawl.md2htm()],{type:"text/html"});
		if(!ops['name']){
			ops['name']=JSON.parse(scrops)['name'];
		}
		form.append(0,bob,ops['name']);
		fetch(apiurl,{
			method:'POST',
			body:form
		}).then(
			resp=>resp.text()
		).then(
			resp=>{
				alert("The API says:\n\n"+resp);
			}
		)
	}
}
function sav(){
	if(!ops['name']){
		ops['name']=JSON.parse(scrops)['name'];
	}
	let fnaem=window.prompt('Please enter a filename...',ops['name']);
	if(fnaem){
		scrawl.saev(fnaem);
	}
}
window.addEventListener('beforeprint',(e)=>{
	e.preventDefault();
	prln();
});
document.body.addEventListener('keydown',(e)=>{
	if(e.ctrlKey||e.metaKey){
		switch(e.key.toUpperCase()){
			// case'N':e.preventDefault();scrawl.naew();break;
			case'M':e.preventDefault();ok(neu);break;
			case'O':e.preventDefault();opn();break;
			case'S':e.preventDefault();sav();break;
			// case'W':e.preventDefault();scrawl.wcoun();break;
			case'Y':e.preventDefault();scrawl.undo(true);break;
			case'Z':e.preventDefault();scrawl.undo();break;
		}
	}else{
		switch(e.key){
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
				scrawl.woun();
				break;
			case'F10':
				e.preventDefault();
				daerk();
				break;
			case'F12':
				e.preventDefault();
				saen();
				break;
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
	scrawl.woun();
}
ui_get.onclick=()=>{
	scrawl.saerk();
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
config();
naem();