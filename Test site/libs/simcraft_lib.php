<?php
include'libs/config.php';
if(MODE_DEBUG)
	include'libs/debug.php';
include'libs/hydratGet.php';
include'libs/localization.php';
if(MODE_DEBUG)
	include'libs/vocab_'.$lang.'.php';
include'libs/Simcraft.php';

$sc = new Simcraft($vocab);