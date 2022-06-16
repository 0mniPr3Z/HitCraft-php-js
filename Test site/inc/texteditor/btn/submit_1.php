<button
	class="btn-tag"
	type="button"
	name="texteditor"
	value="check"
	style="color:green;"
	title="<?=$sc->site_infos('txtedittool_save', $langtmp);?>"
	onclick="$TxtEditor.subContent_<?=$art['cat']?>(<?=$art['id']?>, <?=$art['cat']?>,{ 'title':'<?=$inputnm?>', 'img': '<?=$imginputnm?>', 'content': 'CONTENU_BOX_ID'});" >
			<i class="fa-solid fa-floppy-disk"></i>
		</button>