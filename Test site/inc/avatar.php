<a href="user-<?=$userId?>" class="threadAuthorBox<?=$avatarMode?>">
	<img src="<?=$sc->userAvatar($userId)?>" alt="" class="avatar<?=$avatarMode?> rounded-circle">
	<i class="text-muted small threadAuthor<?=$avatarMode?>" data-abc="true">
		<?php
		if($sc->userRank($userId) > 1){
			echo $vocab['rankIco'.$sc->userRank($userId)];
			if($avatarMode == 1)
				echo' '.$vocab['usrRank'.$sc->userRank($userId)].'<br>';
		} ?> 
		
		<b class="threadAuthorNm<?=$avatarMode?>">
			<?=$sc->userName($userId)?>
		</b>
	</i>
</a>