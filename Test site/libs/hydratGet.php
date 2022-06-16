<?php

if(isset($_GET['url'])){
	$getTab = explode('-', $_GET['url']);
	foreach($getTap as $getindex => $getvar){
		if($getAvailableValues)
			$get[$getindex] = $getvar;
	}
}
if(isset($_GET['pg'])){
	$pg = intval($_GET['pg']);
}else{
	$pg = '1';
}
if(isset($_GET['pg2'])){
	$pg2 = strval($_GET['pg2']);
}
if(isset($_GET['pg3'])){
	$pg3 = strval($_GET['pg3']);
}
if(isset($_GET['pagin'])){
	$pagin = intval($_GET['pagin']);
}else{
	$pagin = '1';
}

?>