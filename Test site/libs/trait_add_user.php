<?php
if(
	isset($_POST['mail'])
	&& isset($_POST['pswrd'])
	&& isset($_POST['pswrd2'])
	&& isset($_POST['psdo'])
	&& isset($_POST['acpt_condi'])
){
	if(
		!empty($_POST['mail'])
		&& !empty($_POST['pswrd'])
		&& !empty($_POST['pswrd2'])
		&& !empty($_POST['psdo'])
	){
		$errClr = 'red';
		if($sc->checkMail($_POST['mail']) == "good"){
			if($sc->checkPswrd($_POST['pswrd'], $_POST['pswrd2']) == "good"){
				if($sc->checkPsdo($_POST['psdo']) == "good"){
					if($_POST['acpt_condi'] != NULL){

						$rmbr=0;
						if(isset($_POST['rmbrme'])  && !empty($_POST['rmbrme'])){
							$rmbr=1;
						}
						
						$hash = password_hash($_POST['pswrd'], PASSWORD_DEFAULT); 
						$sc->add_user($_POST['mail'], $hash,$_POST['psdo'], $rmbr, $lang);
						$user = $sc->getUserByPseudo($_POST['psdo']);
						if($user){
							$sc->activationMail($user['id'], $lang);
							$err = 'signinok';
							$errClr = 'green';
						}else{
							$err = 'err_db';
							$errClr = 'red';
						}

					}else{
						$err = 'err_condi';
					}
				}else{
					$err = $sc->checkPsdo($_POST['psdo']);
				}
			}else{
				$err = $sc->checkPswrd($_POST['pswrd'], $_POST['pswrd2']);
			}
		}else{
			$err = $sc->checkMail($_POST['mail']);
		}
	}else{
		$err = 'fillform';
		$errClr = 'red';
	}
}else{
	$err = 'pleassign';
	$errClr = 'grey';
}
if(isset($_POST['mail']) && !empty($_POST['mail'])){
	$maillast = htmlspecialchars($_POST['mail']);
}
if(isset($_POST['psdo']) && !empty($_POST['psdo'])){
	$psdolast =  htmlspecialchars($_POST['psdo']);
}
?>