<div class="d-flex flex-wrap justify-content-between">
	<div>
		<?php
		if($sc->isConnected()){
			if($topic['authorId'] == $sc->playerId()){
				include'inc/forum/topic/btnedit.php';
			}else{
				include'inc/forum/topic/btnreply.php';
			}
		}else{
			include'inc/forum/btn_login.php';
		} ?>
	</div>
	
	<h2 >
   		<a href="<?=$vocab['forum']?>">
		   <?=$vocab['forum']?>
		</a>
		<i class="fa-solid fa-angle-right"></i>
		<a href="<?=$vocab['forum']?>-<?=$pg2?>">
			<?=$cat['title_'.$lang]?>
		</a>
		<i class="fa-solid fa-angle-right"></i>
		<?=$topic['title_'.$lang]?>

	</h2>
	<div class="col-12 col-md-2 p-0 mb-2">
		<?php
		$userId = $topic['authorId'];
		$thread = $topic;
		include 'inc/forum/author.php';
		?>
	</div>
</div>