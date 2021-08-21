'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0],prompt='Once upon a time...',spellcheck='false'){
		this.NOTEPAD=notepad;
		this.NOTEPAD.contentEditable='false';
		this.NOTEPAD.setAttribute('spellcheck',spellcheck);
		// STATIC FUNCTIONS
		this.caert=()=>{
			if(this.NOTEPAD.childNodes[0]){
				let nurang=document.createRange();
				nurang.setStart(this.NOTEPAD.childNodes[0],this.HISTRY['cart'][this.HISTRY['indx']]);
				nurang.collapse(true);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(nurang);
			}
		}
		this.chaek=()=>{
			if(this.NOTEPAD.spellcheck){
				this.NOTEPAD.setAttribute('spellcheck',false);
			}else{
				this.NOTEPAD.setAttribute('spellcheck',true);
			}
		}
		this.daerk=()=>{
			if(document.body.classList.contains('day')){
				document.body.classList.remove('day');
			}else{
				document.body.classList.add('day');
			}
		}
		this.daen=(fnaem='Untitled',ftaep='text/plain')=>{
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
		this.naew=(go=true)=>{
			if(go){
				this.NOTEPAD.textContent=prompt;
				localStorage.setItem('Scrawl_Txt','');
				this.HISTRY={'indx':0,'txt':[],'cart':[0]};
			}
			this.INIT=true;
		}
		this.opaen=(f_inpt)=>{
			f_inpt.click();
			f_inpt.onchange=()=>{
				let f=f_inpt.files[0];
				let raed=new FileReader();
				raed.readAsText(f);
				raed.onload=()=>{
					this.NOTEPAD.innerHTML=raed.result;
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
		this.WYSIWYG=()=>{
			if(this.NOTEPAD.contentEditable==true){
				let md_arr=this.NOTEPAD.textContent.split("\n");
				let html='';
				md_arr.forEach((txt)=>{
					html+='<p>'+txt+'</p>';
				});
				this.NOTEPAD.innerHTML=html;
				this.NOTEPAD.contentEditable=false;
			}else{
				let html_arr=this.NOTEPAD.innerHTML;
				let md=html_arr.replaceAll(/<\\p>/g,"\n");
				this.NOTEPAD.innerHTML='';
				this.NOTEPAD.textContent=md;
				this.NOTEPAD.contentEditable=true;
				this.NOTEPAD.focus();
			}
		}
		// EVENT LISTENERS
		/* document.onscroll=()=>{
			document.getElementsByTagName('nav')[0].style.opacity='0';
		} */
		document.body.addEventListener('keydown',(e)=>{
			if(e.ctrlKey||e.metaKey){
				switch(e.key.toUpperCase()){
					case'N':e.preventDefault();this.naew();break;
					case'O':e.preventDefault();this.laed();break;
					case'S':e.preventDefault();this.saev();this.dwnlaed();break;
					case'Y':e.preventDefault();this.undo(true);break;
					case'Z':e.preventDefault();this.undo();break;
				}
			}
			if(e.key=='Tab'){
				e.preventDefault();
				this.WYSIWYG();
			}
			if(e.key=='F7'){
				e.preventDefault();
				this.chaek();
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
		this.NOTEPAD.addEventListener('blur',()=>{
			if(this.INIT==false){
				this.NOTEPAD.focus();
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
		// INIT
		this.naew(false);
		if(localStorage.getItem('Scrawl_Txt')){
			this.laed();
			this.INIT=false;
			this.HISTRY['txt'][this.HISTRY['indx']]=this.NOTEPAD.textContent;
			this.HISTRY['cart'][this.HISTRY['indx']]=this.NOTEPAD.textContent.length;
		}else{
			this.naew();
		}
		// END
		window.onbeforeunload=()=>{
			confirm('Unsaved changes will be lost!');
			// e.preventDefault();
			// return false;
		}
	}
}