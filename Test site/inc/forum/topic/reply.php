<div class="row w-100 replybox">
	<div class="authordiv3 cardFrame col-sm-12 col-md-3 col-lg-2">
		<?php
		$userId = $reply['authorId'];
		$thread = $reply;
		?>
		<?php
		include'inc/forum/author.php';
		?>
	</div>
	<div class="d-none d-md-block col-md-1 col-lg-1">
	</div>
	<div class="replycontent col-sm-12 col-md-8 col-lg-9">
		<?=$sc->convertEscapeScCode($reply['content_'.$lang], $cat['id']);?>
	</div>
</div>
<hr class="m-0">