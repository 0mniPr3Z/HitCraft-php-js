<?php include'libs/trait_add_user.php';?>
<div class="d-flex justify-content-center text-center">
  <?php //var_dump($_POST);?>
  <div class="form-signin w-50 glass-d rounded">
    <?php
    if($err == 'signinok'){
		  $okTitle = $vocab['welcome'].' <i>'.$psdolast.'</i>';
      include'inc/alert.php';
    }else{
      include'inc/signin/signin_form.php';
    }
    ?>
  </div>
</div>