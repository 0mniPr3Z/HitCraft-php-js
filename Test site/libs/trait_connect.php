<?php
if(
	isset($_POST['login'])
	&& isset($_POST['pswrd'])
){
	if(
		!empty($_POST['login'])
		&& !empty($_POST['pswrd'])
	){
		$errClr = 'red';
		if($sc->checkLoginCo($_POST['login']) == "good"){
			if($sc->checkPswrdCo($_POST['pswrd'], $_POST['login']) == "good"){
				$rmbr=0;
				if(isset($_POST['rmbrme'])  && !empty($_POST['rmbrme']))
					$rmbr=1;
				$user = $sc->getUserByLoginCo($_POST['login']);
				if($sc->userValidate($user['id'])){
					$sc->userConnexion($user['id'], $rmbr);
					$sc->connectMail($user['pseudo'], $lang);
					$err = 'loginok';
					$errClr = 'green';
					$relocation = 'http://'.$sc->domain;
				}else{
					$err = 'noMlUsr';
					$errClr = 'orange';
					if($user['token_timestamp'] < time())
						$err.= 'Lat';
					else
						$err.= 'Re';
				}
			}else{
				$err = $sc->checkPswrdCo($_POST['pswrd'], $_POST['login']);
			}
		}else{
			$err = $sc->checkLoginCo($_POST['login']);
		}
	}else{
		$err = 'fillform';
		$errClr = 'red';
	}
}else{
	$err = 'pleaslogin';
	$errClr = 'grey';
}
if(isset($_POST['mail']) && !empty($_POST['login'])){
	$loginlast = htmlspecialchars($_POST['login']);
}
?>