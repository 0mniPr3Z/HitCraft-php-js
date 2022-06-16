
var gameRunning = false;
var plDiv = document.querySelector("#plDiv");
plDiv.addEventListener('click',gameLoad);

function gameOnFull(){
	if(gameRunning){
		let elem = document.querySelector("#gameFrame");
		elem.requestFullscreen();
	}
}
function gameLoad(){
	if(gameRunning == false){
		let gameDiv = document.querySelector("#gamePlayer");
		gameDiv.innerHTML =
		'<iframe class="gameHud" id="gameFrame" src="" title="Beta" frameborder="0" scrolling="no" sandbox="allow-same-origin allow-scripts" allowfullscreen></iframe>';
	};

	let elem = document.querySelector("#gameFrame");
	elem.src='./game_src/'; gameFrame.focus();

	elem = document.querySelector("#playButton");
	elem.classList.add("disabled");

	elem = document.querySelector("#stopButton");
	elem.classList.remove("disabled");

	elem = document.querySelector("#expandButton");
	elem.classList.remove("disabled");

	gameRunning = true;
}

function gameStop(){
	if(gameRunning){
		let gameDiv = document.querySelector("#gamePlayer");
		gameDiv.innerHTML = '<div class="gameHud preloadGame" id="plDiv"></div>';
		let plDiv = document.querySelector("#plDiv");
		plDiv.addEventListener('click',gameLoad);
	}
	elem = document.querySelector("#playButton");
	elem.classList.remove("disabled");

	elem = document.querySelector("#stopButton");
	elem.classList.add("disabled");

	elem = document.querySelector("#expandButton");
	elem.classList.add("disabled");

	gameRunning = false;
}