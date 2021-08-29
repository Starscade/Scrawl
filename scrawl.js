'use strict';
class Scrawl{
	constructor(notepad=document.getElementsByTagName('article')[0],prompt='<h1>Once upon a time . . .</h1>',spellcheck='false'){
		this.NOTEPAD=notepad;
		this.NOTEPAD.contentEditable='false';
		this.NOTEPAD.setAttribute('spellcheck',spellcheck);
		this.INIT=true;
		this.RANG='';
		this.HISTRY={'txt':[],'indx':0,'cart':[0,0]};
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
		this.htm2md=(htm=this.NOTEPAD.innerHTML)=>{
			const regx=[[
					/<\/*b>/g,
					/<blockquote>(.*)<\/blockquote>/g,
					/<br>/g,
					/<\/*em>/g,
					/<h1>(.*)<\/h1>/g,
					/<\/*i>/g,
					/<p>/g,
					/<\/p>/g,
					/<\/*strong>/g,
					/&amp;/g,
					/—/g,
					/“/g,
					/”/g/*,
					/’/g*/
				],[
					'**',
					"\t\t> $1",
					"\t\n",
					'*',
					"\t# $1\n",
					'*',
					"\t",
					"\n",
					'**',
					'&',
					'--',
					'"',
					'"'/*,
					"'"*/
				]
			];
			regx[0].forEach((p,x)=>{
				htm=htm.replace(p,regx[1][x]);
			});
			return htm;
		}
		this.laed=(set_txt=true)=>{
			let txt=localStorage.Scrawl_TXT;
			if(set_txt){
				this.NOTEPAD.textContent=txt;
			}else{
				this.NOTEPAD.innerHTML=txt;
			}
		}
		this.md2htm=(md=localStorage.Scrawl_TXT)=>{
			let htm='';
			const mdarr=md.split(/\n/g,);
			mdarr.forEach((line,i)=>{
				mdarr[i]=line.trim();
				switch(mdarr[i][0]){
					case'#':
						mdarr[i]=mdarr[i].replace(/^#\s*(.*)/g,'<h1>$1</h1>');
						break;
					case'>':
						mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<blockquote>$1</blockquote>');
						break;
					default:
						if(mdarr[i]==''){
							mdarr[i]='<br>';
						}else{
							mdarr[i]=mdarr[i].replace(/(.*)/g,'<p>$1</p>').replace(/<p><\/p>/g,'');
						}
				}
				const regx=[[
						/\*\*([^*]*)\*\*/g,
						/\*([^*]*)\*/g,
						/_([^_]*)_/g,
						/~([^~]*)~/g,
						/`([^`]*)`/g,
						/"([^"]*)"/g,
						/"/g,
						/'/g,
						/--/g
					],[
						'<b>$1</b>',
						'<i>$1</i>',
						'<u>$1</u>',
						'<s>$1</s>',
						'‘$1’',
						'“$1”',
						'”',
						'’',
						'—'
					]
				]
				regx[0].forEach((p,x)=>{
					mdarr[i]=mdarr[i].replace(p,regx[1][x]);
				});
				htm+=mdarr[i];
			});
			return htm;
		}
		this.opaen=(f)=>{
			let raed=new FileReader();
			raed.readAsText(f);
			raed.onload=()=>{
				const dot=f.name.split('.');
				if(dot[dot.length-1]=='md'){
					this.stoar(this.htm2md(this.md2htm(raed.result)));
				}else{
					this.stoar(this.htm2md(raed.result));
				}
				location.reload();
			}
		}
		this.pt=(plus=true)=>{
			const ptsz=Math.round(Number(window.getComputedStyle(this.NOTEPAD,null).getPropertyValue('font-size').split('px')[0])*0.75292857248934);
			if(plus){
				if(ptsz<24){
					this.NOTEPAD.style.fontSize=ptsz+6+'pt';
				}
			}else{
				if(ptsz>12){
					this.NOTEPAD.style.fontSize=ptsz-6+'pt';
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
		this.saef=(fnaem='Untitled',ftaep='text/markdown;charset=utf-8')=>{
			const md=localStorage.Scrawl_TXT.replace(/\t/g,'');
			const bob=new Blob([md],{type:ftaep});
			const uri=window.URL.createObjectURL(bob);
			const a=document.createElement('a');
			document.body.appendChild(a);
			a.style='display:none';
			a.href=uri;
			if(fnaem){
				a.download=fnaem+'.md';
				a.click();
				a.remove();
			}
			window.URL.revokeObjectURL(uri);
		}
		this.saerk=(woordz)=>{
			if(this.NOTEPAD.contentEditable=='true'){
				const w=woordz.split('|');
				const rx=new RegExp('\b'+w[0]+'\b','g');
				const k=[0,0];
				this.NOTEPAD.innerHTML=this.NOTEPAD.innerHTML.replaceAll(rx,w[1]);
				this.raec();
				return'Replaced '+(k.length-1)+' occurrences...';
			}else{
				return'Cannot make changes in HTML mode.';
			}
		}
		this.spael=()=>{
			if(this.NOTEPAD.spellcheck){
				this.NOTEPAD.setAttribute('spellcheck',false);
			}else{
				this.NOTEPAD.setAttribute('spellcheck',true);
			}
		}
		this.stoar=(t=this.NOTEPAD.textContent)=>{
			localStorage.Scrawl_TXT=t;
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
		this.tally=()=>{
			let woordz=this.NOTEPAD.textContent.split(/\S+/).length-1;
			return woordz+' words ('+Math.round(woordz/333)+' pages)';
		}
		this.WYSIWYG=()=>{
			if(this.NOTEPAD.contentEditable=='true'){
				this.NOTEPAD.contentEditable='false';
				this.NOTEPAD.innerHTML=this.md2htm();
			}else{
				this.laed();
				this.NOTEPAD.contentEditable='true';
				this.NOTEPAD.focus();
				this.caert();
			}
		}
		// EVENT LISTENERS
		this.NOTEPAD.addEventListener('beforeinput',e=>{
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
		this.NOTEPAD.addEventListener('cut',()=>{
			this.raec();
		});
		/* this.NOTEPAD.addEventListener('dragover',e=>{
			e.preventDefault();
		});
		this.NOTEPAD.addEventListener('drop',e=>{
			e.preventDefault();
			this.opaen(e.dataTransfer.items[0].getAsFile());
		}); */
		this.NOTEPAD.addEventListener('focus',()=>{
			if(this.INIT){
				this.NOTEPAD.textContent="\t# ";
				this.HISTRY['txt'][this.HISTRY['indx']]=this.NOTEPAD.textContent;
				this.HISTRY['cart'][this.HISTRY['indx']]=[this.NOTEPAD.textContent.length,this.NOTEPAD.textContent.length];
				this.INIT=false;
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
		if(localStorage.Scrawl_TXT){
			this.INIT=false;
			this.NOTEPAD.innerHTML=this.md2htm();
			this.HISTRY['txt'][this.HISTRY['indx']]=localStorage.Scrawl_TXT;
			this.HISTRY['cart'][this.HISTRY['indx']]=[localStorage.Scrawl_TXT.length,localStorage.Scrawl_TXT.length];
		}else{
			localStorage.Scrawl_TXT='	# ';
			this.NOTEPAD.innerHTML=prompt;
		}
	}
}