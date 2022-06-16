<div id="carouselBlog" class="d-none d-md-flex carousel carousel-dark slide cardFrame" data-bs-ride="carousel" style="margin-bottom:2em;">
  
<div class="carousel-indicators">
	<button type="button" data-bs-target="#carouselBlog" data-bs-slide-to="0" class="active" aria-current="true" aria-label="<?=$blog['main_art'][0]['title']?>"></button>
	<?php for($i = 1; $i < count($blog['main_art']); $i++){
		$art= $blog['main_art'][$i];?>
		<button type="button" data-bs-target="#carouselBlog" data-bs-slide-to="<?=$i?>" aria-label="<?=$blog['main_art'][$i]['title']?>"></button>
	<?php } ?>
</div>

<div class="carousel-inner ">
	<?php for($i = 0; $i < count($blog['main_art']); $i++){
		$active = "";
		if($i == 0){$active = " active";};
		$art= $blog['main_art'][$i];
		$artlink = 'blog/article_'.$art['id'].'/'.substr(str_replace(' ', '_', $art['title']), 0, 25); ?>

    	<div class="carousel-item<?=$active?>">
      		<img src="<?=$art['hdr_img']?>" class="d-block w-100" alt="<?=$art['title']?>" style="max-height:400px;border-radius:10px;">
			<div class="carousel-caption d-none d-md-block">
				<a href="<?=$artlink?>">
					<h5><?=$art['title']?></h5>
				</a>
				<p><?=substr($art['content'],0,55)?>...</p>
				<a href="<?=$artlink?>">
					<button class="btn glass-btn"><?=$vocab['seeall']?></button>
				</a>
			</div>
		</div>
	<?php } ?>
</div>


  <button class="carousel-control-prev" type="button" data-bs-target="#carouselBlog" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden"><?=$vocab['previous']?></span>
  </button>

  <button class="carousel-control-next" type="button" data-bs-target="#carouselBlog" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden"><?=$vocab['next']?></span>
  </button>

</div>