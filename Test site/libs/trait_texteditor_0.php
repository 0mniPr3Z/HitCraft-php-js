<?php

	if(isset($_POST['artId'])){
		$artId = intval($_POST['artId']);
		if($sc->playerCanEditArt($artId)){
			$title 		= strval($_POST['title']);
			$img 		= strval($_POST['img']);
			$content 	= strval($_POST['content']);
			$sc->editMainArticle($arId, $title, $img, $content);
			$err = "EDITED";
		}else{
			$err = "CANT LEGAL EDIT";
		}
	}else{
		$err = "NO DATA";
	}
	echo $err;
?>