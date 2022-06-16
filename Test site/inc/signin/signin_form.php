<form action="#" method="post" autocomplete="off" class="glass-d cardFPad rounded" style="color:white;">
      <img class="mb-4" src="assets/img/logo/1.png" alt="" style="max-width:40%;"><br>
      <small style="color:<?=$errClr ?>;"><?=$vocab[$err]?></small>

      <div class="mrgn_btm-sm cardFPad">
        <label for="floatingInput"><h4><?=$vocab['mail']?></h4></label>
        <input type="email" class="form-control cardFrame bg-dark text-light" placeholder="name@example.com" name="mail" <?php if(isset($maillast))echo'value="'.$maillast.'" ';?>required>
      </div>

      <div class="mrgn_btm-sm cardFPad">
        <label for="floatingInput"><h4><?=$vocab['pseudo']?></h4></label>
        <input type="text" class="form-control cardFrame bg-dark text-light" placeholder="<?=$vocab['yrpseudo']?>" name="psdo" autocomplete="off" <?php if(isset($psdolast))echo'value="'.$psdolast.'" ';?>required>
      </div>

      <div class="mrgn_btm-sm cardFPad">
        <label for="pswrd2"><h4><?=$vocab['password']?></h4></label>
        <input type="password" class="form-control cardFrameUp bg-dark text-light" id="pswrd" placeholder="<?=$vocab['password']?>" name="pswrd" autocomplete="new-password" required>
        <input type="password" class="form-control cardFrameDwn bg-dark text-light" id="pswrd2" placeholder="<?=$vocab['rpt_pswrd']?>" name="pswrd2" autocomplete="new-password" required>
      </div>

      <div class="d-block mb-3">
        <label>
           <?=$vocab['rmbr_me']?> <input type="checkbox" value="rmbr_me" name="rmbrme">
        </label>
      </div>

      <div class="d-block mb-3">
        <label>
           <?=$vocab['acpt_condi']?> <input type="checkbox" value="acpt_condi" name="acpt_condi" required>
        </label>
      </div>
      <input type="hidden" name="pg" value="16">
      <input type="submit" class="w-100 btn btn-lg glass-btn" value="<?=$vocab['signin']?>" required>

    </form>