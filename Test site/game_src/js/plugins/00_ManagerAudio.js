AudioManager.playShoot							= function() {
	var _SE = {};
	_SE.name = "03Z_sh_" + $gameParty.leader().equips()[0].id;
	_SE.volume = 90;
	_SE.pitch = 100;
	_SE.pan = 0;
	AudioManager.playSe(_SE);
}