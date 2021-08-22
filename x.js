'use strict';
const scrawl=new Scrawl();
const f=document.getElementsByTagName('input')[0];
const ui_new=document.getElementById('ui-new');
const ui_opn=document.getElementById('ui-open');
const ui_sav=document.getElementById('ui-save');
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
function daerk(){
	if(document.body.classList.contains('day')){
		document.body.classList.remove('day');
		localStorage.setItem('Scrawl_Day','');
	}else{
		document.body.classList.add('day');
		localStorage.setItem('Scrawl_Day','day');
	}
}
document.body.addEventListener('keydown',(e)=>{
	if(e.ctrlKey||e.metaKey){
		switch(e.key.toUpperCase()){
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
				scrawl.daerk();
				break;
		}
	}
});
ui_new.onclick=()=>{
	scrawl.naew();
}
ui_opn.onclick=()=>{
	scrawl.opaen(f);
}
ui_sav.onclick=()=>{
	scrawl.saev();
}
ui_un.onclick=()=>{
	scrawl.undo();
}
ui_re.onclick=()=>{
	scrawl.undo(true);
}
ui_b.onclick=()=>{
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
}
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
ui_drk.onclick=()=>{
	daerk();
}