<div id="PREVIEW_BOX_ID" class="col-sm-12 col-md-6"  style="zoom:50%">
<div class="cardFrame blogPanel">

		<article class="blog-post">
			<h2 class="blog-post-title">
				<?=$art['title_'.$lang]?>
			</h2>

			<p class="blog-post-meta"><?=$artDate?>
				<a href="user_<?=$art['authorId']?>">
					<?=$sc->userName(intval($art['authorId']))?>
				</a>
			</p>

			<?php if(!empty($art['yt_video'])){?>
				<div class="md-12" style="padding-bottom:.5em;">
					<iframe width="560" height="315"
						src="https://www.youtube.com/embed/<?=$art['yt_video']?>"
						title="<?=$art['title']?>"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen>
					</iframe>
				</div>

			<?php }else if(!empty($art['hdr_img'])){?>
				
				<div class="md-12" style="padding-bottom:.5em;">
					<img src="<?=$art['hdr_img']?>" class="img-fluid cardFrame" alt="<?=$art['title']?>" style="margin-bottom:1em;">
				</div>
			
			<?php }

			if(!empty($art['side_img'])){?>

				<div class="d-none d-md-block md-6 float-start" style="padding-right:1em;padding-bottom:1em; max-width:50%;">
					<img src="<?=$art['side_img']?>" class="img-fluid cardFrame" alt="<?=$art['title']?>">
				</div>

			<?php } ?>

				<?=$art['content_'.$lang];?>

		</article>
		<hr style="width:80%;margin-left:10%;">
</div>
			</div>