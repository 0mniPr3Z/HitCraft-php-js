<?php
		$pgNm		= $sc->getPageData($pg)['name'];
		$stepId		= $sc->playerStepId($pgNm);
		$stepData	= $sc->getStepData($stepId);
		$err		= $stepData['content_'.$lang];
		$okTitle	= $stepData['title_'.$lang];
		$errClr		= $stepData['color'];
		$errForm	= $stepData['form_'.$lang];
		$errLink	= $pgNm.'-'.$sc->lkval($stepData['title_'.$lang]).'-'.$stepId);
		$errBtn		= true;
		$errBtnVal	= $stepData['subBtnNm_'.$lang];
		$errBtnVar	= $sc->lkval($stepData['subBtnNm_'.$lang]);
		
		include'lib/trait_actorCreation_'.$stepId.'.php';
		include'inc/alert.php';
?>