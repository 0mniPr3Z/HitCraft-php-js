<a href="Forum-<?=str_replace(' ', '_', $sub_cat['title_'.$lang])?>">
	<div class="d-flex align-items-center">
		<img class="forumSubcatImg" src="<?=$sub_cat['side_img']?>">
		<div>
			<h3 style="text-decoration:none; color:lightgrey; font-size:2em;">
				<?=$sub_cat['title_'.$lang]?> <i class="<?=$sub_cat['fa_ico']?>"></i>
			</h3>
			<p class="forumSubcatDesc" style="width:450px; text-align:justify;"><?=$sub_cat['content_'.$lang]?></p>
		</div>
	</div>
</a>