<div class="row gx-4 gx-lg-5">
	<?php
	$artlist = $sc->getHomeArtList();
	for($i = 0; $i < count($articles['list']); $i++){
		$art = $artlist[$i];
	?>

		<div class="col-md-4 mb-5">
		<?php if($sc->isAdminConnected())include 'inc/home/editbtn.php';?>
			<div class="card h-100 cardFrame cardFPad">
				<div class="card-body ">
					<h2 class="card-title" style="color:white;border-bottom:2px solid rgb(80,80,80);padding-bottom:1em;">
						<i class="<?=$art['fa_ico']?>" style="color: lightgrey;"></i>
						<?=$vocab[$art['title']]?>
					</h2>
					<figure class="text-center"><img src="<?=$art['img']?>" alt="" style="margin:0em auto;"></figure>
					<p class="card-text"><?=substr($art['content_'.$lang], 0, 250)?>...</p>
				</div>
				<div class="d-grid card-footer"><a class="btn glass-btn" href="#!"><?=$vocab['knowmore']?></a></div>
			</div>
		</div>

	<?php } ?>
</div>