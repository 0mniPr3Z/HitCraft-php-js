var _alias								= _alias || {};
_alias.scnMap_init						= Scene_Map.prototype.initialize;
_alias.scnMap_start						= Scene_Map.prototype.start;
_alias.scnMap_update					= Scene_Map.prototype.update;

Scene_Map.prototype.initialize			= function() {
	this.sc_needRefresh		= 0;
	this.sc_lapsetime		= 2;
	this.isReloading 		= false;
	this.waitShootPerc		= 0;
	this.sc_inputWait		= 8;

	_alias.scnMap_init.call(this);
}
Scene_Map.prototype.start				= function() {
    _alias.scnMap_start.call(this);
	this.createMapHud();
}
Scene_Map.prototype.createMapHud		= function() {
	this._mapHud = new Window_MapHud();
	this._mapHud.opacity = 0;
	this.addWindow(this._mapHud);
}
Scene_Map.prototype.update				= function() {
    _alias.scnMap_update.call(this);
	this.sc_update();
	this._mapHud.refresh();		
}
Scene_Map.prototype.sc_update			= function() {
	if(this.sc_needRefresh <= 0){
		this.sc_updateInput();
		this.updateStamina();
		//this.sc_updateMapEvents();
		this.sc_needRefresh = this.sc_lapsetime;
	}else{
		this.sc_needRefresh--;
	}
}
Scene_Map.prototype.sc_updateInput		= function() {
	let weapon = $gameParty.leader().equips()[0];
	if(!weapon)
		weapon = $dataWeapons[1];
	if(this.sc_isInputReady()){
		console.log("INPUT");
		if(weapon.wtypeId > 2){
			if(Input.keyTriggered("R") && $gameSystem.isShootActivate){
				this.sc_reload(weapon);
			}
		}else{
			if(Input.keyPressed("R") && $gameSystem.isShootActivate){
				this.sc_defend();
			}
			if(Input.keyReleased("R")){
				this.sc_stopDefend();
			}
		}
		if((Input.keyTriggered("E") || Input.keyPressed("E")) && $gameSystem.isShootActivate){
			this.sc_shoot(weapon);
			console.log("INPUT E");
		}
	}
}
Scene_Map.prototype.sc_isInputReady				= function() {
	if($gameSystem.isReloading)
		return false;
	if(this.sc_inputWait > 0){
		this.sc_inputWait--;
		return false;
	}
	this.sc_inputWait = 20;
	return true;
}
Scene_Map.prototype.sc_shoot			= function(weapon) {
	if(this.isShootReady(weapon)){
			this.waitShootingPerc = 0;
			this.proceedShoot(weapon);
	}
}
Scene_Map.prototype.isShootReady	= function(weapon) {
	if(this.isShootLapseOk(weapon) && this.isStaminaOk(weapon.params[5] * -1)){
		if(this.checkMunit(weapon)){
			var _wtypeId = weapon.wtypeId;
			if(this.isReloading)
				return false;
			if($gamePlayer.isDashing && (_wtypeId == 9 || _wtypeId == 6)) // arme lourde on peut pas tirer et courir
				return false;
			return true;
		}
	}
	return false;
}
Scene_Map.prototype.isShootLapseOk		= function(weapon) {
	if(this.waitShootPerc <= 0){
		this.waitShootPerc = weapon.params[3];
		return true;
	}
	return false;
}
Scene_Map.prototype.isStaminaOk						= function(staminaCost) {
	var staminaCost = staminaCost || 0;
	if($gameParty.leader().param(1) <= Math.floor($gameParty.leader().mmp/5) || $gameParty.leader().mp < $gameParty.leader().hp /5 || $gameParty.leader().mp < staminaCost)
		return false;
    return true;
}
Scene_Map.prototype.checkMunit						= function(weapon) {
	if(weapon.wtypeId > 2){
		var _munitId = weapon.params[7];
		var _munitNum = $gameParty.GFS_getNumItemsById(_munitId);
		if(_munitNum == 0){
			AudioManager.playAmmoOut();
			return false;
		}
	}
	return true;
}
Scene_Map.prototype.proceedShoot					= function(weapon) {
	$gamePlayer.SC_action	= 1;
	this.isShooting			= true;
	this.waitShootPose		= 30;
	$gamePlayer.bulletsMoved = $gamePlayer.bulletsMoved || [];
	let _event;

	if(weapon.wtypeId > 2){
		this.consumeMunit(weapon);
	}
	this.consumeStamina(weapon);
	$gamePlayer.refresh();

	for(var i = 1; i < 20; i++){
		_event = $gameMap.event(i);
		if(_event._x == i && _event._y == 0 && $gamePlayer.bulletsMoved[i] != 0){
			let key = [$gameMap.mapId(), i, "A"];
			AudioManager.playShoot();
			_event.setPosition($gamePlayer._x, $gamePlayer._y);
			_event.setDirection($gamePlayer._direction);
			$gamePlayer.bulletsMoved[i] = 0;
			$gameSelfSwitches.setValue(key, true);
			_event.setImage('bullet_' + weapon.id , 0);
			i = 21;
		}
	}
}
Scene_Map.prototype.consumeStamina				= function(weapon){
	$gameParty.leader().gainMp(weapon.params[3] * -1);
}