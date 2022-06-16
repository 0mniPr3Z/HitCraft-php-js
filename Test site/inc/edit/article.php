<?php
$art = $sc->getArticle($pg2);
if(isset($pg3))
	$langtmp = $pg3;
else
	$langtmp = $lang;
if($sc->playerCanEditArt($art)){
	include'inc/texteditor.php';
}
?>
<script>
window.addEventListener("beforeunload", function (e) {
	e.preventDefault();
	console.log("Affichage de la fenêtre modale.");
	e.returnValue = '';
});
</script>