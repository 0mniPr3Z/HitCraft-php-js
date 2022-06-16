<?php include'inc/avatar.php';?>
<div class="media-body flex-truncate ml-2">
	<div class="line-height-1 text-muted small text-truncate">
		<?php
		if($avatarMode == 1){
			echo str_replace(',','<br>',$sc->reverseShortDating($thread['timestamp']));
		}else{
			echo str_replace(',','-',$sc->reverseShortDating($thread['timestamp']));
		}?>
	</div>
</div>