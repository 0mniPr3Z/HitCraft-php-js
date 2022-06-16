<?php
if(count($list) > 0){
	for($i = 0; $i < count($list); $i++){
		$reply = $list[$i];
		include'inc/forum/topic/reply.php';
	}
} ?>