<div class="d-flex row mb-2 justify-content-around" style="margin-top:1em;">

  <?php
    $offset = $pagin * 2 - 2;
    for($i = 0; $i < 2; $i++){
      if($i + $offset < count($blog['art_list'])){
        $art= $blog['art_list'][$i + $offset];
        $artlink = 'blog/article_'.$art['id'].'/'.substr(str_replace(' ', '_', $art['title']), 0, 25);?>

        <div class="col-md-5 blogcard">

          <div class="row g-0 overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative cardFrame align-items-stretch">

            <div class="col p-4 d-flex flex-column position-static ">

              <strong class="d-inline-block mb-2 text-primary">World</strong>
              <h3 class="mb-0"><?=$art['title']?></h3>
              <div class="mb-1 text-muted"><?=$sc->onlydate($art['timestamp'])?></div>
              <p class="card-text mb-auto"><?=substr($art['content'], 0, 100)?></p>
              <a href=<?=$artlink?>" class="stretched-link"><?=$vocab['seeall']?></a>
            </div>

            <div class="col-auto d-none d-lg-block  align-items-stretch">
              <img class="bd-placeholder-img rounded" style="height:100%;" alt="<?=$art['title']?>" src="<?=$art['side_img']?>" 
                role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
            </div>

          </div>

        </div>


      <?php }
    } ?>
</div>