<div class="row">
	<label class="col-sm-1" for="<?=$imginputnm?>">
		<i class="<?=$inputico?>" style="width:15%"></i>
	</label>
	<input
		class="col-sm-11"
		type="text"
		value="<?=$imginputval?>"
		name="<?=$imginputnm?>"
		id="<?=$imginputnm?>"
		onchange="$TxtEditor.refreshImgPreview('<?=$imginputnm?>', '<?=$imgtrgt?>');"
		style="width:90%;">
</div>
