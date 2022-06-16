<div class="container">
	<div class="row align-items-center justify-content-center" style="padding:.5em 1em">

		<div class="col-sm-6">
			<a href="Forum-<?=$pg2?>-<?=str_replace(' ', '_', $thread['title_'.$lang])?>" class="threadtitle<?=$avatarMode?>" data-abc="true">
				<?=$thread['title_'.$lang]?>
			</a>
			<div class="text-muted small mt-1">
				<?=$thread['description_'.$lang]?>
			</div>
		</div>

		<div class="col-sm-2 align-items-center">
			<div class="" style="text-align:center;font-size:2em;">
				<?=$sc->getTopicRepliesCount($thread['id'], $lang)?>
			</div>
		</div>

		<div class="col-sm-2 align-items-center">
			<?php $userId = $thread['authorId'];?>
			<div class="media-body flex-truncate ml-2">
				<div class="line-height-1 text-muted small text-truncate">
					<?php include'inc/forum/author.php';?>
				</div>
			</div>
		</div>

		<div class="col-sm-2 align-items-center">
			<?php include'inc/forum/lastposted.php';?>
		</div>

	</div>
</div>
<hr class="m-0">