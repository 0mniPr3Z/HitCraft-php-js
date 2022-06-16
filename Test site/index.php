<?php
session_start();
include'libs/simcraft_lib.php';
?>
<!DOCTYPE html>
<html lang="<?=$lang?>">
<head>
<?php include'inc/head.php'; ?>
</head>
    <body>
        <?php
        if(!MODE_DEBUG)
            include'inc/preloader.php';

        include'inc/navbar/index.php';
        
        if($pg == 5)
            include'inc/game/game_box.php'; 
        else{?>
            <div class="container px-4 px-lg-5 maincontenter">
                <?php include 'libs/rooter.php';?>
            </div>
        <?php }
        include'inc/footer.php';
        ?>

        
    </body>
</html>
