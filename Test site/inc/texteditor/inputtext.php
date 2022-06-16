<div class="w-100">
<label class="col-sm-1" for="<?=$inputnm?>">
		<i class="<?=$inputico?>" style="width:15%"></i>
	</label>
	<input
		class="col-sm-11"
		type="text"
		value="<?=$inputval?>"
		name="<?=$inputnm?>"
		id="<?=$inputnm?>"
		oninput="$TxtEditor.refreshPreview('<?=$inputnm?>', '<?=$inputtrgt?>');"
		style="width:80%;">
</div>
