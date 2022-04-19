'use strict';
class Jig{
	constructor(nib=new Nib()){
		this.CFG={'dark':false,'post_alias':'','post_url':'http://localhost/act.php','promp':'	# ','word_url':'https://www.merriam-webster.com/thesaurus/'};
		this.HAND=false;
		this.cfg=(ky,valu)=>{
			if(!this.mem()){
				this.mem(this.CFG);
			}
			const cfg=this.mem();
			if(ky){
				if(valu!=null){
					cfg[ky]=valu;
					this.mem(cfg);
				}else{
					return cfg[ky];
				}
			}else{
				if(this.mem()!==JSON.stringify(this.CFG)){
					Object.keys(this.CFG).forEach((i,x)=>{
						if(!(i in cfg)){
							cfg[i]=this.CFG[i];
						}
					});
					Object.keys(cfg).forEach((i,x)=>{
						if(!(i in this.CFG)){
							delete cfg[i];
						}
					});
					this.mem(cfg);
				}
				return cfg;
			}
		}
		this.lod=(F)=>{
			const raed=new FileReader();
			raed.readAsText(F);
			raed.onload=()=>{
				const dot=F.name.split('.');
				if(dot[dot.length-1]=='md'){
					nib.memry(nib.x2y(nib.x2y(raed.result),'htm2md'));
				}else{
					nib.memry(nib.x2y(raed.result,'htm2md'));
				}
				location.reload();
			}
		}
		this.mem=(json)=>{
			if(json){
				localStorage.Scrawl_CFG=JSON.stringify(json);
			}
			return JSON.parse(localStorage.Scrawl_CFG);
		}
		this.sav=(as=false,albak=()=>{console.log('Saved!')})=>{
			let naem=nib.sellama();
			if('showSaveFilePicker'in window){
				if(as){
					this.HAND=false;
				}
				const that=this;
				(async function (naem,that){
					if(that.HAND===false){
						const ops={
							suggestedName:naem,
							excludeAcceptAllOption:true,
							types:[{
								description:'Markdown',
								accept:{
									'text/markdown':['.md']
								}
							},{
								description:'HTML',
								accept:{
									'text/html':['.htm']
								}
							},{
								description:'Plaintext',
								accept:{
									'text/plain':['.txt']
								}
							}]
						};
						that.HAND=await window.showSaveFilePicker(ops);
					}
					const f=await that.HAND.getFile();
					const fn=f.name.split('.');
					const fx=fn[fn.length-1];
					let txt;
					switch(fx.toLowerCase()){
						case'htm':txt=nib.x2y();break;
						case'md':txt=nib.x2y(nib.x2y(),'htm2md').replaceAll(/\t/g,'');break;
						default:txt=nib.x2y(nib.x2y(),'htm2md');
					}
					const maem={'htm':'text/html','md':'text/markdown','txt':'text/plain'};
					const bob=new Blob([txt],{type:maem[fx]+';charset=utf-8'});
					const pen=await that.HAND.createWritable();
					await pen.write(bob);
					await pen.close();
				})(naem,that);
			}else{
				const txt=nib.x2y(nib.x2y(),'htm2md').replace(/\t/g,'');
				const bob=new Blob([txt],{type:'text/markdown;charset=utf-8'});
				const uri=window.URL.createObjectURL(bob);
				const a=document.createElement('a');
				document.body.appendChild(a);
				a.style='display:none';
				a.href=uri;
				a.download=naem+'.md';
				a.click();
				a.remove();
				window.URL.revokeObjectURL(uri);
			}
			albak();
		}
		this.cfg();
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
			this.raec();
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
		this.cop=(lang='HTML')=>{
			switch(lang){
				case'BBC':navigator.clipboard.writeText(this.x2y(this.x2y(),'htm2bbc'));break;
				case'HTML':navigator.clipboard.writeText(this.x2y());break;
				case'MD':
				default:navigator.clipboard.writeText(String(this.x2y(this.x2y(),'htm2md')).replaceAll(/\t/g,"\n"));
			}
		}
		this.iswet=()=>{
			let x=false;
			if(this.NOTEPAD.contentEditable=='true'){
				x=true;
			}
			return x;
		}
		this.memry=(txt)=>{
			if(txt){
				localStorage.Scrawl_TXT=txt;
			}
			return localStorage.Scrawl_TXT;
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
			this.memry(this.NOTEPAD.textContent);
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
			console.log('History: ',this.HISTRY);
		}
		this.sellama=(naem='Untitled')=>{
			const h1=this.memry().trim().split("\n")[0].trim();
			if(h1.startsWith('#')){
				const tyt=h1.replace(/#\s*(.*)/,'$1');
				if(tyt!=''){
					naem=tyt;
				}
			}
			return naem;
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
		this.swop=()=>{
			if(this.iswet()){
				this.NOTEPAD.contentEditable=false;
				this.NOTEPAD.innerHTML=this.x2y();
			}else{
				this.NOTEPAD.contentEditable=true;
				this.NOTEPAD.textContent=this.memry();
				this.NOTEPAD.focus();
				this.cart();
			}
		}
		this.tally=()=>{
			let txt='';
			if(window.getSelection().toString().length>0){
				txt=this.x2y(window.getSelection().toString());
			}else{
				txt=this.x2y();
			}
			const wurdz=txt.split(/ +/).length;
			return wurdz;
		}
		this.undo=(re=false)=>{
			if(this.iswet()){
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
					this.memry(this.HISTRY['txt'][this.HISTRY['indx']]);
					this.NOTEPAD.textContent=this.memry();
					this.cart(this.HISTRY['cart'][this.HISTRY['indx']]);
					this.mov();
				}
			}
		}
		this.x2y=(txt=this.memry(),patt='md2htm')=>{
			const REGX={'htm2bbc':[
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
					"\n\n",
					''
				]
			],'htm2md':[
				[
					/<a ([^>]*)>([^<]*)<\/a>/g,
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
					/<\/*s>/g,
					/<\/*strong>/g,
					/<\/*u>/g,
					/<sub>(.*)<\/sub>/g,
					/<sup>(.*)<\/sup>/g,
					/&amp;/g,
					/—/g,
					/“/g,
					/”/g,
					/‘/g,
					/’/g
				],[
					'<# $2>',
					'**',
					"\t> $1\n",
					"\t\n",
					'...',
					'*',
					"\t# $1\n",
					"\t+++\n",
					'\t===\n',
					'*',
					"\t",
					"\n",
					'~',
					'**',
					'_',
					'$1',
					'$1',
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
					/\+\+\+/g,
					/===/g,
					/\.\.\./g,
					/\*\*([^*]*)\*\*/g,
					/\*([^*]*)\*/g,
					/_([^_]*)_/g,
					/~([^~]*)~/g,
					/(?<![=/])"([^"]*)"/g,
					/"/g,
					/`/g,
					/'/g,
					/--/g,
					/\s\s+/g,
					/(\d)(st|nd|rd|th)/g,
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
					'“$1”',
					'“',
					'‘',
					'’',
					'—',
					' ',
					'$1<sup>$2</sup>',
					'<a href="mailto:$1@$2.$3">$1@$2.$3</a>',
					'<a href="$1"target="_Blank">$2</a>',
					'<a href="$1">$2</a>'
					]
				]
			};
			if(patt==='md2htm'){
				let htm='';
				const mdarr=txt.split(/\n/g,);
				mdarr.forEach((line,i)=>{
					mdarr[i]=line.trim();
					switch(mdarr[i][0]){
						case'#':
							mdarr[i]=mdarr[i].replace(/^#\s*(.*)/g,'<h1>$1</h1>');
							break;
						case'>':
							mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<blockquote>$1</blockquote>');
							break;
						case'+':
							if(mdarr[i]=='+++'){
								mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<h3>✶ ✶ ✶</h3>');
								break;
							}
						case'=':
							if(mdarr[i]=='==='){
								mdarr[i]=mdarr[i].replace(/^>\s*(.*)/g,'<hr>');
								break;
							}
						default:
							if(mdarr[i]==''){
								mdarr[i]='<br>';
							}else{
								mdarr[i]=mdarr[i].replace(/(.*)/g,'<p>$1</p>').replace(/<p><\/p>/g,'');
							}
					}
					REGX[patt][0].forEach((p,x)=>{
						mdarr[i]=mdarr[i].replace(p,REGX[patt][1][x]);
					});
					htm+=mdarr[i];
				});
				txt=htm;
			}else{
				REGX[patt][0].forEach((p,x)=>{
					txt=txt.replace(p,REGX[patt][1][x]);
				});
			}
			return txt.trim();
		}
		this.xom=(txt='',keep_rang=true,rec=true)=>{
			if(this.iswet()){
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
				// console.log(e);
			}
		});
		document.addEventListener('selectionchange',()=>{
			const selec=window.getSelection().getRangeAt(0);
			this.RANG=[selec.startOffset,selec.endOffset];
		});
		this.NOTEPAD.textContent=this.memry();
		this.NOTEPAD.focus();
		const l=this.NOTEPAD.textContent.length;
		this.cart([l,l]);
		this.raec();
	}
}
