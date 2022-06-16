function TextEditor(debug) {
	this.initialize(debug);
}
const TextEditorProto = {
	debug: false,
	printLoaded: function() {
		if(this.debug){
			console.log('Text Editor Initialized');
		}
	}
}
TextEditor.prototype					= Object.create(TextEditorProto);
TextEditor.prototype.constructor 		= TextEditor;
TextEditor.prototype.initialize			= function(debug){
	this.debug 			= debug || false;
	this.mode			= "split";
	this.previewmode	= 'visible';
	this.lastmode		= 'split';
    this.printLoaded();
}
TextEditor.prototype.submitContent		= function(data){
	if(this.submitConfirm()){
		let res = this.sendData(data, 'http://localhost/bootstrap/libs/trait_artposting.php');
	}
		
}
TextEditor.prototype.submitConfirm		= function(){
	let  = "Are you sure to save modifications ?";
	if(lang == 'fr')
		confirmMsg = "Enregistrer les modifications ?";	
	return confirm(confirmMsg);
}
//edit tag
TextEditor.prototype.insertTag			= function(startTag, endTag, textareaId, previewdivId, tagType){
	tagType = tagType;
	let field  = document.getElementById(textareaId); 
	let scroll = field.scrollTop;
	field.focus();

	if (window.ActiveXObject) { // C'est IE
		let textRange = document.selection.createRange();            
		let currentSelection = textRange.text;
				
		textRange.text = startTag + currentSelection + endTag;
		textRange.moveStart("character", -endTag.length - currentSelection.length);
		textRange.moveEnd("character", -endTag.length);
		textRange.select();     
	} else { // Ce n'est pas IE
		let startSelection   = field.value.substring(0, field.selectionStart);
		let currentSelection = field.value.substring(field.selectionStart, field.selectionEnd);
		let endSelection     = field.value.substring(field.selectionEnd);
				
		field.value = startSelection + startTag + currentSelection + endTag + endSelection;
		field.focus();
		field.setSelectionRange(startSelection.length + startTag.length, startSelection.length + startTag.length + currentSelection.length);
	}
	field.scrollTop = scroll; // et on redéfinit le scroll.
	this.refreshPreview(textareaId, previewdivId);
}
TextEditor.prototype.nl2br				= function(str, is_xhtml){
	if (typeof str === 'undefined' || str === null)
		return '';
	let breakTag = (is_xhtml || typeof is_xhtml === 'undefined')?'<br />':'<br>';
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
TextEditor.prototype.proceedEscTags		= function(str){
	let res = "";
	let tag = "";
	let param = "";
	let idCntr = 0;
	let intag = false;
	let inparam =false;
	let srt = " "+ str;
	let artId = 1;
	let pretag = "";
	
	let lastTag = "no";

	for(let i = 0; i < str.length; i++){
		if(lastTag == "script" || lastTag == "script="){
			if(str[i] == '['){
				pretag = str[i]+str[i+1]+str[i+2]+str[i+3]+str[i+4]+str[i+5]+str[i+6]+str[i+7]+str[i+8] + "";
				if(pretag == '[/script]'){
					i += 8;
					idCntr++;
					id = artId+'_'+idCntr;
					intag = false;
					lastTag = "/script";
					res += this.convertScTag('/script', "", id);
				}else{
					res += str[i];
				}
			}else{
				res+= str[i];

			}
		}else if(str[i] == '\\'){
		}else if(inparam){
			if(str[i] != ']' && i < str.length){
				param += str[i];
			}else if(str[i] == ']'){
				idCntr++;
				inparam = false;
				intag = false;
				id = artId+'_'+idCntr;
				lastTag = tag;
				res += this.convertScTag(tag, param, id);
			}
		}else if(intag){
			if(tag == "color=" || tag == "url=" || tag == "quote=" ||  tag == "size=" || tag == "img="){
				inparam = true;
				param = str[i];
			}else if(str[i] != ']'){
				tag += str[i];
			}else if(str[i] == ']'){
				idCntr++;
				id = artId+'_'+idCntr;
				intag = false;
				lastTag = tag;
				res += this.convertScTag(tag, param, id);
			}
		}else if(str[i] == '[' && str[i - 1] != '\\'){
			intag = true;
			inparam = false;
			tag = "";
			param = "";
		}else{
			res+= this.hydrateScCode(str[i]);
		}
	}
	return this.nl2br(res, false);
}
TextEditor.prototype.hydrateScCode		= function(str){	  
	  return str.replace('&', '&amp;')
	  .replace('>', '&gt;')
	  .replace('<', '&lt;')
	  .replace('"', '&quot;')
	  .replace("'", '&#039;');
}
TextEditor.prototype.convertScTag		= function(tag, param, id){
	//console.log(tag);
	switch(tag.toLowerCase()){
		case 'img':
			return '<img style="max-width:100%" alt="img" src="'; 
		case 'img=':
			return '<img style="max-width:100%"  alt="' + this.hydrateScCode(param) + '" src="'; 
		case '/img':
			return '">'; 
		case 'b':
			return '<b>'; 
		case '/b':
			return '</b>'; 
		case 'i':
			return '<i>'; 
		case '/i':
			return '</i>'; 
		case 'u':
			return '<u>'; 
		case '/u':
			return '</u>'; 
		case 'strike':
			return '<strike>'; 
		case '/strike':
			return '</strike>'; 
		case 'center':
			return '<p style="text-align: center">'; 
		case '/center':
			return '</p>'; 
		case 'left':
			return '<p style="text-align: left">'; 
		case '/left':
			return '</p>'; 
		case 'right':
			return '<p style="text-align: right">'; 
		case '/right':
			return '</p>'; 
		case 'justify':
			return '<p style="text-align: justify">'; 
		case '/justify':
			return '</p>'; 
		case 'color=':
			return '<font color="' + this.hydrateScCode(param) + '">'; 
		case '/color':
			return '</font>'; 
		case 'bgcolor=':
			return '<font style="background-color:' + this.hydrateScCode(param) + ';">'; 
		case '/bgcolor':
			return '</font>'; 
		case 'url=':
			return '<a href="' + this.hydrateScCode(param) + '">'; 
		case '/url':
			return '</a>'; 
		case 'quote':
			return '<fieldset class="topic_quote">'; 
		case 'quote=':
			return '<fieldset class="topic_quote"><legend>' + this.getEscapeScQuote(param) + '</legend>'; 
		case '/quote':
			return '</fieldset>'; 
		case 'spoiler':
			return '<div class="spoiler"><div class="spoiler-btn">Afficher/Masquer le text</div><div class="spoiler-body">'; 
		case 'spoiler=':
			return '<div class="spoiler"><div class="spoiler-btn">' + this.getEscapeScQuote(param) +'</div><div class="spoiler-body">';
		case '/spoiler':
			return '</div></div>'; 
		case 'script':
			return '<pre class="scriptbox"><code class="scriptcontent language-javascript">'; 
		case 'script=':
			return '<pre class="scriptbox"><code class="scriptcontent language-' + this.getEscapeScQuote(param) + '">'; 
		case '/script':
			return '</code></pre>'; 
		case 'youtube':
			return '<iframe width="560" height="315" src="https://www.youtube.com/embed/'; 
		case '/youtube':
			return '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; 
		case 'size=':
			return '<span style="font-size:' + Math.floor(Math.max( min(intval(param), 24), 8)) + 'px;">'; 
		case '/size':
			return '</span>'; 
		case 'tab':
			return '<i style="width:2em; min-width:2em; display:inline-block;"></i>';
		case 'title':
			return '<p style="font-size:2.4em;text-align:center;">';
		case '/title':
			return '</p>';
		case 'subtitle':
			return '<p class="subtitlpost"><i class="fa-solid fa-radiation"></i> ';
		case '/subtitle':
			return '</p>';
		case 'hr':
			return '<hr style="width:50%; margin: auto">';
		default:
			return "";
	}
}
//refresh preview
TextEditor.prototype.refreshPreview		= function(textareaId, previewdivId){
	let srcElem = document.getElementById(textareaId);
	let trgtElem = document.getElementById(previewdivId);
	//trgtElem.innerHTML = <?php convertEscapeCode(srcElem.innerText)?>;
	trgtElem.innerHTML = this.proceedEscTags(srcElem.value);
}
TextEditor.prototype.refreshImgPreview	= function(imginputId, imgId){
	let srcElem = document.getElementById(imginputId);
	let trgtElem = document.getElementById(imgId);
	//trgtElem.innerHTML = <?php convertEscapeCode(srcElem.innerText)?>;
	trgtElem.src = this.hydrateScCode(srcElem.value);
}
TextEditor.prototype.toggleZoomPreview	= function(previewboxId, btnId){
	let preview = document.getElementById(previewboxId);
	let btn = document.getElementById(btnId);
	if(preview.style.zoom = '100%'){
		this.zoomOutPreview(previewboxId, btnId);
	}else{
		this.zoomInPreview(previewboxId, btnId)
	}
}
TextEditor.prototype.zoomInPreview		= function(previewboxId, btnId){
	let preview = document.getElementById(previewboxId);
	let btn = document.getElementById(btnId);
	preview.style.zoom = '100%';
	btn.innerHTML = '<i class="fa-solid fa-magnifying-glass-minus"></i>';
}
TextEditor.prototype.zoomOutPreview		= function(previewboxId, btnId){
	let preview = document.getElementById(previewboxId);
	let btn = document.getElementById(btnId);
	preview.style.zoom = '50%';
	btn.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i>';
}
//change diplay
TextEditor.prototype.toggleDivWidth		= function(areaboxId, previewboxId, btnzoomId, btnmodeId, btnviewId){

	if(this.mode == 'split'){
		this.zoomInPreview(previewboxId, btnzoomId);
		this.enlargeDivMode(areaboxId, previewboxId, btnmodeId);
		this.mode = "enlarge";
		this.lastmode = 'enlarge';
	}else{
		this.mode = "split";
		this.lastmode = 'split';
		this.showPreview(previewboxId, areaboxId, btnviewId, btnmodeId);
		this.zoomOutPreview(previewboxId, btnzoomId);
		this.splitDivMode(areaboxId, previewboxId, btnmodeId, btnviewId);
	}
}
TextEditor.prototype.enlargeDivMode		= function(areaboxId, previewboxId, btnId){
	let area		= document.getElementById(areaboxId);
	let preview		= document.getElementById(previewboxId);
	let btn			= document.getElementById(btnId);
	btn.innerHTML	= '<i class="fa-solid fa-table-columns"></i>';

	this.enlargeDiv(area);
	this.enlargeDiv(preview);
}
TextEditor.prototype.enlargeDiv			= function(elem){
	if(!elem.classList.contains('col-md-12')){
		elem.classList.remove('col-md-6');
		elem.classList.add('col-md-12');
	}
}
TextEditor.prototype.splitDivMode		= function(areaboxId, previewboxId, btnId, btnviewId){
	let area			= document.getElementById(areaboxId);
	let preview			= document.getElementById(previewboxId);
	let btn				= document.getElementById(btnId);

	btn.innerHTML		= '<i class="fa-solid fa-arrow-up-right-from-square"></i>';

	this.splitDiv(area);
	this.splitDiv(preview);

	if(this.previewmode == 'masked'){
		let btnview = document.getElementById(btnviewId);
		btnview.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
		this.previewmode = 'visible';
	}
}
TextEditor.prototype.splitDiv			= function(elem){
	if(!elem.classList.contains('col-md-6')){
		elem.classList.remove('col-md-12');
		elem.classList.add('col-md-6');
	}
}
//preview
TextEditor.prototype.togglePreviewDiv	= function(previewboxId, areaboxId, btnpreviewId, btnmodeId){
	if(this.previewmode == 'visible'){
		this.hidePreview(previewboxId, areaboxId, btnpreviewId, btnmodeId);
	}else{
		this.showPreview(previewboxId, areaboxId, btnpreviewId, btnmodeId);
	}
}
TextEditor.prototype.hidePreview		= function(previewboxId, areaboxId, btnpreviewId, btnmodeId){
	let previewbox 		= document.getElementById(previewboxId);
	let btnmode			= document.getElementById(btnmodeId);
	let previewbtn		= document.getElementById(btnpreviewId);

	if(this.mode == 'split'){
		btnmode.classList.add('d-none');
		this.lastmode = 'split';
	}
	this.enlargeDivMode(areaboxId, previewboxId, btnmodeId);
	previewbox.classList.add('d-none');
	previewbtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
	this.previewmode = 'masked';
}
TextEditor.prototype.showPreview		= function(previewboxId, areaboxId, btnpreviewId, btnmodeId){
	let previewbox 		= document.getElementById(previewboxId);
	let previewbtn		= document.getElementById(btnpreviewId);
	let btnmode			= document.getElementById(btnmodeId);

	if(this.lastmode == 'split'){
		this.splitDivMode(areaboxId, previewboxId, btnmodeId, btnpreviewId);
	}
	if(btnmode.classList.contains('d-none'))
		btnmode.classList.remove('d-none');
	if(previewbox.classList.contains('d-none'))
		previewbox.classList.remove('d-none');
	previewbtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
	this.previewmode = 'visible';
}
//btn  2 time
TextEditor.prototype.changeColor		= function(srcId, trgtId){
	let srcElem = document.getElementById(srcId);
	let trgtElem = document.getElementById(trgtId);
	srcElem.style.color = trgtElem.value;
}
//Send data
TextEditor.prototype.subContent_0		= function(artId, artType, dataObj){
	let data = {};
	data.artId = artId;
	data.title	= document.getElementById(dataObj.title).value;
	data.content = document.getElementById(dataObj.content).value;
	data.img 	= document.getElementById(dataObj.img).value;
	this.sendData(data, artType);
}
TextEditor.prototype.sendData			= function(data, typeId){
	$url = "./libs/trait_editor_" + typeId +".php";
	var XHR = new XMLHttpRequest();
	XHR.overrideMimeType('text/xml');
	var urlEncodedData = "";
	var urlEncodedDataPairs = data;
	var index;
	for(index in data) {
	  urlEncodedDataPairs.push(encodeURIComponent(index) + '=' + encodeURIComponent(data[index]));
	}
	urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
	XHR.addEventListener('load', function(event){
	  	alert('Ouais ! Données envoyées et réponse chargée.');
	  	if(XHR.status < 400 && XHR.readyState == 4)
			console.log(XHR.responseText);
	});
	XHR.addEventListener('error', function(event) {
	  alert('Oups! Quelque chose s\'est mal passé.');
	  console.log(event);
	});
	XHR.open('POST', url, true);
	XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	XHR.send(urlEncodedData);
}
var $TxtEditor = new TextEditor(debug);