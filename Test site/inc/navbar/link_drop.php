<li class="nav-item dropdown">
	<a class="nav-link dropdown-toggle mainNavLink<?=$active?>" href="<?=$sc->lkval($link['name_'.$lang])?>"
		id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
		<i class="<?=$link['fa_ico']?>"></i> <?=$link['name_'.$lang]?>
	</a>
	<ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
		<?php include'inc/navbar/link_drop_items.php';?>
	</ul>
</li>