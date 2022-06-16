<div class="container">
    <div class="glass-d" style="margin:auto 5em;">

        <?php
        $forum_cats = $sc->getForumCats();

        for($i = 0; $i < count($forum_cats); $i++){
            $forum_cat = $forum_cats[$i];
            ?>

            <div class="card-header glass-d md-12">
                <h2><i class="<?=$forum_cat['fa_ico']?>"></i> <?=$forum_cat['title_'.$lang]?></h2>
            </div>

            <?php
            $sub_cats = $sc->getForumSubCats($forum_cat['id']);
            for($j = 0; $j < count($sub_cats); $j++){
                $sub_cat = $sub_cats[$j];
                include'inc/forum/subcat.php';
            }
        }?>
        
    </div>
</div>