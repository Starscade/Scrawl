'use strict';
const scrawl=new Scrawl();
const scrops={'init':'y','desk':'n','name':'Untitled','dark':'n','apiurl':'http://localhost:8000/myapi.php','edition':'free'};
const ui_new=document.getElementById('ui-new');
const ui_opn=document.getElementById('ui-open');
const ui_sav=document.getElementById('ui-save');
const ui_prln=document.getElementById('ui-print');
const ui_un=document.getElementById('ui-undo');
const ui_re=document.getElementById('ui-redo');
const ui_b=document.getElementById('ui-bold');
const ui_i=document.getElementById('ui-italic');
const ui_u=document.getElementById('ui-underline');
const ui_s=document.getElementById('ui-strike');
const ui_eng=document.getElementById('ui-spell');
const ui_num=document.getElementById('ui-words');
const ui_get=document.getElementById('ui-find');
const ui_see=document.getElementById('ui-see');
const ui_drk=document.getElementById('ui-dark');
const ui_go=document.getElementById('ui-send');
const ui_cfg=document.getElementById('ui-config');
const ui_scr=document.getElementById('ui-full');
const ui_out=document.getElementById('ui-exit');
const msgSorry='Sorry, that only works with a license.';
function alurt(msg='OK!'){
	const modal=document.createElement('div');
	modal.classList.add('alurt');
	modal.textContent=msg;
	document.body.appendChild(modal);
	modal.onpointerdown=()=>{
		modal.remove();
	}
	modal.onanimationend=()=>{
		modal.remove();
	};
}
function config(ky,valu){
	if(!localStorage.Scrawl_CFG){
		localStorage.Scrawl_CFG=JSON.stringify(scrops);
	}
	let cfg=JSON.parse(localStorage.Scrawl_CFG);
	if(ky){
		if(valu){
			cfg[ky]=valu;
			localStorage.Scrawl_CFG=JSON.stringify(cfg);
		}else{
			return JSON.parse(localStorage.Scrawl_CFG)[ky];
		}
	}else{
		return cfg;
	}
}
function defaet(){
	const pro_feats=document.getElementsByClassName('pro');
	while(pro_feats.length){
		pro_feats[0].classList.remove('pro');
	}
	console.log('Pro Edition!');
}
function daerk(){
	if(pro()){
		if(document.body.classList.contains('day')){
			document.body.classList.remove('day');
			config('dark','y');
		}else{
			document.body.classList.add('day');
			config('dark','n');
		}
	}else{
		alurt(msgSorry);
	}
}
function fulscrn(){
	if(document.fullscreenElement){
		document.exitFullscreen();
		ui_scr.textContent='fullscreen';
	}else{
		if(document.body.parentElement.requestFullscreen){
			document.body.parentElement.requestFullscreen();
			ui_scr.textContent='fullscreen_exit';
		}
	}
}
function lokc(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.NOTEPAD.classList.remove('ugly');
		ui_un.classList.add('cis');
		ui_re.classList.add('cis');
		ui_eng.classList.add('cis');
		ui_get.classList.add('cis');
		ui_see.textContent='lock';
	}else{
		scrawl.NOTEPAD.classList.add('ugly');
		ui_un.classList.remove('cis');
		ui_re.classList.remove('cis');
		ui_eng.classList.remove('cis');
		ui_get.classList.remove('cis');
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
function naew(){
	localStorage.Scrawl_TXT='';
	config('name',scrops['name']);
	location.reload();
}
function notif(msg='',h='S c r a w l',ico='./ico.png'){
	if(!window.Notification){
		console.log('Notifications unsupported!');
	} else{
		const noet=new Notification(h,{body:msg,icon:ico});
		if(Notification.permission=='granted'){
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
	const ok=confirm(msg);
	if(ok){
		albak(argz);
	}
}
function opn(){
	const f=document.createElement('input');
	f.type='file';
	f.setAttribute('accept','.md,.htm,.html');
	document.body.appendChild(f);
	f.click();
	f.onchange=()=>{
		const d=f.files[0];
		scrawl.opaen(d);
	}
}
function prln(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		lokc();
	}
	window.print();
}
function pro(){
	if(config('edition')=='pro'){
		return true;
	}else{
		return false;
	}
}
function saen(){
	if(pro()){
		let apiurl=window.prompt('Please enter a URL...',config('apiurl'));
		if(apiurl){
			config('apiurl',apiurl);
			if(apiurl.includes('|')){
				apiurl=apiurl.split('|');
				if(!apiurl[1]){
					apiurl[1]=config('name');
				}
			}else{
				apiurl=[apiurl,config('name')];
			}
			const form=new FormData();
			const bob=new Blob([scrawl.md2htm()],{type:"text/html"});
			form.append(0,bob,apiurl[1]);
			fetch(apiurl[0],{
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
	}else{
		alurt(msgSorry);
	}
}
function saerk(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		const w=window.prompt('Replace instances of...');
		if(w){
			alurt(scrawl.saerk(w));
		}
	}
}
function sav(){
	if(!config('name')){
		config('name',scrops['name']);
	}
	if(localStorage.Scrawl_TXT){
		scrawl.saef(config('name'));
	}else{
		alurt('Nothing to save...');
	}
}
function spelk(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.spael();
		if(scrawl.NOTEPAD.getAttribute('spellcheck')=='true'){
			ui_eng.style.color='var(--hi)';
		}else{
			ui_eng.style.color=ui_get.style.color;
		}
	}
}
function ver(){
	return'Scrawl ('+config('edition').charAt(0).toUpperCase()+config('edition').substring(1)+' Edition)';
}
// HEY, LISTEN!
document.body.parentElement.ondragover=(e)=>{
	e.preventDefault();
}
document.body.parentElement.ondrop=(e)=>{
	e.preventDefault();
	scrawl.opaen(e.dataTransfer.items[0].getAsFile());
}
document.body.addEventListener('keydown',e=>{
	if(e.ctrlKey||e.metaKey){
		switch(e.key.toUpperCase()){
			case'=':e.preventDefault();scrawl.pt();break;
			case'-':e.preventDefault();scrawl.pt(false);break;
			case'H':e.preventDefault();saerk();break;
			case'K':e.preventDefault();scrawl.biu('~');break;
			case'L':e.preventDefault();spelk();break;
			case'N':e.preventDefault();ok(naew);break;
			case'O':e.preventDefault();opn();break;
			case'P':e.preventDefault();prln();break;
			case'Q':e.preventDefault();ok(window.close);break;
			case'R':e.preventDefault();location.reload();break;
			case'S':e.preventDefault();sav();break;
			case'T':e.preventDefault();alurt(scrawl.tally());break;
			case'W':e.preventDefault();ok(window.close);break;
			case'Y':e.preventDefault();scrawl.undo(true);break;
			case'Z':e.preventDefault();scrawl.undo();break;
		}
	}else{
		switch(e.key){
			case' ':
				if(scrawl.NOTEPAD.contentEditable=='false'){
					e.preventDefault();
					alurt(scrawl.tally());
				}
				break;
			case'Tab':
				e.preventDefault();
				lokc();
				break;
			case'F10':
				e.preventDefault();
				daerk();
				break;
			case'F11':
				e.preventDefault();
				// fulscrn();
				break;
			/* case'F12':
				e.preventDefault();
				saen();
				break; */
		}
	}
});
ui_new.onpointerdown=()=>{
	ok(naew);
}
ui_opn.onpointerdown=()=>{
	opn();
}
ui_sav.onpointerdown=()=>{
	sav();
}
ui_prln.onpointerdown=()=>{
	prln();
}
ui_un.onpointerdown=()=>{
	scrawl.undo();
}
ui_re.onpointerdown=()=>{
	scrawl.undo(true);
}
ui_b.onpointerdown=()=>{
	// scrawl.biu('**');
	document.execCommand('bold');
}
ui_i.onpointerdown=()=>{
	// scrawl.biu();
	document.execCommand('italic');
}
ui_u.onpointerdown=()=>{
	// scrawl.biu('_');
	document.execCommand('underline');
}
ui_s.onpointerdown=()=>{
	// scrawl.biu('~');
	document.execCommand('strikeThrough');
}
ui_eng.onpointerdown=()=>{
	spelk();
}
ui_num.onpointerdown=()=>{
	alurt(scrawl.tally());
}
ui_get.onpointerdown=()=>{
	saerk();
}
ui_see.onpointerdown=()=>{
	lokc();
}
ui_go.onpointerdown=()=>{
	saen();
}
ui_drk.onpointerdown=()=>{
	daerk();
}
ui_scr.onpointerdown=()=>{
	fulscrn();
}
ui_out.onpointerdown=()=>{
	window.close();
}
// INIT
if(pro()){
	defaet();
}else{
	if(config('init')=='y'){
		if(navigator.userAgent.includes('ScrawlDaesk')){
			config('desk','y');
			ui_scr.classList.add('desk');
			ui_out.classList.remove('desk');
		}
		const key=window.prompt('Please enter your license key...');
		if(key=='T3BlbiBzZXNhbWUh'){
			config('edition','pro');
			defaet();
			notif("Congratulations! You've unlocked Pro Edition!");
		}else{
			alurt("Sorry, that didn't Work. :(");
			notif('Free Edition.');
		}
		config('init','n');
	}
}
if(config('dark')=='n'){
	document.body.classList.add('day');
}
if(config('desk')=='y'){
	ui_scr.classList.add('desk');
	ui_out.classList.remove('desk');
}
ui_un.classList.add('cis');
ui_re.classList.add('cis');
ui_eng.classList.add('cis');
ui_get.classList.add('cis');
naem();
document.body.style.opacity='1';