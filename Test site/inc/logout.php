<?php include'libs/trait_add_user.php';?>
<div class="d-flex justify-content-center text-center">
<?php
if($sc->isConnected()){
	$okTitle = $vocab['bye'].' '.$sc->playerNm();
	$err = 'godbyMsg';
	$errColor = 'green';
	include'inc/alert.php';
	include'libs/trait_logout.php';
}else{
	include'inc/need_co.php';
}
?>

</div>
</div>