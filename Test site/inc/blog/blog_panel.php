<?php
if(!isset($pg2) || !isset($pg3)){
  if(empty($pg2) || empty($pg3)){
    $firstart = $sc->getBlogFirstArt();
    $month = strtolower(date('M', $firstart['timestamp']));
    $year = date('Y', $firstart['timestamp']);
  }
}else{
	$month = $pg2;
  $year = $pg3;
}
$artlist = $sc->getMonthBlogList($month, $year);
$timest = $artlist[0]['timestamp'];
$panel_title = $vocab[strtolower( date('M',$timest) )].' '.date('Y', $timest);
$thismonth = $vocab[strtolower( date('M',time()) )].' '.date('Y', time());
if($panel_title == $thismonth)
  $panel_title = $vocab['thismonth'];

?>

<div class="row g-5">
  <div class="col-md-8 cardFrame blogPanel">
    <h3 class="pb-4 mb-4 fst-italic border-bottom">
      <?=$panel_title?>
    </h3>

    <?php
      include'inc/blog/blog_art_fill.php';
    ?>
    

  </div>

  <div class="col-md-4">
    <div class="position-sticky" style="top: 5em; margin-top:2em;">
      <?php
        include'inc/blog/sticker.php';
        include'inc/blog/monthlist.php';
        include'inc/blog/otherwhere.php';
      ?>
    </div>
  </div>

  
</div>