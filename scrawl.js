'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0]){
		this.NOTEPAD=notepad;
		this.NOTEPAD.contentEditable='true';
		this.NOTEPAD.spellcheck='true';
		this.HISTRY={'max':1048576,'indx':0,'cart':[0,0],'txt':['']};
		this.RANG=[0,0];
		this.REGX={'htm2md':[
			[
				/<a ([^>]*)>(.*)<\/a>/g,
				/<\/*b>/g,
				/<blockquote>(.*)<\/blockquote>/g,
				/<br>/g,
				/ . . . /g,
				/<\/*em>/g,
				/<h1>(.*)<\/h1>/g,
				/<h3>✶ ✶ ✶<\/h3>/g,
				/<hr>/g,
				/<\/*i>/g,
				/<p>/g,
				/<\/p>/g,
				/<\/*strong>/g,
				/&amp;/g,
				/—/g,
				/“/g,
				/”/g,
				/‘/g,
				/’/g
			],[
				'<# $2>',
				'**',
				"\t\t> $1",
				"\t\n",
				'...',
				'*',
				"\t# $1\n",
				"\t***\n",
				'===',
				'*',
				"\t",
				"\n",
				'**',
				'&',
				'--',
				'"',
				'"',
				'`',
				"'"
			]
		],'md2htm':[
			[
				/<script([^>]*)>(.*)<\/script>/g,
				/\*\*\*/g,
				/===/g,
				/\.\.\./g,
				/\*\*([^*]*)\*\*/g,
				/\*([^*]*)\*/g,
				/_([^_]*)_/g,
				/~([^~]*)~/g,
				/`([^`]*)`/g,
				/(?<![=/])"([^"]*)"/g,
				// /"/g,
				/'/g,
				/--/g,
				/\s\s+/g,
				/<([\w.]*)@(\w*)\.(\w*)>/g,
				/<([\w#!:.,?+=&%@!\-\/]*) ([^>]*) _>/g,
				/<(?!a href)([\w#!:.,?+=&%@!\-\/]*) ([^>]*)>/g
			],[
				'<code>$1</code>',
				'<h3>✶ ✶ ✶</h3>',
				'<hr>',
				' . . . ',
				'<b>$1</b>',
				'<i>$1</i>',
				'<u>$1</u>',
				'<s>$1</s>',
				'‘$1’',
				'“$1”',
				// '”',
				'’',
				'—',
				' ',
				'<a href="mailto:$1@$2.$3">$1@$2.$3</a>',
				'<a href="$1"target="_Blank">$2</a>',
				'<a href="$1">$2</a>'
				]
			],'par2bbc':[
				[
					/</g,
					/>/g,
					/strong\]/g,
					/em\]/g,
					/\[h1\](.*?)\[\/h1\]/g,
					/\[h3\]✶ ✶ ✶\[h3\]/g,
					/\[br\]/g,
					/\[p\]/g,
					/\[\/p\]/g
				],[
					'[',
					']',
					'b]',
					'i]',
					"[c]$1[/c]",
					'[c]✶ ✶ ✶[/c]',
					"\n",
					"\n",
					''
				]
			]
		}
		// FUNCTIONS
		this.biu=(g='*')=>{
			const rang=this.NOTEPAD.textContent.slice(this.RANG[0],this.RANG[1]);
			let txt;
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
			}
			this.xom(txt,false);
		}
		this.cart=(pos=null)=>{
			if(!this.NOTEPAD.childNodes[0]){
				this.NOTEPAD.append(document.createTextNode(''));
			}
			const selec=window.getSelection();
			const rang=document.createRange();
			if(pos){
				this.RANG=[pos[0],pos[1]];
			}
			rang.setStart(this.NOTEPAD.childNodes[0],this.RANG[0]);
			rang.setEnd(this.NOTEPAD.childNodes[0],this.RANG[1]);
			selec.removeAllRanges();
			selec.addRange(rang);
		}
		this.nix=()=>{
			if(this.RANG[0]===this.RANG[1]){
				if(this.RANG[0]>0){
					this.RANG[0]--;
				}
			}
			this.xom();
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
			// const b=new Blob([this.HISTRY['txt']]).size;
			if(this.HISTRY['txt'].length>99){
				this.HISTRY['txt'].shift();
				this.HISTRY['cart'].shift();
				this.HISTRY['indx']--;
			}
			console.log(this.HISTRY);
		}
		this.saerk=(wurdz)=>{
			if(this.NOTEPAD.contentEditable=='true'){
				const w=wurdz.split('|');
				const rx=new RegExp('\\b'+w[0]+'\\b','g');
				const k=[...this.NOTEPAD.innerHTML.matchAll(rx)].length;
				this.NOTEPAD.innerHTML=this.NOTEPAD.innerHTML.replaceAll(rx,w[1]);
				this.raec();
				return'Replaced '+k+' occurrences . . .';
			}else{
				return'Cannot make changes in HTML mode.';
			}
		}
		this.tally=()=>{
			let txt='';
			if(window.getSelection().toString().length>0){
				txt=this.x2m(window.getSelection().toString());
			}else{
				txt=this.x2m();
			}
			const wurdz=txt.split(/ +/).length-1;
			return wurdz+' spaces';
		}
		this.undo=(re=false)=>{
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
				this.NOTEPAD.textContent=this.HISTRY['txt'][this.HISTRY['indx']];
				this.RANG=this.HISTRY['cart'][this.HISTRY['indx']];
				this.cart();
				localStorage.Scrawl_TXT=this.NOTEPAD.textContent;
			}
		}
		this.x2m=(txt=localStorage.Scrawl_TXT,regx='md2htm')=>{
			if(regx==='md2htm'){
				let htm='';
				const mdarr=txt.trim().split(/\n/g,);
				mdarr.forEach((line,i)=>{
					mdarr[i]=line.trim();
					switch(mdarr[i][0]){
						case'#':
							mdarr[i]=mdarr[i].replace(/^#\s*(.*)/g,'<h1>$1</h1>');
							break;
						case'>':
							mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<blockquote>$1</blockquote>');
							break;
						case'=':
							if(mdarr[i]=='==='){
								mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<hr>');
								break;
							}
						case'*':
							if(mdarr[i]=='***'){
								mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<h3>✶ ✶ ✶</h3>');
								break;
							}
						default:
							if(mdarr[i]==''){
								mdarr[i]='<br>';
							}else{
								mdarr[i]=mdarr[i].replace(/(.*)/g,'<p>$1</p>').replace(/<p><\/p>/g,'');
							}
					}
					this.REGX[regx][0].forEach((p,x)=>{
						mdarr[i]=mdarr[i].replace(p,this.REGX[regx][1][x]);
					});
					htm+=mdarr[i];
				});
				txt=htm;
			}else{
				this.REGX[regx][0].forEach((p,x)=>{
					txt=txt.replace(p,this.REGX[regx][1][x]);
				});
			}
			return txt.trim();
		}
		this.xom=(txt='',x=true)=>{
			this.NOTEPAD.textContent=this.NOTEPAD.textContent.slice(0,this.RANG[0])+txt+this.NOTEPAD.textContent.slice(this.RANG[1]);
			if(x){
				this.RANG=[this.RANG[0]+txt.length,this.RANG[0]+txt.length];
			}else{
				this.RANG[1]=this.RANG[0]+txt.length;
			}
			this.cart();
			this.raec();
		}
		// EVENTS
		this.NOTEPAD.addEventListener('beforeinput',e=>{
			// console.log(e);
			e.preventDefault();
			switch(e.inputType){
				case'deleteByCut':
				case'deleteContentBackward':this.nix();break;
				case'formatBold':this.biu('**');break;
				case'formatItalic':this.biu();break;
				case'formatUnderline':this.biu('_');break;
				case'formatStrikethrough':this.biu('~');break;
				case'insertFromPaste':navigator.clipboard.readText().then(txt=>this.xom(txt,false));break;
				case'insertParagraph':this.xom("\n\t");break;
				case'insertReplacementText':this.xom(e.dataTransfer.getData('text'),false);break;
				case'insertText':this.xom(e.data);break;
			}
			const rex=window.getSelection().getRangeAt(0).getClientRects()[0]['top'];
			const pos=Math.round(window.scrollY+rex)-(window.innerHeight/3);
			window.scrollTo(0,pos);
		});
		this.NOTEPAD.addEventListener('blur',()=>{
			this.NOTEPAD.focus();
		});
		document.addEventListener('selectionchange',()=>{
			const selec=window.getSelection().getRangeAt(0);
			this.RANG=[selec.startOffset,selec.endOffset];
			// console.log(this.RANG);
		});
		// INIT
		if(!this.NOTEPAD.childNodes[0]){
			this.NOTEPAD.append(document.createTextNode(''));
		}
		if(localStorage.Scrawl_TXT){
			this.NOTEPAD.textContent=localStorage.Scrawl_TXT;
		}
		this.NOTEPAD.focus();
		this.cart([this.NOTEPAD.textContent.length,this.NOTEPAD.textContent.length]);
		this.raec();
	}
}
