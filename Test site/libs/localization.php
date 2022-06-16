<?php
function setTimezone($default) {
    $timezone = "";
   
    // On many systems (Mac, for instance) "/etc/localtime" is a symlink
    // to the file with the timezone info
    if(is_link("/etc/localtime")){
       
        // If it is, that file's name is actually the "Olsen" format timezone
        $filename = readlink("/etc/localtime");
       
        $pos = strpos($filename, "zoneinfo");
        if ($pos) {
            // When it is, it's in the "/usr/share/zoneinfo/" folder
            $timezone = substr($filename, $pos + strlen("zoneinfo/"));
        } else {
            // If not, bail
            $timezone = $default;
        }
    }elseif(is_link("/etc/timezone")){
        // On other systems, like Ubuntu, there's file with the Olsen time
        // right inside it.
        $timezone = file_get_contents("/etc/timezone");
        if (!strlen($timezone)) {
            $timezone = $default;
        }
    }else{
        $timezone = $default;
    }
    date_default_timezone_set($timezone);
}
setTimezone('Europe/Paris');

if(isset($_GET['lang']))
	$_SESSION['lang'] = intval($_GET['lang']);
if(isset($_SESSION['userId']) && false){
    $_SESSION['lang'] = $sc->getUserById($_SESSION['userId'])['lang'];
}
    
if(isset($_SESSION['lang']))
	$lang = $_SESSION['lang'];
else
    $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
