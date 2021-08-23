'use strict';
const scrawl=new Scrawl();
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
const ui_go=document.getElementById('ui-send');
const ui_cfg=document.getElementById('ui-config');
// const ui_drk=document.getElementById('ui-dark');
let ops=scrops;//JSON.parse(document.getElementById('ops').innerHTML);;
function config(ky,valu){
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
}
function init(c){
	if(c['dark']==true){
		document.body.classList.remove('day');
	}else{
		if(!document.body.classList.contains('day')){
			document.body.classList.remove('day');
		}
	}
	document.title=ops['name'];
}
function ok(albak,argz,msg='Unsaved changes will be lost! Proceed?'){
	let ok=confirm(msg);
	if(ok){
		albak(argz);
	}
}
function saen(){
	let data='';
	Object.keys(ops['S2xAPI']['data']).forEach(k=>{
		data+='    '+k+' --> '+ops['S2xAPI']['data'][k]+"\n";
	});
	ok(alert,'','Custom data to be sent to "'+ops['S2xAPI']['apiurl']+"\":\n\n"+data);
}
document.body.addEventListener('keydown',(e)=>{
	if(e.ctrlKey||e.metaKey){
		switch(e.key.toUpperCase()){
			case'E':e.preventDefault();saen();break;
			// case'N':e.preventDefault();scrawl.naew();break;
			case'O':e.preventDefault();scrawl.opaen(f);break;
			case'S':e.preventDefault();scrawl.saev();scrawl.dwnlaed();break;
			// case'W':e.preventDefault();scrawl.wcoun();break;
			case'Y':e.preventDefault();scrawl.undo(true);break;
			case'Z':e.preventDefault();scrawl.undo();break;
		}
	}else{
		switch(e.key){
			case'Tab':
				e.preventDefault();
				scrawl.WYSIWYG();
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
		}
	}
});
ui_new.onclick=()=>{
	ok(scrawl.naew);
}
ui_opn.onclick=()=>{
	ok(scrawl.opaen,f);
}
ui_sav.onclick=()=>{
	// scrawl.saev();
	let fnaem=window.prompt('Please enter a filename...',ops['name']);
	if(fnaem){
		scrawl.saev(fnaem);
	}
}
ui_prln.onclick=()=>{
	if(scrawl.NOTEPAD.contentEditable=='true'){
		scrawl.WYSIWYG();
	}
	window.print();
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
	scrawl.WYSIWYG();
}
ui_go.onclick=()=>{
	saen();
}
/* ui_drk.onclick=()=>{
	daerk();
} */
ui_cfg.onclick=()=>{
	let cfg=window.prompt('JSON Configuration...',JSON.stringify(ops));
	if(cfg){
		console.log(cfg);
		localStorage.setItem('Scrawl_CFG',cfg);
		ops=JSON.parse(cfg);
		config();
	}
}
config();