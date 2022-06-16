<?php
	$inputico		= 'fa-solid fa-heading';
	$inputnm		= 'TITLE_CONTENT';
	$inputtrgt		= 'TITLE_RECEIVER';
	$inputval		= $art['title_'.$langtmp];
	include'inc/texteditor/inputtext.php';
	$inputico		= "fa-solid fa-image";
	$imginputnm		= 'IMG_EDITOR';
	$imgtrgt		= 'IMG_RECEIVER';
	$imginputval	= $art['img'];
	include'inc/texteditor/inputimg.php';
?>