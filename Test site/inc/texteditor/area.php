<div id="CONTENU_BOX_ID" class="col-sm-12 col-md-6">
	<label style="padding-bottom:1em">
			<h4>Edition - <?=$art['label_'.$langtmp].' - '.strtoupper($langtmp)?></h4>
	</label>
	<?php
	include'inc/texteditor/tooltip/'.$art['cat'].'.php';
	include'inc/texteditor/tooltips.php';
	?>
	<div>
		<textarea
			class="" style="width:100%; min-width:100%;height:400px;"
			cols="150" rows="10"
			id="CONTENU_ID"					name="CONTENU_ID"
			placeholder="DEFAULT_CONTENU" oninput="$TxtEditor.refreshPreview('CONTENU_ID', 'TEXTRECEIVE_DIV_ID');"
		>
		<?=$art['content_'.$langtmp]?>
	</textarea>
	</div>
</div>