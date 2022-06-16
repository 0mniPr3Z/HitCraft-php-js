<div class="d-flex justify-content-center text-center">
    <div class="form-signin w-50 glass-d rounded">
<?php
if(!$sc->isConnected()){
  include'libs/trait_connect.php';
  if($err == 'loginok'){
    $okTitle = $vocab['welcome'].' '.$sc->playerNm();
    include'inc/alert.php';
  }else{
    include'inc/login/login_form.php';
  }
}else{
  $okTitle = $vocab['welcome'].' '.$sc->playerNm();
  $err = 'alrdyCo';
  $errColor = 'green';
  include'inc/alert.php';
} ?>
    </div>
  </div>
