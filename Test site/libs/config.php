<?php
define("READY_INSTALLED",		false);
define("MODE_LOCAL",			true);
define("DOMAINE_NAME",			"shooter-z.fr");
define("DEFAULT_TIMEZONE",		"Europe/Paris");
define("DEFAULT_SITE_LANGUAGE",	"Français");
define("DB_PREFIX",				"SC_");

if(MODE_LOCAL || !READY_INTALLED)
	include'libs/config_local.php';
else
	include'libs/config_prod.php';
define("WEBSITE_ADRESS",	DOMAINE_PREFIX.DOMAINE_NAME);
?>