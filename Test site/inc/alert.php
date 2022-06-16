<div class="cardFPad">
	<img class="mb-4" src="assets/img/logo/1.png" alt="" style="max-width:40%;"><br>
	<h3><?=$okTitle?></h3>
    <small style="color:<?=$errClr ?>;">
		<?=$vocab[$err]?>
	</small>
	<br>
	<?php if(isset($errBtn)){ ?>
		<p style="text-align:center;">
			<form method="POST" action="<?=$errLink?>" method="post" class="glass-d cardFPad rounded" style="color:white;">
				<?php if(isset($errForm)){
					include'inc/alert/Form_'.$errForm.'.php';
				} ?>
				<input type="submit" class="w-100 btn btn-lg glass-btn" name="<?=$errBtnVar?>" value="<?=$errBtnVal?>">
			</form>
		</p>
		<br>
	<?php } ?>
</div>