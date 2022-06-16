<?php $langtoggle = $langtmp == 'fr'? 'en':'fr';?>
<div class="tooltips w-100" style="margin-top:1em;">
	<div>
		<a href="Edition-<?=$art['id']?>-<?=$langtoggle?>">
			<button class="btn-tag" type="button" name="texteditor"
				title="<?=$sc->site_infos('txtedittool_lang', $langtmp);?>"
			>
				<img src="assets/img/icon/<?=$langtmp?>.png" alt="<?=$lang?>" width="18">
			</button>
		</a>
<span class="tools_separator">|</span>
		<?php include 'inc/texteditor/btn/submit_'.$art['cat'].'.php';?>
		<button class="btn-tag" type="submit" name="texteditor" value="close" style="color:red;"
				title="<?=$sc->site_infos('txtedittool_cancel', $langtmp);?>">
			<i class="fa-solid fa-square-xmark"></i>
		</button>
<span class="tools_separator">|</span>
		<button class="btn-tag" type="submit" name="texteditor" value="check" style="color:lightblue;"
				title="<?=$sc->site_infos('txtedittool_restore', $langtmp);?>"
			>
			<i class="fa-solid fa-file-arrow-up"></i>
		</button>
		<button class="btn-tag" type="submit" name="texteditor" value="check" style="color:lightblue;"
				title="<?=$sc->site_infos('txtedittool_export', $langtmp);?>"
			>
			<i class="fa-solid fa-file-arrow-down"></i>
		</button>
		<button class="btn-tag" type="submit" name="texteditor" value="check" style="color:lightblue;"
				title="<?=$sc->site_infos('txtedittool_sign', $langtmp);?>"
			>
			<i class="fa-solid fa-file-signature"></i>
		</button>
		<button class="btn-tag" type="submit" name="texteditor" value="check" style="color:lightblue;"
				title="<?=$sc->site_infos('txtedittool_model', $langtmp);?>"
			>
			<i class="fa-solid fa-file-invoice"></i>
		</button>
<span class="tools_separator">|</span>
		<button class="btn-tag" id="BTN_EYE_ID" type="button" onclick="$TxtEditor.togglePreviewDiv('PREVIEW_BOX_ID', 'CONTENU_BOX_ID', this.id, 'BTN_MODE_ID');"
				title="<?=$sc->site_infos('txtedittool_changeviewvisibility', $langtmp);?>"
			>
			<i class="fa-solid fa-eye-slash"></i>
		</button>
		<button class="btn-tag" type="button" id="BTN_MODE_ID"areaboxId, previewboxId, btnzoomId, btnmodeId, btnviewId
			onclick="$TxtEditor.toggleDivWidth('CONTENU_BOX_ID', 'PREVIEW_BOX_ID', 'BTN_ZOOM_ID', 'BTN_MODE_ID', 'BTN_EYE_ID');"
				title="<?=$sc->site_infos('txtedittool_changeviewmode', $langtmp);?>"
			>
			<i class="fa-solid fa-arrow-up-right-from-square"></i>
		</button>
		<button class="btn-tag d-none" type="button" id="BTN_ZOOM_ID"
			onclick="$TxtEditor.toggleZoomPreview('PREVIEW_BOX_ID','BTN_ZOOM_ID');"
				title="<?=$sc->site_infos('txtedittool_changeviewzoom', $langtmp);?>"
			>
			<i class="fa-solid fa-magnifying-glass-plus"></i>
		</button>
<span class="tools_separator">|</span>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[script]','[/script]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_insertjs', $langtmp);?>"
			>
			<i class="fa-brands fa-js-square"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[img]','[/img]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_insertimg', $langtmp);?>"
			>
			<i class="fa-solid fa-image"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[youtube]','[/youtube]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_insertyt', $langtmp);?>"
			>
			<i class="fa-brands fa-youtube"></i>
		</button>
<span class="tools_separator">|</span>
		<button class="btn-tag btn-tag-color" type="button"
				onclick="$TxtEditor.insertTag('[link = ' + document.querySelector('#LINK_SELECT_ID').value + ']','[/youtube]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_insertlink', $langtmp);?>"  disabled
			>
			<i class="fa-solid fa-link-slash"></i>
		</button>
		<i class="fa-solid fa-arrow-left"></i>
<span class="tools_separator">|</span>
		<button class="btn-tag btn-tag-color" type="button" value="12"
			onclick="$TxtEditor.insertTag('[size=' + document.querySelector('#SIZE_SELECT_ID').options[document.querySelector('#SIZE_SELECT_ID').selectedIndex].value + ']', '[/size]', 'CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
			title="<?=$sc->site_infos('txtedittool_insertsize', $langtmp);?>"
		>
			<i class="fa-solid fa-text-height"></i>
		</button>
		<i class="fa-solid fa-arrow-left"></i>
		<select id="SIZE_SELECT_ID" class="select-tag"
				title="<?=$sc->site_infos('txtedittool_setsize', $langtmp);?>"
			>
			<option value="8">8</option>
			<option value="10">10</option>
			<option value="12" selected>12</option>
			<option value="14">14</option>
			<option value="18">18</option>
			<option value="24">24</option>
		</select>
<span class="tools_separator">|</span>
		<button id="BTN_COLOR_ID" class="btn-tag btn-tag-color" type="button"
			onclick="$TxtEditor.insertTag('[color=' + this.style.color+ ']', '[/color]', 'CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_insertcolor', $langtmp);?>"
			>
			<i class="fa-solid fa-brush"></i>
		</button>
		<i class="fa-solid fa-arrow-left"></i>
		<input id="COLOR_SELECT_ID" class="colorbtn" type="color" value="#ffffff" onchange="$TxtEditor.changeColor('COLOR_SELECT_ID','BTN_COLOR_ID');"
				title="<?=$sc->site_infos('txtedittool_setcolor', $langtmp);?>"
			>
<span class="tools_separator">|</span>

		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[b]','[/b]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_bold', $langtmp);?>"
			>
			<i class="fa-solid fa-bold"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[i]','[/i]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_italic', $langtmp);?>"
			>
			<i class="fa-solid fa-italic"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[u]','[/u]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_underline', $langtmp);?>"
			>
			<i class="fa-solid fa-underline"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[strike]','[/strike]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_strike', $langtmp);?>"
			>
			<i class="fa-solid fa-strikethrough"></i>
		</button>
<span class="tools_separator">|</span>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[title]','[/title]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_title', $langtmp);?>"
			>
			<i class="fa-solid fa-heading"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[subtitle]','[/subtitle]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_subtitle', $langtmp);?>"
			>
			<i class="fa-solid fa-square-h"></i>
		</button>
<span class="tools_separator">|</span>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[left]','[/left]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_alignleft', $langtmp);?>"
			>
			<i class="fa-solid fa-align-left"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[center]','[/center]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_aligncenter', $langtmp);?>"
			>
			<i class="fa-solid fa-align-center"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[right]','[/right]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_alignright', $langtmp);?>"
			>
			<i class="fa-solid fa-align-right"></i>
		</button>
		<button class="btn-tag" type="button" onclick="$TxtEditor.insertTag('[justify]','[/justify]','CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
				title="<?=$sc->site_infos('txtedittool_justify', $langtmp);?>"
			>
			<i class="fa-solid fa-align-justify"></i>
		</button>
	</div>
</div>
<!--
	<i class="fa-solid fa-file-lines"></i>
	<i class="fa-solid fa-diagram-next"></i>
<i class="fa-solid fa-quote-right"></i>
-->