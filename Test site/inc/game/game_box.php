<div class="row playOnline">

	<div class="col-12" id="game">
		
		<div class="d-flex btn-group" style="margin: 0 1em 1em;">

			<button class="btn btn-primary btn-icon-text" id="playButton" onclick="gameLoad()" type="button" value="<?=$vocab['play'].' Demo'?>">
				<i class="fa-solid fa-play"></i>
				<span class="d-inline-block text-left">
					<?=$vocab['play'].' Demo'?>
				</span>
			</button>

			<button class="btn btn-primary btn-icon-text disabled" id="stopButton"  onclick="gameStop()" type="button" value="<?=$vocab['stop'].' Demo'?>">
				<i class="fa-solid fa-stop"></i>
				<span class="d-inline-block text-left">
					<?=$vocab['stop'].' Demo'?>
				</span>
			</button>
			<button class="btn btn-primary btn-icon-text disabled" id="expandButton" onclick="gameOnFull()" type="button" value="<?=$vocab['expand']?>">
				<i class="fa-solid fa-expand"></i>
				<span class="d-inline-block text-left">
					<?=$vocab['expand']?>
				</span>
			</button>
			<button class="btn btn-primary btn-icon-text disabled" id="expandButton" onclick="gameOnFull()" type="button" value="<?=$vocab['expand']?>">
				<i class="fa-solid fa-download"></i>
				<span class="d-inline-block text-left">
					<?=$vocab['expand']?>
				</span>
			</button>
		</div>
	</div>
	<div class="row" id="gamePlayer">
		<div class="gameHud preloadGame" id="plDiv"></div>
	</div>
</div>


<div class="mobile_dwld container">
	<div class="row">
		<div class="alert alert-danger" role="alert">
			<p>
				<i class="fa-solid fa-triangle-exclamation"></i>
				Votre écran n'a pas la résolution suffisante pour jouer au jeu.
				La version pour Mobile et petit écran est toujours en court de développement et sera très bientôt disponible.
			</p>
		</div>
	</div>
	<div class="d-flex btn-group">

		<button class="btn btn-outline-dark btn-icon-text md-6">
			<i class="fa-brands fa-apple mdi-36px"></i>
			<span class="d-inline-block text-left">
				<small class="font-weight-light d-block">Available on the</small>
				App Store
			</span>
		</button>
		
		<button class="btn btn-outline-dark btn-icon-text">
		<i class="fa-brands fa-google-play mdi-36px"></i>
			<span class="d-inline-block text-left">
				<small class="font-weight-light d-block">Get it on the</small>
				Google Play
			</span>
		</button>
	</div>
</div>