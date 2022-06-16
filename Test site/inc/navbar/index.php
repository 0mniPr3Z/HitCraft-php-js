<nav class="navbar navbar-expand-lg navbar-dark navTitle">
	<div class="container-fluid">
		<?php include'inc/navbar/title.php'; ?>
		
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarScroll">
			<?php
				include'inc/navbar/main.php';
				include'inc/navbar/tools.php';
			?>
		</div>
	</div>
</nav>
<?php
if($pg != 0)include'inc/navbar/breadcrump.php';
?>