'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0],prompt='Once upon a time...',spellcheck='false'){
		this.NOTEPAD=notepad;
		this.NOTEPAD.autofocus='true';
		this.NOTEPAD.contentEditable='true';
		this.NOTEPAD.setAttribute('spellcheck',spellcheck);
		this.HISTRY={'indx':0,'txt':[],'cart':[0]};
		this.INIT=true;
		this.caert=()=>{
			if(this.NOTEPAD.childNodes[0]){
				let nurang=document.createRange();
				nurang.setStart(this.NOTEPAD.childNodes[0],this.HISTRY['cart'][this.HISTRY['indx']]);
				nurang.collapse(true);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(nurang);
			}
		}
		this.dwnlaed=(fnaem='Untitled',ftaep='text/plain')=>{
			let a=document.createElement('a');
			let blob=new Blob([this.NOTEPAD.textContent],{type:ftaep});
			let url=window.URL.createObjectURL(blob);
			document.body.appendChild(a);
			a.style='display:none';
			a.href=url;
			a.download=fnaem+'.md';
			a.click();
			window.URL.revokeObjectURL(url);
		},
		this.laed=()=>{
			this.NOTEPAD.textContent=localStorage.getItem('Scrawl_Txt');
		}
		this.raec=()=>{
			this.saev();
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
			this.HISTRY['cart'][this.HISTRY['indx']]=window.getSelection().getRangeAt(0).endOffset;
			if(this.HISTRY['txt'].length>999){
				this.HISTRY['txt'].shift();
				this.HISTRY['cart'].shift();
				this.HISTRY['indx']--;
			}
			console.log(this.HISTRY);
		}
		this.saev=()=>{
			localStorage.setItem('Scrawl_Txt',this.NOTEPAD.textContent);
		}
		this.undo=(re=false)=>{
			let go=false;
			if(re){
				if(this.HISTRY['indx']<(this.HISTRY['txt'].length-1)){
					this.HISTRY['indx']++;
					go=true;
				}
			}else{
				if(this.HISTRY['indx']>0){
					this.HISTRY['indx']--;
					go=true;
				}
			}
			if(go){
				this.NOTEPAD.textContent=this.HISTRY['txt'][this.HISTRY['indx']];
				this.caert();
				this.saev();
			}
		}
		document.body.addEventListener('keydown',(e)=>{
			if(e.ctrlKey||e.metaKey){
				switch(e.key.toUpperCase()){
					case'O':e.preventDefault();this.laed(e);break;
					case'S':e.preventDefault();this.saev(e);this.dwnlaed();break;
					case'Y':e.preventDefault();this.undo(true);break;
					case'Z':e.preventDefault();this.undo();break;
				}
			}
		});
		this.NOTEPAD.addEventListener('beforeinput',(e)=>{
			let txt;
			let rng=window.getSelection().getRangeAt(0).toString();
			switch(e.inputType){
				case'formatBold':
					e.preventDefault();
					if(rng==''){
						txt='**';
					}else{
						txt='**'+rng+'**';
					}
					document.execCommand('insertText',false,txt);
					break;
				case'formatItalic':
					e.preventDefault();
					if(rng==''){
						txt='*';
					}else{
						txt='*'+rng+'*';
					}
					document.execCommand('insertText',false,txt);
					break;
				case'formatUnderline':
					e.preventDefault();
					if(rng==''){
						txt='_';
					}else{
						txt='_'+rng+'_';
					}
					document.execCommand('insertText',false,txt);
					break;
				case'insertParagraph':
					e.preventDefault();
					document.execCommand('insertHTML',false,"\n\t");
					break;
			}
		});
		this.NOTEPAD.addEventListener('cut',()=>{
			this.raec();
		});
		this.NOTEPAD.addEventListener('focus',()=>{
			if(this.INIT){
				this.NOTEPAD.textContent='# ';
				this.INIT=false;
				this.HISTRY['txt'][this.HISTRY['indx']]=this.NOTEPAD.textContent;
				this.HISTRY['cart'][this.HISTRY['indx']]=this.NOTEPAD.textContent.length;
			}
			this.caert();
		});
		this.NOTEPAD.addEventListener('input',()=>{
			this.raec();
		});
		if(localStorage.getItem('Scrawl_Txt')){
			this.laed();
			this.INIT=false;
			this.HISTRY['txt'][this.HISTRY['indx']]=this.NOTEPAD.textContent;
			this.HISTRY['cart'][this.HISTRY['indx']]=this.NOTEPAD.textContent.length;
		}else{
			this.NOTEPAD.textContent=prompt;
		}
		window.onbeforeunload=()=>{
			confirm('Unsaved changes will be lost!');
			// e.preventDefault();
			// return false;
		}
	}
}