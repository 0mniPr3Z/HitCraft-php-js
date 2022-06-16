<div id="PREVIEW_BOX_ID" class="col-sm-12 col-md-6"  style="zoom:50%">
	<div class="row justify-content-center">
		<div class="col-sm-4">
			<div class="card cardFrame cardFPad">
				<div class="card-body ">
					<h2 class="card-title" style="color:white;border-bottom:2px solid rgb(80,80,80);">
						<i class="<?=$art['fa_ico']?>" style="color: lightgrey;"></i>
						<?=$vocab[$art['title']]?>
					</h2>
					<img src="<?=$art['img']?>" alt="" style="margin:0em auto;">
					<p class="card-text"><?=substr($art['content_'.$lang], 0, 250)?>...</p>
				</div>
				<div class="d-grid card-footer">
					<a class="btn glass-btn" href="#!">
						<?=$vocab['knowmore']?>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>