
<?php
        //include'inc/forum/latest.php';
if(!isset($pg2))
        include'inc/forum/catlist.php';
else if(!isset($pg3))
        include'inc/forum/threadlist.php';
else
        include'inc/forum/threadfill.php';
?>