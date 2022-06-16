

	<?php
	$list = $sc->getPinnedThreadList($cat['id'], $lang);
	if(count($list) > 0){
		echo'<div class="card mb-3 glass-d bg-dark">';
			$threadlistNm = 'pined';
			$avatarMode = 1;
			include'inc/forum/threadlist/header.php';
			include'inc/forum/threadlist/part.php';
		echo'</div>';
	}
	$basiclist = $sc->getBasicThreadList($cat['id'], $lang, $pagin);
	echo'<div class="card mb-3 glass-d">';
	if(count($basiclist) > 0){
		if(count($list) == 0){
			$threadlistNm = 'topics';
			include'inc/forum/threadlist/header.php';
		}
		$avatarMode = 2;
		$list = $basiclist;
		include'inc/forum/threadlist/part.php';
	}else{
		$blankmsg = 'nothread';
		include'inc/forum/blank.php';
	}
	echo'</div>';
	?>



