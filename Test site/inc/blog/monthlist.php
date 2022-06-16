<div class="p-4">
	<h4 class="fst-italic"><?=$vocab['archives']?></h4>
	<ol class="list-unstyled mb-0">
	<?php
	$blogartlist = $sc->getBlogArtList();
	$linklast = "";
	for($i = 0; $i < count($blogartlist); $i++){
		$art = $blogartlist[$i];
		$month = $vocab[strtolower(date('M', $art['timestamp']))].' '.date('Y', $art['timestamp']);
		$thismonth = $vocab[strtolower( date('M',time()) )].' '.date('Y', time());
		if($month == $thismonth)
			$month = $vocab['thismonth'];
		if($linklast != $month){ ?>
			<li><a href="Blog-<?=strtolower(date('M-Y', $art['timestamp']))?>"><?=$month?></a></li>
			<?php $linklast = $month;
		}
	} ?>
	</ol>
</div>