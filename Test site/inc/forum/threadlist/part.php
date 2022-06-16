<?php if(count($list) > 0){
	for($i = 0; $i < count($list); $i++){
		$thread = $list[$i];
		include'inc/forum/threadlist/elem.php';
	}
} ?>