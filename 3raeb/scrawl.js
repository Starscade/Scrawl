'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0]){
		const nib=new Nib(notepad);
		const uke=new Uke();
		this.NOTEPAD=nib.NOTEPAD;
	}
}
class Nib{
	constructor(notepad=document.getElementsByTagName('article')[0]){
		this.NOTEPAD=notepad;
		this.NOTEPAD.contentEditable=true;
		this.NOTEPAD.spellcheck=false;
		this.HISTRY={'txt':[' '],'indx':0,'cart':[[0,0]]}
		this.ID=this.NOTEPAD.id;
		this.RANG=[0,0];
		this.biu=(g='*')=>{
			const rang=this.NOTEPAD.textContent.slice(this.RANG[0],this.RANG[1]);
			let txt;
			let keep_rang=false;
			if(rang.length>0){
				if(rang.startsWith(g)){
					if(rang===g){
						txt='';
					}else{
						txt=rang.substring(g.length,rang.length-g.length);
					}
				}else{
					txt=g+rang+g;
				}
			}else{
				txt=g;
				keep_rang=true;
			}
			this.xom(txt,keep_rang);
		}
		this.cart=(pos=null)=>{
			if(pos){
				this.RANG=[pos[0],pos[1]];
			}
			const selec=window.getSelection();
			const rang=document.createRange();
			rang.setStart(this.NOTEPAD.childNodes[0],this.RANG[0]);
			rang.setEnd(this.NOTEPAD.childNodes[0],this.RANG[1]);
			selec.removeAllRanges();
			selec.addRange(rang);
		}
		this.mov=()=>{
			const rex=window.getSelection().getRangeAt(0).getClientRects()[0]['top'];
			const pos=Math.round(window.scrollY+rex)-(window.innerHeight/3);
			window.scrollTo(0,pos);
		}
		this.nix=(rec)=>{
			if(this.RANG[0]===this.RANG[1]){
				if(this.RANG[0]>0){
					this.RANG[0]--;
				}
			}
			this.xom('',true,rec);
		}
		this.raec=()=>{
			localStorage.Scrawl_TXT=this.NOTEPAD.textContent;
			if(this.HISTRY['indx']<(this.HISTRY['txt'].length-1)){
				let oldTxt=this.HISTRY['txt'].splice(this.HISTRY['indx']);
				let oldCart=this.HISTRY['cart'].splice(this.HISTRY['indx']);
				this.HISTRY['txt']=this.HISTRY['txt'].concat(oldTxt);
				oldTxt.pop();
				oldTxt.reverse();
				this.HISTRY['txt']=this.HISTRY['txt'].concat(oldTxt);
				this.HISTRY['cart']=this.HISTRY['cart'].concat(oldCart);
				oldCart.pop();
				oldCart.reverse();
				this.HISTRY['cart']=this.HISTRY['cart'].concat(oldCart);
				this.HISTRY['indx']=this.HISTRY['txt'].length;
			}else{
				this.HISTRY['indx']++;
			}
			this.HISTRY['txt'][this.HISTRY['indx']]=this.NOTEPAD.textContent;
			this.HISTRY['cart'][this.HISTRY['indx']]=this.RANG;
			if(this.HISTRY['txt'].length>99){
				this.HISTRY['txt'].shift();
				this.HISTRY['cart'].shift();
				this.HISTRY['indx']--;
			}
			console.log(this.HISTRY);
		}
		this.selmod=(scope='word')=>{
			window.getSelection().modify('move','backward',scope);
			window.getSelection().modify('extend','forward',scope);
			const selec=window.getSelection();
			const rang=selec.getRangeAt(0);
			const nurang=document.createRange();
			let beg=0;
			let nd=0;
			if(selec.toString()[0]=='	'){
				beg=1;
			}
			if(selec.toString()[selec.toString().length-1]==' '){
				nd=1;
			}
			nurang.setStart(this.NOTEPAD.childNodes[0],rang.startOffset+beg);
			nurang.setEnd(this.NOTEPAD.childNodes[0],rang.endOffset-nd);
			selec.removeAllRanges();
			selec.addRange(nurang);
			this.cart([nurang.startOffset,nurang.endOffset]);
		}
		this.undo=(re=false)=>{
			if(this.NOTEPAD.contentEditable=='true'){
				let go=false;
				if(re){
					if(this.HISTRY['indx']<(this.HISTRY['txt'].length-1)){
						this.HISTRY['indx']++;
						go=true;
					}
				}else{
					if(this.HISTRY['indx']>1){
						this.HISTRY['indx']--;
						go=true;
					}
				}
				if(go){
					localStorage.Scrawl_TXT=this.HISTRY['txt'][this.HISTRY['indx']];
					this.NOTEPAD.textContent=localStorage.Scrawl_TXT;
					this.cart(this.HISTRY['cart'][this.HISTRY['indx']]);
					this.mov();
				}
			}
		}
		this.xom=(txt='',keep_rang=true,rec=true)=>{
			if(this.NOTEPAD.contentEditable=='true'){
				this.NOTEPAD.textContent=this.NOTEPAD.textContent.slice(0,this.RANG[0])+txt+this.NOTEPAD.textContent.slice(this.RANG[1]).replace(/\s+$/,'')+' ';
				if(keep_rang){
					this.RANG=[this.RANG[0]+txt.length,this.RANG[0]+txt.length];
				}else{
					this.RANG[1]=this.RANG[0]+txt.length;
				}
				this.cart();
				if(rec){
					this.raec();
				}
			}
		}
		this.NOTEPAD.addEventListener('beforeinput',e=>{
			e.preventDefault();
			// alurt(e.inputType+': '+e.data+' ('+this.RANG[0]+','+this.RANG[1]+')');
			switch(e.inputType){
				case'deleteByCut':this.raec();
				case'deleteContentBackward':this.nix();break;
				case'formatBold':this.biu('**');break;
				case'formatItalic':this.biu();break;
				case'formatUnderline':this.biu('_');break;
				case'formatStrikethrough':this.biu('~');break;
				// case'insertFromDrop':this.xom(e.dataTransfer.getData('text'));break;
				case'insertFromPaste':navigator.clipboard.readText().then(txt=>this.xom(txt,false));break;
				case'insertParagraph':this.xom("\n\t");break;
				case'insertReplacementText':this.selmod();this.raec();this.nix(false);this.xom(e.dataTransfer.getData('text'),false);break;
				case'insertText':this.xom(e.data);break;
			}
			this.mov();
		});
		this.NOTEPAD.addEventListener('blur',()=>{
			this.NOTEPAD.focus();
		});
		this.NOTEPAD.addEventListener('contextmenu',e=>{
			if(this.RANG[0]===this.RANG[1]){
				this.selmod();
			}
		});
		this.NOTEPAD.addEventListener('dblclick',e=>{
			this.selmod('sentence');
		});
		this.NOTEPAD.addEventListener('input',e=>{
			e.preventDefault();
			if(e.inputType==='insertCompositionText'){
				const up1=1+this.RANG[1];
				this.cart([up1,up1]);
				this.raec();
				console.log(e);
			}
		});
		document.addEventListener('selectionchange',()=>{
			const selec=window.getSelection().getRangeAt(0);
			this.RANG=[selec.startOffset,selec.endOffset];
		});
		this.NOTEPAD.textContent=localStorage.Scrawl_TXT;
		this.NOTEPAD.focus();
	}
}
class Uke{
	constructor(){
		this.SCROPS={'Δ':0,'author':'Angus "Starscade" Sheehan','comment':'https://starsca.de/','dark':false,'intro':true,'max_undo':99,'post_alias':'','post_url':'http://localhost/act.php','promp':'	# ','word_url':'https://www.merriam-webster.com/thesaurus/'};
		this.cfg=(ky,valu)=>{
			if(!localStorage.Scrawl_CFG){
				localStorage.Scrawl_CFG=JSON.stringify(this.SCROPS);
			}
			const cfg=JSON.parse(localStorage.Scrawl_CFG);
			if(ky){
				if(valu!=null){
					cfg[ky]=valu;
					localStorage.Scrawl_CFG=JSON.stringify(cfg);
				}else{
					return cfg[ky];
				}
			}else{
				if(localStorage.Scrawl_CFG!==JSON.stringify(this.SCROPS)){
					Object.keys(this.SCROPS).forEach((i,x)=>{
						if(!(i in cfg)){
							cfg[i]=this.SCROPS[i];
						}
					});
					Object.keys(cfg).forEach((i,x)=>{
						if(!(i in this.SCROPS)){
							delete cfg[i];
						}
					});
					localStorage.Scrawl_CFG=JSON.stringify(cfg);
				}
				return cfg;
			}
		}
	}
}