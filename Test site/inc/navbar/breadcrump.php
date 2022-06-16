<nav class="d-none d-md-block" style="top: 5em;left:2em" style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
  <ol class="breadcrumb">
    
    <?php
    $active = ["","","",""];
    if(isset($pg3)){
      $active[3] = " active";
    }else if(isset($pg2)){
      $active[2] = " active";
    }else if($pg == 1){
      $active[0] = " active";
    }else{
      $active[1] = " active";
    }?>
    
    <?php if($pg != 1){ ?>
      <li class="breadcrumb-item"><a href="<?=$sc->get_Page(1)['name_'.$lang]?>"><?=$sc->get_Page(1)['name_'.$lang]?></a></li>
      <li class="breadcrumb-item<?=$active[1]?>" aria-current="page"><?=$sc->get_page($pg)['name_'.$lang]?></li>
    <?php } else if(isset($pg2)){ ?>
      <li class="breadcrumb-item<?=$active[2]?>" aria-current="page"><?=$pg2?></li>
    <?php } else if(isset($pg3)){ ?>
      <li class="breadcrumb-item<?=$active[3]?>" aria-current="page"><?=$pg3?></li>
    <?php } ?>
    
  </ol>
</nav>