'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0],prompt='Once upon a time...',spellcheck='false'){
		this.NOTEPAD=notepad;
		this.NOTEPAD.contentEditable='false';
		this.NOTEPAD.setAttribute('spellcheck',spellcheck);
		this.RNG='';
		// STATIC FUNCTIONS
		this.biu=(g='*')=>{
			let txt;
			if(this.RNG==''){
				txt=g;
			}else{
				txt=g+this.RNG+g;
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
		this.daerk=()=>{
			if(document.body.classList.contains('day')){
				document.body.classList.remove('day');
				localStorage.setItem('Scrawl_Day','');
			}else{
				document.body.classList.add('day');
				localStorage.setItem('Scrawl_Day','day');
			}
		}
		this.daen=(ftaep='text/plain')=>{
			let fnaem=window.prompt('Please enter a filename...','My_Working_Title.md');
			let a=document.createElement('a');
			let blob=new Blob([this.NOTEPAD.textContent],{type:ftaep});
			let url=window.URL.createObjectURL(blob);
			document.body.appendChild(a);
			a.style='display:none';
			a.href=url;
			if(fnaem){
				a.download=fnaem;
				a.click();
			}else{
				alert('Not saved!');
			}
			window.URL.revokeObjectURL(url);
		},
		this.laed=()=>{
			this.NOTEPAD.textContent=localStorage.getItem('Scrawl_Txt');
		}
		this.md2htm=()=>{
			let htm=this.NOTEPAD.textContent.replaceAll(/\n/g,'<br>');
			// this.NOTEPAD.innerHTML=htm;
		}
		this.naew=(go=true)=>{
			if(go){
				this.NOTEPAD.contentEditable='false';
				this.NOTEPAD.textContent=prompt;
				localStorage.setItem('Scrawl_Txt','');
			}
			this.HISTRY={'indx':0,'txt':[],'cart':[0,0]};
			if(localStorage.getItem('Scrawl_Day')){
				document.body.classList.add(localStorage.getItem('Scrawl_Day'));
			}
			this.INIT=true;
		}
		this.opaen=(f_inpt=document.getElementById('scrawl-inpt-f'))=>{
			this.WYSIWYG();
			f_inpt.click();
			f_inpt.onchange=()=>{
				let f=f_inpt.files[0];
				let raed=new FileReader();
				raed.readAsText(f);
				raed.onload=()=>{
					this.NOTEPAD.innerHTML=raed.result;
					this.saev();
				}
			}
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
			let selec=window.getSelection().getRangeAt(0);
			console.log(selec);
			this.HISTRY['cart'][this.HISTRY['indx']]=[selec.startOffset,selec.endOffset];
			if(this.HISTRY['txt'].length>999){
				this.HISTRY['txt'].shift();
				this.HISTRY['cart'].shift();
				this.HISTRY['indx']--;
			}
		}
		this.saev=()=>{
			localStorage.setItem('Scrawl_Txt',this.NOTEPAD.textContent);
		}
		this.spael=()=>{
			if(this.NOTEPAD.spellcheck){
				this.NOTEPAD.setAttribute('spellcheck',false);
			}else{
				this.NOTEPAD.setAttribute('spellcheck',true);
			}
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
					this.saev();
				}
			}
		}
		this.woun=()=>{
			let wordz=this.NOTEPAD.textContent.split(/\S+/).length-1;
			alert('There are '+wordz+' words.');
		}
		this.WYSIWYG=(n=true)=>{
			if(this.NOTEPAD.contentEditable=='true'){
				if(n){
					this.NOTEPAD.contentEditable='false';
					this.NOTEPAD.style.fontFamily='HTML';
					this.NOTEPAD.classList.remove('just');
					this.md2htm();
				}
			}else{
				this.NOTEPAD.contentEditable='true';
				this.innerHTML=localStorage.getItem('Scrawl_Txt');
				this.NOTEPAD.style.fontFamily='Markdown';
				this.NOTEPAD.classList.add('just');
				this.NOTEPAD.focus();
			}
		}
		// EVENT LISTENERS
		document.body.addEventListener('keydown',(e)=>{
			if(e.ctrlKey||e.metaKey){
				switch(e.key.toUpperCase()){
					// case'N':e.preventDefault();this.naew();break;
					case'O':e.preventDefault();this.opaen();break;
					case'S':e.preventDefault();this.saev();this.dwnlaed();break;
					// case'W':e.preventDefault();this.wcoun();break;
					case'Y':e.preventDefault();this.undo(true);break;
					case'Z':e.preventDefault();this.undo();break;
				}
			}else{
				switch(e.key){
					case'Tab':
						e.preventDefault();
						this.WYSIWYG();
						break;
					case'F7':
						e.preventDefault();
						this.spael();
						break;
					case'F8':
						e.preventDefault();
						this.woun();
						break;
					case'F10':
						e.preventDefault();
						this.daerk();
						break;
				}
			}
		});
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
				this.WYSIWYG(false);
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
			this.RNG=window.getSelection().getRangeAt(0);
			console.log(this.RNG);
		})
		// INIT
		this.naew(false);
		if(localStorage.getItem('Scrawl_Txt')){
			this.laed();
			this.INIT=false;
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