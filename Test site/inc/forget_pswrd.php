<?php include'libs/trait_forgtpswrd.php';?>
<div class="d-flex justify-content-center text-center">
  <div class="form-signin w-50 glass-d rounded">
    <?php
    if($err == 'mailedok'){
      include'inc/form_ok.php';
    }else{
      include'inc/forgt_pswrd/forgt_pswrd_form.php';
    }
    ?>
  </div>
</div>