<div class="container-fluid mt-100 forum">
	<?php
	$cat = $sc->getForumCatByName($pg2);
	$pageNm = 'Forum-'.$pg2.'-'.$pg3;
	$topic = $sc->getForumTopicByNameCat($pg3, $cat['id'], $lang);
	$pageCount = ceil($sc->getTopicRepliesCount($topic['id'], $lang) / 10);
	$avatarMode = 2;

	include'inc/forum/topic/btn.php';
	?>

	<div class="card mb-3 glass-d">
		<?php
		include'inc/forum/topic/header.php';
		include'inc/forum/topic/content.php';
		?>
	</div>
	
		<?php
		if(($sc->isConnected() && $editActiv) || $debug){?>
			<div class="card mb-3 glass-d">
				<?php include'inc/forum/connected/texteditor.php';?>
			</div>
		<?php } ?>
	<?php
	include'inc/pagination.php';
	$avatarMode = 3;
	include'inc/forum/topic/replies.php';
	include'inc/pagination.php';
	?>
</div>


