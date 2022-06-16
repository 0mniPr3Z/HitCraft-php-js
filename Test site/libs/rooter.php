<?php
	if($pg != 1)include'inc/page_title.php';
	$url = $sc->get_page($pg)['name_en'];

	include'inc/'.$url.'.php';
    include'inc/scrolltotop.php';
?>