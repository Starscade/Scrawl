'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0],prompt='Once upon a time...',spellcheck='false'){
		this.NOTEPAD=notepad;
		this.NOTEPAD.contentEditable='false';
		this.NOTEPAD.setAttribute('spellcheck',spellcheck);
		this.INIT=true;
		this.RANG='';
		// STATIC FUNCTIONS
		this.biu=(g='*')=>{
			let txt;
			if(this.RANG==''){
				txt=g;
			}else{
				txt=g+this.RANG+g;
			}
			document.execCommand('insertText',false,txt);
		}
		this.caert=()=>{
			if(this.NOTEPAD.childNodes[0]){
				let nurang=document.createRange();
				let olrang=this.HISTRY['cart'][this.HISTRY['indx']];
				nurang.setStart(this.NOTEPAD.childNodes[0],olrang[0]);
				nurang.setEnd(this.NOTEPAD.childNodes[0],olrang[1]);
				nurang.collapse(false);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(nurang);
			}
		}
		this.laed=(set_txt=true)=>{
			let txt=localStorage.getItem('Scrawl_Txt');
			if(set_txt){
				this.NOTEPAD.textContent=txt;
			}else{
				this.NOTEPAD.innerHTML=txt;
			}
		}
		this.md2htm=()=>{
			let htm=this.NOTEPAD.textContent.replaceAll(/\n/g,'<br>');
			// this.NOTEPAD.innerHTML=htm;
		}
		this.naew=(go=true)=>{
			this.WYSIWYG();
			if(go){
				this.INIT=true;
				this.NOTEPAD.textContent=prompt;
				localStorage.setItem('Scrawl_Txt','');
			}
			this.HISTRY={'indx':0,'txt':[],'cart':[0,0]};
			if(localStorage.getItem('Scrawl_Day')){
				document.body.classList.add(localStorage.getItem('Scrawl_Day'));
			}
		}
		this.opaen=(f_inpt)=>{
			f_inpt.click();
			f_inpt.onchange=()=>{
				let f=f_inpt.files[0];
				let raed=new FileReader();
				raed.readAsText(f);
				raed.onload=()=>{
					this.NOTEPAD.innerHTML=raed.result;
					this.stoar();
					this.WYSIWYG();
				}
			}
		}
		this.raec=()=>{
			this.stoar();
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
			let selec=window.getSelection().getRangeAt(0);
			this.HISTRY['cart'][this.HISTRY['indx']]=[selec.startOffset,selec.endOffset];
			if(this.HISTRY['txt'].length>999){
				this.HISTRY['txt'].shift();
				this.HISTRY['cart'].shift();
				this.HISTRY['indx']--;
			}
		}
		this.saev=(fnaem='My_Working_Title.md',ftaep='text/plain')=>{
			let a=document.createElement('a');
			let blob=new Blob([this.NOTEPAD.textContent],{type:ftaep});
			let url=window.URL.createObjectURL(blob);
			document.body.appendChild(a);
			a.style='display:none';
			a.href=url;
			if(fnaem){
				a.download=fnaem;
				a.click();
			}
			window.URL.revokeObjectURL(url);
		}
		this.spael=()=>{
			if(this.NOTEPAD.spellcheck){
				this.NOTEPAD.setAttribute('spellcheck',false);
			}else{
				this.NOTEPAD.setAttribute('spellcheck',true);
			}
		}
		this.stoar=()=>{
			localStorage.setItem('Scrawl_Txt',this.NOTEPAD.textContent);
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
					if(this.HISTRY['indx']>0){
						this.HISTRY['indx']--;
						go=true;
					}
				}
				if(go){
					this.NOTEPAD.textContent=this.HISTRY['txt'][this.HISTRY['indx']];
					this.caert();
					this.stoar();
				}
			}
		}
		this.woun=()=>{
			let wordz=this.NOTEPAD.textContent.split(/\S+/).length-1;
			alert('There are '+wordz+' words.');
		}
		this.WYSIWYG=()=>{
			if(this.NOTEPAD.contentEditable=='true'){
				this.NOTEPAD.contentEditable='false';
				this.NOTEPAD.classList.remove('as-is');
				this.md2htm();
			}else{
				this.innerHTML=localStorage.getItem('Scrawl_Txt');
				this.NOTEPAD.classList.add('as-is');
				this.NOTEPAD.contentEditable='true';
				this.NOTEPAD.focus();
			}
		}
		// EVENT LISTENERS
		this.NOTEPAD.addEventListener('beforeinput',(e)=>{
			switch(e.inputType){
				case'formatBold':
					e.preventDefault();
					this.biu('**');
					break;
				case'formatItalic':
					e.preventDefault();
					this.biu('*');
					break;
				case'formatUnderline':
					e.preventDefault();
					this.biu('_');
					break;
				case'formatStrikethrough':
					e.preventDefault();
					this.biu('~');
					break;
				case'insertParagraph':
					e.preventDefault();
					document.execCommand('insertHTML',false,"\n\t");
					break;
			}
		});
		this.NOTEPAD.addEventListener('blur',()=>{
			if(!this.INIT){
				this.NOTEPAD.focus();
			}
		});
		this.NOTEPAD.addEventListener('click',()=>{
			if(this.INIT){
				this.WYSIWYG();
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
				this.HISTRY['cart'][this.HISTRY['indx']]=[this.NOTEPAD.textContent.length,this.NOTEPAD.textContent.length];
			}
			this.caert();
		});
		this.NOTEPAD.addEventListener('input',()=>{
			this.raec();
		});
		this.NOTEPAD.addEventListener('paste',()=>{
			this.raec();
		});
		this.NOTEPAD.addEventListener('mouseup',()=>{
			this.RANG=window.getSelection().getRangeAt(0);
		})
		// INIT
		this.naew(false);
		if(localStorage.getItem('Scrawl_Txt')){
			this.INIT=false;
			this.laed();
			this.HISTRY['txt'][this.HISTRY['indx']]=this.NOTEPAD.textContent;
			this.HISTRY['cart'][this.HISTRY['indx']]=[this.NOTEPAD.textContent.length,this.NOTEPAD.textContent.length];
		}else{
			this.naew();
		}
		if(localStorage.getItem('Scrawl_Day')==''){
			document.body.classList.remove('day');
		}
		// END
		window.onbeforeunload=()=>{
			confirm('Unsaved changes will be lost!');
			// e.preventDefault();
			// return false;
		}
	}
}