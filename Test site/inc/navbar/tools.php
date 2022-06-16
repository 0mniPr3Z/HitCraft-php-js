<div class="d-flex btn-group">
  <?php if($sc->isConnected()){?>
    <button class="btn btn-outline-warning" type="submit">
      <?=$vocab['edit']?>
    </button>
    <a href="<?=$vocab['logout']?>">
      <button class="btn btn-outline-danger" type="button">
        <i class="fa-solid fa-user-xmark"></i>
        <?=$vocab['logout']?>
      </button>
    </a>
  <?php
				include'inc/navbar/usertool.php'; 
    }else{?>
    <a href="<?=$vocab['signin']?>">
      <button class="btn btn-outline-primary" type="submit">
        <i class="fa-solid fa-user-plus"></i>
        <?=$vocab['signin']?>
      </button>
    </a>
    <a href="<?=$vocab['login']?>">
      <button class="btn btn-outline-primary" type="submit">
        <i class="fa-solid fa-right-to-bracket"></i>
        <?=$vocab['login']?>
      </button>
    </a>
  <?php } ?>
</div>