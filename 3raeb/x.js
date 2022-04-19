'use strict';
const nib=new Nib();
const jig=new Jig(nib);
const contex=document.getElementById('contex');
function alurt(msg='OK!'){
	const moda=document.createElement('div');
	moda.classList.add('alurt');
	moda.textContent=msg;
	console.log('Alurt: '+msg);
	document.body.appendChild(moda);
	moda.onclick=()=>{
		moda.remove();
	}
	moda.ontransitionend=()=>{
		moda.remove();
	}
	setTimeout(()=>{moda.style.opacity='0'},2000);
}
function day(){
	let rgb='#333';
	if(jig.cfg('dark')){
		jig.cfg('dark',false);
		rgb='#eee';
	}else{
		jig.cfg('dark',true);
	}
	document.body.parentElement.classList.toggle('day');
	document.querySelector("meta[name=theme-color]").setAttribute("content",rgb);
}
function dinosaur(w=''){
	if(!w){
		w=window.getSelection().toString();//.split(' ')[0];
	}
	window.open(jig.cfg('word_url')+w);
}
function lokc(){
	nib.swop();
	nib.NOTEPAD.classList.toggle('lokc');
}
function neu(){
	nib.memry(jig.cfg('promp'));
	location.reload();
}
function opin(ti=null){
	if(ti){
		jig.lod(ti);
	}else{
		const f=document.createElement('input');
		f.type='file';
		f.setAttribute('accept','.htm,.html,.md,.txt');
		document.body.appendChild(f);
		f.style.display='none';
		f.click();
		f.onchange=()=>{
			const bin=f.files[0];
			jig.lod(bin);
		}
	}
}
function prln(){
	if(nib.iswet()){
		lokc();
	}
	window.print();
}
function rush(albak,arg){
	const promp=window.confirm('Unsaved changes will be lost!');
	if(promp){
		albak(arg);
	}
}
function saef(as=false){
	jig.sav(as,()=>{alurt('Saved')});
}
function tally(){
	alurt(nib.tally());
}
document.body.addEventListener('click',e=>{
	contex.style.display='none';
});
document.body.addEventListener('contextmenu',e=>{
	if(nib.iswet()){
		contex.style.display='block';
		if(window.innerHeight<window.innerWidth){
			contex.style.left=(e.clientX+24)+'px';
			contex.style.top=(e.clientY+24)+'px';
		}
	}
});
document.body.addEventListener('keydown',e=>{
	if(e.ctrlKey||e.metaKey){
		if(e.key.toUpperCase()=='S'){
			e.preventDefault();
			if(e.shiftKey){
				saef(true);
			}else{
				saef();
			}
		}
		if(!(nib.iswet())){
			if(e.key.toUpperCase()=='C'){
				e.preventDefault();
				if(e.shiftKey){
					nib.cop('HTML');
					alurt('Copied to clipboard . . . (HTML)');
				}else{
					nib.cop('BBC');
					alurt('Copied to clipboard . . . (BBC)');
				}
			}
		}
		switch(e.key.toUpperCase()){
			case'N':e.preventDefault();rush(neu);break;
			case'O':e.preventDefault();opin();break;
			case'P':e.preventDefault();prln();break;
			case'T':e.preventDefault();tally();break;
			case'Y':e.preventDefault();nib.undo(true);break;
			case'Z':e.preventDefault();nib.undo();break;
			case'=':case'-':case'_':case'+':e.preventDefault();break;
		}
	}else{
		switch(e.key){
			case'Tab':e.preventDefault();lokc();break;
			case'F9':e.preventDefault();day();break;
		}
	}
});
document.body.addEventListener('scroll',()=>{
	contex.style.display='none';
});
document.body.parentElement.addEventListener('dragover',e=>{
	e.preventDefault();
});
document.body.parentElement.addEventListener('drop',e=>{
	e.preventDefault();
	if(nib.NOTEPAD.textContent===jig.cfg('promp')){
		opin(e.dataTransfer.items[0].getAsFile());
	}else{
		const ti=e.dataTransfer.items[0].getAsFile();
		rush(opin,ti);
	}
});
// INIT
if(jig.cfg('dark')){
	document.body.parentElement.classList.toggle('day');
	document.querySelector("meta[name=theme-color]").setAttribute("content",'#333');
}
if(nib.memry()!==jig.cfg('promp')){
	lokc();
}
document.body.style.opacity=1;
setTimeout(()=>{
	document.getElementsByTagName('nav')[0].style.opacity=0;
},1234);
