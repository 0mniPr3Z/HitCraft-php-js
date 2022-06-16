<ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
<?php
	foreach($sc->get_navlist() as $link){
		$active = "";
		$disabled = "";
		if($link['name_'.$lang] == $pg)
			$active = " active";
		if(count($sc->get_navdrop($link['id'])) == 0){
			include'inc/navbar/link_solo.php';
		}else{
			$droplist = $sc->get_navdrop($link['id']);
			include'inc/navbar/link_drop.php';
		}			
	}
?>
</ul>


      
