<div class="d-flex flex-wrap justify-content-between">
	<div>
		<?php
		if($sc->isConnected()){
			if($sc->getNewThreadAllowed($cat['post_req_lvl'])){
				include'inc/forum/threadlist_btnnew.php';
			}else{
				include'inc/forum/threadlist_notnewalowed.php';
			}
		}else{
			include'inc/forum/btn_login.php';
		} ?>
	</div>
	<h2 >
   	<a href="<?=$vocab['forum']?>"><?=$vocab['forum']?></a>
	   <i class="fa-solid fa-angle-right"></i>
	   <?=$cat['title_'.$lang]?>
	</h2>
	<div class="col-12 col-md-3 p-0 mb-3">
		<input type="text" class="form-control" placeholder="Search...">
	</div>
</div>