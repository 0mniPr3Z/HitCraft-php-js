<form action="#" method="post" class="glass-d cardFPad rounded" style="color:white;">

    <img class="mb-4" src="assets/img/logo/1.png" alt="" style="max-width:40%;"><br>

    <small style="color:<?=$errClr ?>;"><?=$vocab[$err]?></small>

	<div class="mrgn_btm-sm cardFPad">
		<label for="floatingInput">
			<h4>
				<?=$vocab['mail'].' '.$vocab['or'].' '.$vocab['pseudo']?>
			</h4>
		</label>
		<input type="text" class="form-control cardFrame bg-dark text-light" placeholder="name@example.com <?=$vocab['or'].' '.strtolower($vocab['pseudo'])?>" name="login"
			<?php if(isset($loginlast))echo'value="'.$loginlast.'" ';?>required>
	</div>

	<div class="mrgn_btm-sm cardFPad">
		<label for="pswrd2"><h4><?=$vocab['password']?></h4></label>
		<input type="password" class="form-control cardFrame bg-dark text-light" id="pswrd" placeholder="<?=$vocab['password']?>" name="pswrd" autocomplete="new-password" required>
	</div>

	<div class="d-block mb-3">
		<label>
			<?=$vocab['rmbr_me']?> <input type="checkbox" value="rmbr_me" name="rmbrme">
		</label>
	</div>

	<input type="hidden" name="pg" value="16">

	<input type="submit" class="w-100 btn btn-lg glass-btn" value="<?=$vocab['login']?>" required>
	<a href="<?=$sc->lkval($vocab['forgtpswrd'])?>">
		<?=$vocab['forgtpswrd']?>
	</a>
</form>
