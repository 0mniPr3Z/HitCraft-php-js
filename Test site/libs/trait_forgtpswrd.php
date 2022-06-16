<?php
if(
	isset($_POST['login'])
){
	if(
		!empty($_POST['login'])
	){
		$errClr = 'red';
		if($sc->checkLoginCo($_POST['login']) == "good"){
				$sc->forgtMail();
				$err = 'forgtok';
				$errClr = 'green';
		}else{
			$err = $sc->checkLoginCo($_POST['login']);
		}
	}else{
		$err = 'fillforgt';
		$errClr = 'red';
	}
}else{
	$err = 'pleasforgt';
	$errClr = 'grey';
}
if(isset($_POST['mail']) && !empty($_POST['login'])){
	$loginlast = htmlspecialchars($_POST['login']);
}
?>