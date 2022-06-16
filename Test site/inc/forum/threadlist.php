<div class="container-fluid mt-100 forum">
   <?php
   $cat = $sc->getForumCatByName($pg2);
   $pageNm = 'Forum-'.$pg2;
   $pageCount = ceil($sc->getBasicThreadCount($cat['id'], $lang) / 10);
   include'inc/forum/threadlist/btn.php';
   
   include'inc/pagination.php';
   include'inc/forum/threadlist/contents.php';
   include'inc/pagination.php';
   ?>
</div>