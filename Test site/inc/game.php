<?php
	if(!$sc->isConnected() || !$sc->isAdminConnected()){
		include 'inc/need_co.php';
	}elseif(!$sc->playerHaveActor()){
		include 'inc/game/actor_creation.php';
	}
?>