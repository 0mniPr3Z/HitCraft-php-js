<div id="PREVIEW_BOX_ID" class="col-sm-12 col-md-6"  style="zoom:50%">
	<div class="row">
		<div class="col-lg-7 image-frame">
			<img id="<?=$imgtrgt?>" class="img-fluid mb-4 mb-lg-0 main_img borderFrame" src="<?=$art['img']?>" alt="" />
		</div>
		<div class="col-lg-5">
			<div class="text-effect">
				<h1 class="main_art_title" id='TITLE_RECEIVER'>
					<?=$sc->noAccent( $art['title_'.$langtmp])?>
				</h1>
			</div>

			<?php include'inc/download_link.php';?>

			
			<p class="text-center" id="TEXTRECEIVE_DIV_ID" height="100%">
				<?=$art['content_'.$langtmp]?>
			</p>
			
			<div class="d-grid gap-2">
				<a class="btn glass-btn" href="<?=str_replace(' ', '_', $art['linkto_'.$langtmp])?>">
					<h3>
						<?=$art['linktoname_'.$langtmp]?>
					</h3>
				</a>
			</div>
		</div>
			
	</div>
</div>