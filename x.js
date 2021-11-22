'use strict';
const scrawl=new Scrawl();
const SCRoPS={'Δ':0,'dark':false,'haed':'Untitled','post_url':'http://localhost/act.php','post_override_name':'-1.0.13.X'};
const ui_new=document.getElementById('ui-new');
const ui_opn=document.getElementById('ui-open');
const ui_sav=document.getElementById('ui-save');
const ui_prln=document.getElementById('ui-print');
const ui_un=document.getElementById('ui-undo');
const ui_re=document.getElementById('ui-redo');
// const ui_b=document.getElementById('ui-bold');
// const ui_i=document.getElementById('ui-italic');
// const ui_u=document.getElementById('ui-underline');
// const ui_s=document.getElementById('ui-strike');
// const ui_bbc=document.getElementById('ui-bbc');
const ui_eng=document.getElementById('ui-spell');
const ui_num=document.getElementById('ui-words');
const ui_get=document.getElementById('ui-find');
const ui_see=document.getElementById('ui-see');
const ui_day=document.getElementById('ui-dark');
const ui_go=document.getElementById('ui-send');
const ui_cfg=document.getElementById('ui-config');
const ui_wut=document.getElementById('ui-help');
const ui_out=document.getElementById('ui-exit');
function alurt(msg='OK!'){
	const moda=document.createElement('div');
	moda.style.backgroundColor='var(--fg)';
	moda.style.border='var(--bord)';
	moda.style.borderRadius='var(--rad)';
	moda.style.boxShadow='var(--shado)';
	moda.style.color='var(--bg)';
	moda.style.cursor='pointer';
	moda.style.left='50%';
	moda.style.padding='1em';
	moda.style.position='fixed';
	moda.style.top='7%';
	moda.style.transform='translateX(-50%)';
	moda.style.transition='opacity 1s';
	moda.style.userSelect='none';
	moda.style.zIndex='1';
	moda.innerHTML=msg;
	console.log('Alurt: '+msg);
	document.body.appendChild(moda);
	moda.onclick=()=>{
		moda.remove();
	}
	moda.ontransitionend=()=>{
		moda.remove();
	}
	setTimeout(()=>{moda.style.opacity='0'},3000);
}
function bbc(){
	const bbc=scrawl.par2bbc(scrawl.md2htm());
	navigator.clipboard.writeText(bbc);
	alurt('Copied to clipboard . . .');
}
function config(ky,valu){
	if(!localStorage.Scrawl_CFG){
		localStorage.Scrawl_CFG=JSON.stringify(SCRoPS);
	}
	let cfg=JSON.parse(localStorage.Scrawl_CFG);
	if(ky){
		if(valu!=null){
			cfg[ky]=valu;
			localStorage.Scrawl_CFG=JSON.stringify(cfg);
		}else{
			return JSON.parse(localStorage.Scrawl_CFG)[ky];
		}
	}else{
		return cfg;
	}
}
function daerk(){
	if(document.body.classList.contains('day')){
		document.body.classList.remove('day');
		config('dark',true);
	}else{
		document.body.classList.add('day');
		config('dark',false);
	}
}
function duunlob(data,naem='Untitled',taep='text/plain'){
	let a=document.createElement('a');
	let bob=new Blob([data],{type:taep});
	let uri=window.URL.createObjectURL(bob);
	a.style='display:none';
	a.href=uri;
	a.download=naem;
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(uri);
}
function lokc(){
	const bookmark=window.scrollY;
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.NOTEPAD.classList.remove('ugly');
		ui_un.classList.add('cis');
		ui_re.classList.add('cis');
		// ui_eng.classList.add('cis');
		// ui_get.classList.add('cis');
		/* if(scrawl.NOTEPAD.getAttribute('spellcheck')=='true'){
			scrawl.NOTEPAD.style.borderColor='var(--mg)';
		} */
		scrawl.NOTEPAD.style.borderColor='var(--mg)';
		ui_see.textContent='lock';
	}else{
		scrawl.NOTEPAD.classList.add('ugly');
		ui_un.classList.remove('cis');
		ui_re.classList.remove('cis');
		// ui_eng.classList.remove('cis');
		// ui_get.classList.remove('cis');
		if(scrawl.NOTEPAD.getAttribute('spellcheck')=='true'){
			scrawl.NOTEPAD.style.borderColor='var(--ax)';
		}else{
			scrawl.NOTEPAD.style.borderColor='var(--fg)';
		}
		ui_see.textContent='lock_open';
	}
	scrawl.WYSIWYG();
	window.scrollTo(0,bookmark);
	naem();
}
function naem(){
	const h1=scrawl.NOTEPAD.innerHTML.match(/<h1>(.*)<\/h1>/);
	if(h1){
		config('haed',h1[1]);
	}
}
function naew(){
	localStorage.Scrawl_TXT='';
	config('haed',SCRoPS['haed']);
	location.reload();
}
/* function notif(msg=''){
	h='S c r a w l';
	ico='./ico.png';
	if(!window.Notification){
		console.log('Notifications unsupported!');
	}else{
		const noet=new Notification(h,{body:msg,icon:ico});
		if(Notification.permission==='granted'){
			noet;
		}else{
			Notification.requestPermission().then((perm)=>{
				if(perm==='granted'){
					noet;
				}else{
					console.log('Notification blocked by user!');
				}
			}).catch((err)=>{
				console.error(err);
			});
		}
	}
} */
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
	f.style.display='none';
	f.click();
	f.onchange=()=>{
		const bin=f.files[0];
		scrawl.opaen(bin);
	}
}
function prln(){
	if(scrawl.NOTEPAD.contentEditable=='true'){
		lokc();
	}
	window.print();
}
function saen(){
	let post=window.prompt('POST . . .',config('post_override_name'));
	if(post){
		if(scrawl.NOTEPAD.contentEditable=='true'){
			lokc();
		}
		config('post_override_name',post);
		const Formbody=new FormData();
		Formbody.append(0,new Blob([scrawl.md2htm()]),post);
		fetch(config('post_url'),{
			method:'POST',
			body:Formbody
		}).then(
			resp=>resp.text()
		).then(
			resp=>{
				alurt(resp)
			}
		)
	}
}
function saerk(){
	const w=window.prompt('Replace . . .');
	if(w){
		if(scrawl.NOTEPAD.contentEditable=='false'){
			lokc();
		}
		alurt(scrawl.saerk(w));
	}
}
function sav(){
	const txt=localStorage.Scrawl_TXT.replace(/\t/g,'').trim();
	const tyt=config('haed')+'.md';
	duunlob(txt,tyt,'text/markdown');
}
function spelk(){
	if(scrawl.NOTEPAD.contentEditable=='false'&&scrawl.NOTEPAD.getAttribute('spellcheck')=='false'){
		lokc();
	}
	scrawl.spael();
	if(scrawl.NOTEPAD.getAttribute('spellcheck')=='true'){
		scrawl.NOTEPAD.style.borderColor='var(--ax)';
		ui_eng.style.color='var(--ax)';
	}else{
		if(scrawl.NOTEPAD.getAttribute('contenteditable')=='true'){
			scrawl.NOTEPAD.style.borderColor='var(--fg)';
		}else{
			scrawl.NOTEPAD.style.borderColor='var(--mg)';
		}
		ui_eng.style.color=ui_get.style.color;
	}
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
			case'E':e.preventDefault();saen();break;
			case'H':e.preventDefault();saerk();break;
			case'K':e.preventDefault();scrawl.biu('~');break;
			case'L':e.preventDefault();spelk();break;
			case'M':e.preventDefault();const T=new Date();alurt(T.getHours()+':'+T.getMinutes());break;
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
			case'F7':
				e.preventDefault();
				spelk();
				break;
			case'F8':
				e.preventDefault();
				alurt(scrawl.tally());
				break;
			case'F6':
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
// ui_b.onclick=()=>{
// 	// scrawl.biu('**');
// 	document.execCommand('bold');
// }
// ui_i.onclick=()=>{
// 	// scrawl.biu();
// 	document.execCommand('italic');
// }
// ui_u.onclick=()=>{
// 	// scrawl.biu('_');
// 	document.execCommand('underline');
// }
// ui_s.onclick=()=>{
// 	// scrawl.biu('~');
// 	document.execCommand('strikeThrough');
// }
/* ui_bbc.onclick=()=>{
	const bbc=scrawl.par2bbc(scrawl.md2htm());
	navigator.clipboard.writeText(bbc);
	alurt('Copied to clipboard . . .');
	console.log(bbc);
} */
ui_eng.onclick=()=>{
	spelk();
}
ui_num.onclick=()=>{
	alurt(scrawl.tally());
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
	const w=window.prompt('Config . . .',localStorage.Scrawl_CFG);
	if(w){
		if(w===' '||w==='{}'){
			localStorage.Scrawl_CFG=JSON.stringify(SCRoPS);
		}else{
			localStorage.Scrawl_CFG=w;
		}
	}
}
ui_wut.onclick=()=>{
	window.open('https://github.com/Starscade/Scrawl#readme');
}
ui_out.onclick=()=>{
	ok(window.close);
}
// INIT
if(!config('dark')){
	document.body.classList.add('day');
}
naem();
document.body.style.opacity='1';
/* if('serviceWorker'in navigator){
	navigator.serviceWorker.register('work.js');
} */