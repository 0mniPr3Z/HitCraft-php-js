<?php $art = $page->get_mainart();?>

<div class="row gx-4 gx-lg-5 align-items-center my-5 mainArt">

	<div class="col-lg-7 image-frame">
		<?php include 'inc/gui/btn_edit.php';?>
		<img class="img-fluid mb-4 mb-lg-0 main_img borderFrame" src="<?=$art['img']?>" alt="$art['title_'.$lang]">
	</div>

	<div class="col-lg-5">
		<div class="text-effect">
			<h1 class="main_art_title" data-text="<?=$sc->noAccent( $titl )?>" contenteditable>
				<?=$site->noAccent($art['title_'.$lang])?>
			</h1>
		</div>

		<?php include'inc/gui/store_links.php';?>

         
		<p class="text-center">
			<?php echo substr($art['content_'.$lang],0,250); if(strlen($art['content_'.$lang]) > 250)echo'...';?>
		</p>
		
		<div class="d-grid gap-2">
			<a class="btn glass-btn" href="<?=str_replace(' ', '_', $art['linkto_'.$lang])?>">
				<h3>
					<?=$art['linktoname_'.$lang]?>
				</h3>
			</a>
		</div>
	</div>
		
</div>