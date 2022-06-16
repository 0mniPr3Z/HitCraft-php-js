<title>		<?=$site->get_title($lang).' '.$pg->get_name($lang)?>	</title>
<link rel="icon" type="image/x-icon" href="img/fav/<?=$pg->get_favi()?>">

<?php
include'inc/head/meta.php';
?>

<!-- JS Code -->
<?php include'libs/simcraft_jslibs.php';?>
<!-- Core theme CSS (includes Bootstrap)-->
<link rel="stylesheet" 		href="css/styles.css">
<!-- Highlight Code -->
<link rel="stylesheet" 		href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/monokai-sublime.min.css">
<!-- Personnal CSS-->

<link rel="stylesheet" 		href="css/global.css">
<link rel="stylesheet" 		href="css/preloader.css">
<link rel="stylesheet" 		href="css/nav.css">
<link rel="stylesheet" 		href="css/<?=$sc->get_page($pg)['name_en']?>.css"><?php
if($pg == 16){?>
	<link rel="stylesheet" 		href="css/<?=$sc->get_page($pg2)['name_en']?>.css">
<?php } ?>
<link rel="stylesheet" 		href="css/pagination.css">
<link rel="stylesheet" 		href="css/footer.css">
<!-- Personnal CSS
<link rel="stylesheet" 		href="css/progress.css">
<link rel="stylesheet" 		href="css/forum.css">
<link rel="stylesheet" 		href="css/blog.css">
<link rel="stylesheet" 		href="css/gamehud.css">*/
-->
