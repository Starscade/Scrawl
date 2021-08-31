'use strict';
const scrawl=new Scrawl();
const SCROPS={'init':'y','desk':'n','name':'Untitled','dark':'n','apiurl':'http://localhost:8000/myapi.php','edition':'free'};
const ui_men=document.getElementById('ui-menu');
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
const ui_day=document.getElementById('ui-dark');
const ui_go=document.getElementById('ui-send');
const ui_cfg=document.getElementById('ui-config');
const ui_out=document.getElementById('ui-exit');
const msgSorry='Sorry, that only works with a license.';
function alurt(msg='OK!'){
	const modal=document.createElement('div');
	modal.classList.add('alurt');
	modal.textContent=msg;
	document.body.appendChild(modal);
	modal.onclick=()=>{
		modal.remove();
	}
	modal.onanimationend=()=>{
		modal.remove();
	};
}
function config(ky,valu){
	if(!localStorage.Scrawl_CFG){
		localStorage.Scrawl_CFG=JSON.stringify(SCROPS);
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
	const freats=[...document.getElementsByClassName('free')];
	while(pro_feats.length){
		pro_feats[0].classList.remove('pro');
	}
	freats.forEach((l,i)=>{
		l.style.display='none';
	});
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
		alert(msgSorry);
	}
}
function lokc(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.NOTEPAD.classList.remove('ugly');
		ui_un.classList.add('cis');
		ui_re.classList.add('cis');
		ui_eng.classList.add('cis');
		document.getElementById('ui-spell-mobil').classList.add('cis');
		ui_get.classList.add('cis');
		document.getElementById('ui-find-mobil').classList.add('cis');
		ui_see.textContent='lock';
	}else{
		scrawl.NOTEPAD.classList.add('ugly');
		ui_un.classList.remove('cis');
		ui_re.classList.remove('cis');
		ui_eng.classList.remove('cis');
		document.getElementById('ui-spell-mobil').classList.remove('cis');
		if(pro()){
			ui_get.classList.remove('cis');
			document.getElementById('ui-find-mobil').classList.remove('cis');
		}
		ui_see.textContent='lock_open';
	}
	scrawl.WYSIWYG();
	naem();
}
function maenu(){
	const men=document.getElementById('men-file');
	men.classList.toggle('show');
}
function naem(){
	const h1=scrawl.NOTEPAD.innerHTML.match(/<h1>(.*)<\/h1>/);
	if(h1){
		config('name',h1[1]);
	}
}
function naew(){
	localStorage.Scrawl_TXT='';
	config('name',SCROPS['name']);
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
function paey(){
	const key=window.prompt('Please enter your license key...');
	if(key=='T3BlbiBzZXNhbWUh'){
		config('edition','pro');
		defaet();
		alert('SUCCESS! Thanks for supporting me.');
	}else{
		if(key!=''){
			const agan=confirm("Sorry, that didn't Work. Try again?");
			if(agan){
				paey();
			}
		}
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
					alert(resp);
				}
			)
		}
	}else{
		alert(msgSorry);
	}
}
function saerk(){
	if(pro()){
		if(scrawl.NOTEPAD.contentEditable=='true'){
			const w=window.prompt('Replace instances of...');
			if(w){
				alert(scrawl.saerk(w));
			}
		}
	}else{
		alert(msgSorry);
	}
}
function sav(){
	if(!config('name')){
		config('name',SCROPS['name']);
	}
	scrawl.saef(config('name'));
}
function spelk(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.spael();
		if(scrawl.NOTEPAD.getAttribute('spellcheck')=='true'){
			ui_eng.style.color='var(--hi)';
			document.getElementById('ui-spell-mobil').style.color='var(--hi)';
		}else{
			ui_eng.style.color=ui_get.style.color;
			document.getElementById('ui-spell-mobil').style.color=ui_get.style.color;
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
			case'T':e.preventDefault();alert(scrawl.tally());break;
			case'W':e.preventDefault();ok(window.close);break;
			case'Y':e.preventDefault();scrawl.undo(true);break;
			case'Z':e.preventDefault();scrawl.undo();break;
		}
	}else{
		switch(e.key){
			case' ':
				if(scrawl.NOTEPAD.contentEditable=='false'){
					e.preventDefault();
					alert(scrawl.tally());
				}
				break;
			case'Tab':
				e.preventDefault();
				lokc();
				break;
			case'F7':
				e.preventDefault();
				spelk();
				break;
			case'F8':
				e.preventDefault();
				alert(scrawl.tally());
				break;
			case'F9':
				e.preventDefault();
				saerk();
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
scrawl.NOTEPAD.addEventListener('click',()=>{
	if(document.getElementById('men-file').classList.contains('show')){
		maenu();
	}
});
ui_men.onclick=()=>{
	maenu();
}
ui_new.onclick=()=>{
	ok(naew);
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
	// scrawl.NOTEPAD.blur();
}
ui_re.onclick=()=>{
	scrawl.undo(true);
	// scrawl.NOTEPAD.blur();
}
ui_b.onclick=()=>{
	// scrawl.biu('**');
	document.execCommand('bold');
}
ui_i.onclick=()=>{
	// scrawl.biu();
	document.execCommand('italic');
}
ui_u.onclick=()=>{
	// scrawl.biu('_');
	document.execCommand('underline');
}
ui_s.onclick=()=>{
	// scrawl.biu('~');
	document.execCommand('strikeThrough');
}
ui_eng.onclick=()=>{
	spelk();
}
ui_num.onclick=()=>{
	alert(scrawl.tally());
}
ui_get.onclick=()=>{
	saerk();
}
ui_see.onclick=()=>{
	lokc();
}
ui_day.onclick=()=>{
	daerk();
}
ui_go.onclick=()=>{
	saen();
}
ui_cfg.onclick=()=>{
	localStorage.Scrawl_CFG='';
}
ui_out.onclick=()=>{
	window.close();
}
// INIT
if(pro()){
	defaet();
}else{
	if(config('init')=='y'){
		/* if(navigator.userAgent.includes('ScrawlDaesk')){
			config('desk','y');
			ui_out.classList.remove('desk');
		} */
		// paey();
		config('init','n');
	}
}
if(config('dark')=='n'){
	document.body.classList.add('day');
}
if(config('desk')=='y'){
	ui_out.classList.remove('desk');
}
ui_un.classList.add('cis');
ui_re.classList.add('cis');
ui_eng.classList.add('cis');
document.getElementById('ui-spell-mobil').classList.add('cis');
ui_get.classList.add('cis');
document.getElementById('ui-find-mobil').classList.add('cis');
naem();
document.body.style.opacity='1';