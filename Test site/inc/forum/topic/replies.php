<?php
$list = $sc->getTopicRepliesList($topic['id'], $lang, $pagin);
echo'<div class="glass-d">';
if(count($list) > 0){
	include'inc/forum/topic/repliesfill.php';
}else{
	$blankmsg = 'noReplied'; 
	include'inc/forum/blank.php';
}
echo'</div>';
?>