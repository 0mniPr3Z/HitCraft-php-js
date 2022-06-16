<?php
if($pageCount > 1){ ?>

    <nav class="container d-flex justify-content-center">
        <ul class="pagination justify-content-center">
            <?php
            $disabled = "";
            $prevLk = "#";
            if($pagin == 1)
                $disabled = " disabled";
            else
                $prevLk = $pageNm.'-page_'.($i - 1);
                
            $frstLk = $pageNm.'-page_1';
            ?>
            <li class="pagin-btn<?=$disabled?>">
                <a href="<?=$frstLk?>"  class="page-link bg-dark text-light" style="border: 1px solid black;">
                    <i class="fa-solid fa-angles-left"></i>
                    <span class="d-none">
                        <?=$vocab['frstpg']?>
                    </span>
                </a>
            </li>

            <li class="pagin-btn<?=$disabled?>">
                <a href="<?=$prevLk?>" class="page-link bg-dark text-light" style="border: 1px solid black;">
                    <i class="fa-solid fa-angle-left"></i>
                    <span class="d-none">
                        <?=$vocab['previous']?>
                    </span>
                </a>
            </li>
            
            <?php
            $range = 1;
            if($pageCount > 3){
                $range = min(9, $pageCount);
            }

            $begin = $pagin - ceil($range/2); // 1 - 1
            $termine = $pagin + ceil($range/2); // 1 + 1

            $start = max(1, $begin); //max(1, 0) return 1

            $end = min($pageCount, $termine); // min(2, 2) return 2
            
            for($i = $start; $i <= $end; $i++){
                
                $pagelink = $pageNm.'-page_'.$i;

                $active = "";
                if($i == $pagin){
                    $active = " active";
                }

                ?>

                <li class="pagin-btn<?=$active?>">
                    <a class="page-link bg-secondary text-light" style="border: 1px solid black;" href="<?=$pagelink?>">
                        <?=$i?>
                    </a>
                </li>

            <?php } ?>
            <?php
            $disabled = "";
            $nxtLk = "#";
            if($pagin == $pageCount)
                $disabled = " disabled";
            else
                $nxtLk = $pageNm.'-page_'.($i + 1);

            $lstpg = $pageCount;
            $lstLk = $pageNm.'-page_'.($pageCount);
            ?>

            <li class="pagin-btn<?=$disabled?>">
                <a class="page-link bg-dark text-light" href="<?=$nxtLk?>" style="border: 1px solid black;">
                    <i class="fa-solid fa-angles-right"></i>
                    <span class="d-none">
                        <?=$vocab['next']?>
                    </span>
                </a>
            </li>

            <li class="pagin-btn<?=$disabled?>">
                <a class="page-link bg-dark text-light" href="<?=$lstLk?>" style="border: 1px solid black;">
                    <i class="fa-solid fa-angle-right"></i>
                    <span class="d-none">
                        <?=$vocab['lstpg']?>
                    </span>
                </a>
                
            </li>

        </ul>
    </nav>
<?php } ?>