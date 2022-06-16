

<li>
	<small class="dropdown-item disabled"><?=$sc->vcb('logtoa')?></small>
</li>
<li><hr class="dropdown-divider"></li>

<?php
foreach($droplist as $droplink){
	$disabled = "";
	$active = "";
	if(isset($pg2))if($pg2 == $droplink['id'])
		$active = " active";
	if($droplink['display_rank'] > $sc->playerRank()){
		$disabled	= " disabled";
		$url		= "";
		$fa_ico		= "fa-solid fa-ban";
	}else{
		$url		=$droplink['name_'.$lang];
		$fa_ico		= $droplink['fa_ico'];
	}
	if($droplink['name_'.$lang] == '/'){ ?>

		<li><hr class="dropdown-divider"></li>
		
	<?php }else{
		$url_link = $sc->lkval($link['name_'.$lang].'-'.$url); ?>
		<li>
			<a class="dropdown-item<?=$active.$disabled?>"
				href="<?=$url_link?>">
				<i class="<?=$fa_ico?>"></i>
				<?=$droplink['name_'.$lang]?>
			</a>
		</li>

	<?php }
} ?>