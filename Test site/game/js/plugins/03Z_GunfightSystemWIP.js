/*
	
	
Usables vanilla functions:
___________________________
$gameMap.distance(x1, y1, x2, y2);
$gameMap.isBoatPassable(x, y);
$gameMap.terrainTag(x, y);
$gameMap.updateEvents()
$gameMap.encounterList();
$gameMap.encounterStep();


Game_Player.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
        return false;
    }
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    if (this.isInVehicle() && !this.vehicle().canMove()) {
        return false;
    }
    return true;
};




Game_Map.prototype.checkPassage = function(x, y, bit) {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];
        if ((flag & 0x10) !== 0)  // [*] No effect on passage
            continue;
        if ((flag & bit) === 0)   // [o] Passable
            return true;
        if ((flag & bit) === bit) // [x] Impassable
            return false;
    }
    return false;
};

Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};

*/

var _aliasGFS									= _aliasGFS || {};
_aliasGFS._DataMana_loaDat						= DataManager.loadDatabase;
_aliasGFS._DataMana_isDatLoa					= DataManager.isDatabaseLoaded;

_aliasGFS._gamSys_init							= Game_System.prototype.initialize;
_aliasGFS._DataMana_setNewGam					= DataManager.setupNewGame;
_aliasGFS._gamCharBas_init						= Game_CharacterBase.prototype.initialize;
_aliasGFS._gamPlay_init							= Game_Player.prototype.initialize;
_aliasGFS._gamPlay_refr							= Game_Player.prototype.refresh;
_aliasGFS._gamMap_isDashDis						= Game_Map.prototype.isDashDisabled;
_aliasGFS._scenMana_run							= SceneManager.run;
_aliasGFS._scenMap_upda							= Scene_Map.prototype.update;
_aliasGFS._scenMap_star							= Scene_Map.prototype.start;
_aliasGFS._scenMap_init							= Scene_Map.prototype.initialize;

//DEBUG TOOLS
_aliasGFS._debug								= true;
_aliasGFS.openConsole							= function() {
  if (Utils.isNwjs() || Utils.isOptionValid('test')) {
    var _debugWindow = require('nw.gui').Window.get().showDevTools();
    if (_debugWindow) _debugWindow.moveTo(0, 0);
  }
};
_aliasGFS.log									= function(content) {
	if(this._debug)
		console.log(content);
};
_aliasGFS.info									= function(content) {
	if(this._debug){
		console.error("GFS DEBUG");
		console.info(content);
	}
};
_aliasGFS.toDo									= function(){
	_aliasGFS.info("Hud Sprite OK!");
	_aliasGFS.info("Character OK!");
	_aliasGFS.info("Sound OK!");
	_aliasGFS.info("Data munitType OK!");
	_aliasGFS.info("Reload OK! (padd + type)");
}

//SCENE MANAGER RESOLUTION
SceneManager._screenWidth  = 1280;
SceneManager._screenHeight = 720;
SceneManager._boxWidth     = 1280;
SceneManager._boxHeight    = 720;
SceneManager.run = function(sceneClass) {
	_aliasGFS._scenMana_run.call(this, sceneClass);
	this.updateResolution();
	if (!Utils.isNwjs()) return;
	if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= "1.6.0") return;
	if (_aliasGFS._debug) _aliasGFS.openConsole();
};
SceneManager.updateResolution = function() {
	var resizeWidth = 1280 - window.innerWidth;
	var resizeHeight = 720 - window.innerHeight;
	window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
};

//IMAGE MANAGER
ImageManager.GFS_loadHud						= function(filename) {
    return this.loadBitmap('img/hud/', filename, 0, true);
};

//AUDIO MANAGER
AudioManager.GFS_playAmmoOut					= function() {
	var _se = {};
	_se.volume=100;
	_se.pitch=100;
	_se.pan=0;
	_se.name="03Z_ammoOut";
	this.playSe(_se);
}
AudioManager.GFS_playReload						= function(step) {
	var _step;
	if(step)
		_step = "_" + step
	else
		_step = "";
	var _armeId = $gameParty.leader().equips()[0].id;
	var _se = {};
	_se.volume = 100;
	_se.pitch = 100;
	_se.pan = 0;
	_se.name = "03Z_reload_" + _armeId + _step;
	AudioManager.playSe(_se);
}
AudioManager.GFS_playShoot					= function() {
	var _SE = {};
	_SE.name = "03Z_sh_" + $gameParty.leader().equips()[0].id;
	_SE.volume = 90;
	_SE.pitch = 100;
	_SE.pan = 0;
	AudioManager.playSe(_SE);
}

//DATAMANAGER
// -> Chargement des fichiers Json du jeu
DataManager.loadDatabase						= function() {
	_aliasGFS._DataMana_loaDat.call(this);
	this.GFS_loadDatabase();
};
DataManager.isDatabaseLoaded					= function() {
    if (!_aliasGFS._DataMana_isDatLoa.call(this)) {
		return false;
	}else{
		return this.GFS_isDatabaseLoaded();
	}
};
DataManager.GFS_loadDatabase					= function() {
    for (var i = 0; i < this.GFS_databaseFilesList().length; i++) {
        var name = this.GFS_databaseFilesList()[i].name;
        var src = this.GFS_databaseFilesList()[i].src;
        this.GFS_loadDataFile(name, src);
    }
};
DataManager.GFS_databaseFilesList				= function() {
	return [
		{name: '$dataArm',		src: 'Weapons.json'},
		{name: '$dataPj',		src: 'Actors.json'},
		{name: '$dataAmmo',		src: 'Ammo.json'}
	];
};
DataManager.GFS_loadDataFile					= function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/GFS/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
	
    xhr.onload = function() {
        if (xhr.status < 400) {
           window[name] = JSON.parse(xhr.responseText);
		   DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
};
DataManager.GFS_isDatabaseLoaded				= function() {
    this.checkError();
    for (var i = 0; i < this.GFS_databaseFilesList().length; i++) {
        if (!window[this.GFS_databaseFilesList()[i].name]) {
            return false;
        }
    }
    return true;
};

//GAME SYSTEM
Game_System.prototype.initialize				= function() {
	this.GFS_HudNeedRefresh = true;
	this.GFS_HudVisible = true;
	_aliasGFS._gamSys_init.call(this);
	_aliasGFS.toDo();
};

//GAME CHARACTER BASE
Game_CharacterBase.prototype.initialize			= function() {
	_aliasGFS._gamCharBas_init.call(this);
	this.GFS_action = 0;
};
Game_CharacterBase.prototype.GFS_getCharName	= function(hp, enemyId) {
	return $dataEnemies[enemyId].name + "_" + this.GFS_getCharIdByHp(hp, $dataEnemies[enemyId].params[0]);
};
Game_CharacterBase.prototype.GFS_getCharIdByHp	= function(hp, mhp) {
	var _rate = hp / mhp;
	if(_rate > 0.8)
		return 0;
	if(_rate > 0.4)
		return 1;
	return 2;
};
Game_CharacterBase.prototype.GFS_getCharIndexByHp	= function(hp, mhp) {
	var _rate = hp / mhp;
	if(_rate > 0.8)
		return 4;
	if(_rate > 0.6)
		return 0;
	if(_rate > 0.4)
		return 4;
	if(_rate > 0.2)
		return 0;
	return 4;
};
//GAME PLAYER
// -> Character visual
Game_Player.prototype.initialize				= function() {
    _aliasGFS._gamPlay_init.call(this);
	this.GFS_armeSlot = 0;
	this.GFS_stamina = 0;
	this.GFS_waitDash = 0;
	this.GFS_bullets = [0, false, false, false, false, false, false, false, false, false, false];
	this.GFS_bulletsMove = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.GFS_usedGilet = 0;
	this.GFS_waitShootPerc = 0;
};
Game_Player.prototype.GFS_getArmeData			= function() {
	var _actor = $gameParty.leader();
	if(_actor){
		if(!$gameActors.actor(_actor.actorId()).equips()[0])
			$gameActors.actor(_actor.actorId()).changeEquip(0, $dataWeapons[1]);
		return $gameActors.actor($gameParty.leader().actorId()).equips()[0];
	}else{
		return $dataWeapons[1];
	}
}
Game_Player.prototype.GFS_getPlayerChar			= function() {
	var  _actor = $gameParty.leader();
	var _armeId = this.GFS_getArmeData().id;
	var _tenueId;
	if (_actor.equips()[5])
		_tenueId = _actor.equips()[5].id;
	else
		_tenueId = 60;
	if(this.GFS_action < 6)
		return this.GFS_getBasicPlayerChar(_actor, _tenueId, _armeId);
	else{
		return this.GFS_getSpecialChar(_actor, _tenueId);
	}
};
Game_Player.prototype.GFS_getSpecialChar		= function(actor, tenueId) {
	return $dataPj[_actor.actorId()].characterName + "-" + tenueId + "_s";
}
Game_Player.prototype.GFS_getBasicPlayerChar	= function(actor, tenueId, armeId) {
	return $dataPj[actor.actorId()].characterName + "-" + tenueId + "_" + armeId;
}
Game_Player.prototype.GFS_setVisualChar			= function(){
	var _chIndex = this.GFS_getPlayerAction;
	var _chName = this.GFS_getPlayerChar();
	if(this.GFS_getPlayerAction == 6)
		_chIndex = 4;
	if(_chIndex > 6)
		_chIndex -= 6;
	this.setImage(_chName,_chIndex);
};
Game_Player.prototype.GFS_getPlayerAction		= function() {
	if(this.isDashing()){
		return 4;
	}else{
		return this.GFS_action;
	}
}
Game_Player.prototype.refresh					= function() {
	_aliasGFS._gamPlay_refr.call(this);
    var actor = $gameParty.leader();
    var characterName = actor ? this.GFS_getPlayerChar() : '';
    var characterIndex = actor ? this.GFS_getPlayerAction() : 0;
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
	if(this.GFS_isReload)
		this.GFS_refreshReload();
};
// -> Change d'arme
Game_Player.prototype.GFS_changeArme			= function(slotId) {
	if(slotId == 0 || !slotId){
		_actor._equips[0].setObject($dataWeapons[1]);
	}else{
		_actor = $gameParty.leader() || $gameActors.actor(1);
		if(_actor.equips()[slotId])
			_actor._equips[0].setObject($dataWeapons[_actor.equips()[slotId].id]);
	}
	this.refresh();
}
Game_Player.prototype.GFS_armePrincipale		= function() {
	this.GFS_changeArme(1);
}
Game_Player.prototype.GFS_armeSecondaire		= function() {
	this.GFS_changeArme(2);
}
Game_Player.prototype.GFS_Accessoire			= function() {
	this.GFS_changeArme(4);
}
// -> Reload
Game_Player.prototype.GFS_reload				= function() {
	if($dataArm[$gameParty.leader().equips()[0].id].loadType == 0 || this.GFS_isReload || this._action == 1){
		return;
	}else if(this.GFS_usePackMunit()){
		this.GFS_isReloaded = false;
		this.GFS_isReload = true;
		this.GFS_action = 2;
		this.GFS_reloadWait = 0;
		this.refresh();
	}else{
		AudioManager.GFS_playAmmoOut();
	}
};
Game_Player.prototype.GFS_usePackMunit			= function() {
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armeGFS = $dataArm[_armeId];
	var _munitP = $dataItems[_armeGFS.munitPack];
	var _munit = $dataItems[_armeGFS.munit];
	if($gameParty.numItems(_munit) < _armeGFS.loadCap && $gameParty.hasItem(_munitP)){
		$gameParty.loseItem(_munitP, 1);
		return true;
	}
	return false;
}
Game_Player.prototype.GFS_refreshReload			= function() {
	switch($dataArm[$gameParty.leader().equips()[0].id].loadType){
		case 0:
			break;
		case 1:
			this.GFS_refreshNormalReload();
			break;
		case 2:
			this.GFS_refreshOneByOneReload();
			break;
		default:
			break;
	}
	if(this.GFS_isReloaded){
		this.GFS_isReload = false;
		this.GFS_action = 0;
		this.refresh();
	}
};
Game_Player.prototype.GFS_refreshNormalReload	= function(){
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armeGFS = $dataArm[_armeId];
	var _munit = $dataItems[_armeGFS.munit];
	if($gameParty.numItems(_munit) < _armeGFS.loadCap){
		$gameParty.gainItem(_munit, Math.min(_armeGFS.loadCap, _armeGFS.loadCap - $gameParty.numItems(_munit)));
		AudioManager.GFS_playReload();
	}
	
	if(this.GFS_reloadWait <= _armeGFS.loadPerc){
		this.GFS_reloadWait++;
	}else{
		this.GFS_isReloaded = true;
	}
};
Game_Player.prototype.GFS_refreshOneByOneReload	= function(){
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armeGFS = $dataArm[_armeId];
	var _munit = $dataItems[_armeGFS.munit];
	if($gameParty.numItems(_munit) <= _armeGFS.loadCap){
		if(this.GFS_reloadWait <= _armeGFS.loadPerc){
			this.GFS_reloadWait++;
		}else{
			if($gameParty.numItems(_munit) == _armeGFS.loadCap - 1){
				this.GFS_isReloaded = true;
				$gameParty.gainItem(_munit, 1);
				AudioManager.GFS_playReload(2);
			}else{
				$gameParty.gainItem(_munit, 1);
				AudioManager.GFS_playReload(1);
				this.GFS_reloadWait = 0;
			}
		}
	}	
	
};
// -> Shoot
Game_Player.prototype.GFS_shoot					= function() {
	if($gamePlayer.GFS_isLatencyOk())
		if(this.GFS_isShootReady())
			if(this.GFS_checkMunit()){
				this.GFS_waitShootingPerc = 0;
				this.GFS_proceedShoot();
			}
};
Game_Player.prototype.GFS_isShootReady			= function() {
	var _arme = $gameParty.leader().equips()[0];
	var _wtypeId = _arme.wtypeId;
	if($gamePlayer.GFS_isReload)
		return false;
	if($gamePlayer.isDashing && (_wtypeId == 12 || _wtypeId == 9 || _wtypeId == 6)) // arme lourde on peut pas tirer et courir
		return false;
	return true;
};
Game_Player.prototype.GFS_isLatencyOk			= function() {
	if(this.GFS_waitShootPerc <= 0){
		this.GFS_waitShootPerc = $dataArm[$gameParty.leader().equips()[0].id].perc;
		return true;
	}
	return false;
};
Game_Player.prototype.GFS_proceedShoot			= function() {
	this.GFS_consumeMunit();
	this.GFS_action = 1;
	this.GFS_isShooting = true;
	this.GFS_waitShootPose = 30;
	var _event;
	for(var i = 1; i < 11; i++){
		_event = $gameMap.event(i);
		_aliasGFS.log("balle "+1+":");
		if(_event._x == i && _event._y == 0 && !this.GFS_bullets[i]){
			AudioManager.GFS_playShoot();
			_event.setImage(this.GFS_getPlayerChar() , 7);
			_event.setPosition($gamePlayer._x, $gamePlayer._y);
			_event.setDirection($gamePlayer._direction);
			//_event.setMoveRoute(this.GFS_getBulletMoveRoute());
			this.GFS_bullets[i] = true;
			$gameSwitches.setValue(40 + i, true);
			i = 11;
		}
	}
};
// -> Munit
Game_Player.prototype.GFS_checkMunit			= function() {
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armeGFS = $dataArm[_armeId];
	var _munitObj = $dataItems[_armeGFS.munit];
	var _munitNum = $gameParty.numItems(_munitObj);
	if( _armeId >= 7 && _munitNum == 0){
		AudioManager.GFS_playAmmoOut();
		return false;
	}
	return true;
};
Game_Player.prototype.GFS_consumeMunit			= function() {
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armeGFS = $dataArm[_armeId];
	var _munitObj = $dataItems[_armeGFS.munit];
	$gameParty.loseItem(_munitObj, 1);
};
// -> Bullet Setup
Game_Player.prototype.GFS_resetBullet			= function(id) {
	this.GFS_bullets[id] =false;
	this.GFS_bulletsMove[id] = 0;
	$gameSwitches.setValue(40 + id, false);
	var _event = $gameMap.event(id);
	_event.setImage("" , 0);
	_event.setPosition(id, 0);
	_event.setDirection(8);
};
//-> Stamina
Game_Player.prototype.GFS_updateStamina			= function() {
	if(this.GFS_waitDash <= 0){
		if($gamePlayer.GFS_stamina <= $gameParty.leader().hp && $gamePlayer.isDashing())
			$gamePlayer.GFS_stamina = Math.min($gameParty.leader().hp, $gamePlayer.GFS_stamina + 5);
		else if(!$gamePlayer.isDashing())
			if(!$gamePlayer.isMoving())
				$gamePlayer.GFS_stamina = Math.max(0, $gamePlayer.GFS_stamina - 5);
			else
				$gamePlayer.GFS_stamina = Math.max(0, $gamePlayer.GFS_stamina - 1);
		this.GFS_waitDash = 30;		
	}else{
		this.GFS_waitDash--;
	}
}
// -> Gilet
Game_Player.prototype.GFS_getGiletValue	= function() {
	var _giletValue =$gameParty.leader().equips()[5].params[3];
	return Math.max(Math.min(_giletValue,  _giletValue - this.GFS_usedGilet),0);
}
// -> Respawn
Game_Player.prototype.executeEncounter = function() {
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        this.makeEncounterCount();
        return true;
    } else {
        return false;
    }
};
//===================== BULLET MOVE WIP
Game_Player.prototype.GFS_getBulletMoveRoute	= function() {
	var _armeGFS = $dataArm[$gameParty.leader().equips()[0].id];
	var _list = [];
	for(i = 0; i <= _armeGFS.range; i++){
		_list.push({"code":12,"indent":null});
	}
	_list.push({"code":41, "parameters":["", 0], "indent":null});
	_list.push({"code":0});
	var _moveRoute = {};
	_moveRoute.list = _list;
	_moveRoute.repeat = false;
	_moveRoute.skippable = false;
	_moveRoute.wait = true;
	
	
};
//====================================

//GAMEMAP
Game_Map.prototype.isDashDisabled				= function() {
	if($gamePlayer.GFS_stamina >= $gameParty.leader().hp - 10)
		return true;
    return _aliasGFS._gamMap_isDashDis.call(this);
};

// SCENE BASE
Scene_Base.prototype.GFS_isRandomOk				= function(rate){
	var _rand = Math.random();
	_aliasGFS.log("Random:" + _rand);
	return rate >= _rand;
	
}

//SCENE MAP
Scene_Map.prototype.initialize					= function() {
	this.GFS_Hud_needRefresh = 0;
	this.GFS_inputWait = 0;
	this.GFS_bulletIndex = 1;
	this.GFS_enemies = [];
	_aliasGFS._scenMap_init.call(this);
};
Scene_Map.prototype.start						= function() {
    _aliasGFS._scenMap_star.call(this);
	this.GFS_createHUD();
};
Scene_Map.prototype.update						= function() {
    _aliasGFS._scenMap_upda.call(this);
	this._Hud1.refresh();
	$gamePlayer.refresh();
	this.GFS_updateInput();
	$gamePlayer.GFS_updateStamina();
	this.GFS_updateShoot();
	this.GFS_updateHit()
};
// -> Shootupdate
Scene_Map.prototype.GFS_updateShoot				= function() {
	this.GFS_updateShootPerc();
	//this.GFS_updateAllBullets();
}
Scene_Map.prototype.GFS_updateShootPerc			= function() {
	if($gamePlayer.GFS_waitShootPerc > 0)
		$gamePlayer.GFS_waitShootPerc--;
	else if ($gamePlayer.GFS_action == 1 && $gamePlayer.GFS_waitShootPose <=0)
		$gamePlayer.GFS_action = 0;
	else
		$gamePlayer.GFS_waitShootPose--;
};
// -> Hud
Scene_Map.prototype.GFS_createHUD				= function(id) {
	this._Hud1 = new GFS_Hud();
	this._Hud1.opacity = 0;
	this.addWindow(this._Hud1);
};
Scene_Map.prototype.GFS_isInputReady			= function() {
	if($gamePlayer.GFS_isReload)
		return false;
	if(this.GFS_inputWait > 0){
		this.GFS_inputWait--;
		return false
	}
	return true;
}
// -> Input
Scene_Map.prototype.GFS_updateInput				= function() {
	if(this.GFS_isInputReady()){
		if(Input.keyTriggered("R")){
			$gamePlayer.GFS_reload();
		}
		if(Input.keyTriggered("J")){
			$gamePlayer.GFS_armePrincipale();
			this.GFS_inputWait = 4;
		}
		if(Input.keyTriggered("K")){
			$gamePlayer.GFS_armeSecondaire();
			this.GFS_inputWait = 4;
		}
		if(Input.keyTriggered("I")){
			SceneManager.push(Scene_Equip);
			this.GFS_inputWait = 4;
		}
		if(Input.keyTriggered("E") || Input.keyPressed("E")){
			$gamePlayer.GFS_shoot();
			this.GFS_inputWait = 4;
		}
	}
}
//-> Encounter + Respawn
Scene_Map.prototype.updateEncounter				= function() {
	if ($gamePlayer.executeEncounter()) {
		_aliasGFS.log("check respawn");
		this.GFS_checkRespawn();
	}
};
Scene_Map.prototype.GFS_checkRespawn			= function() {
	var _encounterList = $gameMap.encounterList();
	for (i = 0; i < _encounterList.length; i++){
		var _respawn = _encounterList[i];
		_aliasGFS.log(_respawn);
		var _x = _respawn.regionSet[0];
		var _y = _respawn.regionSet[1];
		_aliasGFS.log("x:"+ _x +" / y:"+ _y);
		if(!this.GFS_enemies[i]){
			if(this.GFS_isFarEnoughtToRespawn(_x, _y)){
				_aliasGFS.log("... is far enought OK");
				if(this.GFS_isRandomOk(_respawn.weight /100)){
					_aliasGFS.log("rate encounter = " + _respawn.weight + "% -> " + _respawn.weight/100);
					var _eventId = _respawn.regionSet[2];
					var _enemyId = _respawn.troopId;
					this.GFS_respawn(_eventId, _x, _y, _enemyId);
					this.GFS_enemies[i] = true;
					i = _encounterList.length;
				}
			}
		}
	}
}
Scene_Map.prototype.GFS_isFarEnoughtToRespawn	= function (x, y){
	var _distX = $gameMap.deltaX(x, $gamePlayer._x);
	var _distY = $gameMap.deltaY(y, $gamePlayer._y);
	_aliasGFS.log("distance X = " + _distX + "/ Y = " + _distY);
	if(_distX < 0)
		_distX *= -1;
	if(_distY < 0)
		_distY *= -1;
	_aliasGFS.log("distance X = " + _distX + "/ Y = " + _distY);
	return _distX > 11 || _distY > 7;
}
Scene_Map.prototype.GFS_respawn					= function(eventId, x, y, enemyId){
	var _event = $gameMap._events[eventId];
	$gameMap._events.push(_event);
	_event = $gameMap._$gameMap._events[lenght - 1];
	_event.GFS_enemyId = enemyId;
	_event.GFS_hp = $dataEnemies[enemyId].params[0];
	_event.setPosition(x, y);
	var _keyActiv = [$gameMap.mapId(), eventId, "A"];
	var _chName = _event.GFS_getCharName(_event.GFS_hp, enemyId);
	var _chIndex = _event.GFS_action + this.GFS_getCharIndexByHp(_event.GFS_hp, $dataEnemies[enemyId].params[0]);
	_event.setImage( _chName, _chIndex);
	$gameSelfSwitches.setValue(_keyActiv,true);
}
// -> Refresh enemy
Scene_Map.prototype.GFS_updateEnemies			= function(){
	for(i = 1; i < $gameMap._envents.length; i++){
		if(this.GFS_enemies[i] && $gameMap._events[i].GFS_hp >= 1){
			this.updateEnemy(i);
		}
	}
}
Scene_Map.prototype.GFS_updateEnemy				= function(id){
};
// -> Hit
Scene_Map.prototype.GFS_updateHit				= function() {
	for(eventId = 11; eventId < $gameMap._events.lenght; eventId++){
		if(this.GFS_isHitable(eventId)){
			for(bulletId = 1; bulletId < 11; bulletId++){
				this.GFS_updateBulletHitEvent(bulletId, eventId);
			}
		}
	}
};
Scene_Map.prototype.GFS_updateBulletHitEvent	= function(bulletId, eventId) {
	var _bullet = $gameMap.event(bulletId);
	var _event = $gameMap.event(eventId);
	
	var _distX = $gameMap.deltaX(_event._x, _bullet._x);
	var _distY = $gameMap.deltaY(_event._y, _bullet._y);
	
	
	if(this.GFS_isInHitRange(_distX, _distY) && this.GFS_isHitActorSkill())
		this.GFS_performHit(bulletId, eventId);
};
Scene_Map.prototype.GFS_performHit				=  function(bulletId, eventId) {
	$gamePlayer.GFS_resetBullet(bulletId);
	var _keyAlert = [$gameMap.mapId(), eventId, "B"]; 				//  A:actif, B: alert, C:hurt
	var _keyHurt = [$gameMap.mapId(), eventId, "C"];				//  A:actif, B: alert, C:hurt
	$gameSelfSwitches.setValue(_keyHurt,true);
	if(!$gameSelfSwitches.value(_keyAlert))
		$gameSelfSwitches.setValue(_keyAlert,true);
	
	this.GFS_dmgTarget(eventId);
};
Scene_Map.prototype.GFS_isHitable				= function(id) {
	return
		$gameMap._events[id] != undefined
		&& $gameMap._events[id].GFS_hp
		&& $gameMap._events[id].GFS_hp > 0
};
Scene_Map.prototype.GFS_isInHitRange			= function (x, y){
	var _distX = $gameMap.deltaX(x, $gamePlayer._x);
	var _distY = $gameMap.deltaY(y, $gamePlayer._y);
	if(_distX < 0)
		_distX *= -1;
	if(_distY < 0)
		_distY *= -1;
	return _distX <= $dataArm[$gameParty.leader().equips()[0].id].dispersion && _distY <= $dataArm[$gameParty.leader().equips()[0].id].dispersion;
}
Scene_Map.prototype.GFS_dmgTarget				= function(eventId) {
	var _event = $gameMap._events[eventId];
	var _hpValue = _event.GFS_hp;
	var _enemyId = _event.GFS_enemyId;
	var _enemy = $dataEnemies[_enemyId];
	_event.GFS_action = 2;
	
	var _chName = _event.GFS_getCharName(_event.GFS_hp, enemyId);
	var _chIndex = _event.GFS_action + this.GFS_getCharIndexByHp(_event.GFS_hp, _enemy.params[0]);
	_event.setImage( _chName, _chIndex);
	
	_event.GFS_hp = Math.max(0,  _event.GFS_hp  - this.GFS_getTotalDmg(_enemy));
}
Scene_Map.prototype.GFS_getTotalDmg				= function(enemy) {
	return this.GFS_getArmeDmg() - this.GFS_getPerfDebuff(enemy)
};
Scene_Map.prototype.GFS_getPerfDebuff			= function(enemy) {
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armeGFS = $dataArm[_armeId];
	return Math.max(0, enemy.params[4] - _armeGFS.perf);
}
Scene_Map.prototype.GFS_getArmeDmg					= function() {	
	var _armeId = $gameParty.leader().equips()[0].id;
	var _armePwr = $dataArm[_armeId].dgts;
	if(_armeId <= 6)
		_armePwr += $gameParty.leader().atk;
	return Math.floor(_armePwr * (Math.random() * 0.4 + 0.8));
}

//==================== BULLET MOVE WIP
Scene_Map.prototype.WIP__GFS_updateEnemy				= function(id){
	if($gameMap._events[i].GFS_action == 0){
		//if(this._events[i].isNeerPlayer());
	}
}
Scene_Map.prototype.WIP__GFS_updateAllBullets		= function() {
	for(i = 1; i < 11; i++){
		if($gamePlayer.GFS_bullets[i]){
				this.GFS_updateBullet(i);
				this.GFS_checkHit(i);
				this.GFS_checkRange(i);
		}
	}
}
Scene_Map.prototype.WIP__GFS_updateBullet			= function(id) {
	var _event = $gameMap.event(id);
	if(_event.charcaterName == ""){
		$gamePlayer.GFS_resetBullet(id);
	}
};
Scene_Map.prototype.WIP__GFS_checkRange				= function(id) {

};
//====================================


//WINDOWS BASE
Window_Base.prototype.GFS_drawLayer				= function(name, x, y) {
	var bitmap = ImageManager.GFS_loadHud(name);
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, -2 + x, -4 + y);
};
Window_Base.prototype.GFS_drawWeapon2			= function(arme, x , y) {
	var _arme = arme - 1;
	var width = 64;
	var height = 32;
	var nbrLine = 6;
	var bitmap = ImageManager.GFS_loadHud('arme');
	var pw = width;
	var ph = height;
	var sx = _arme % nbrLine * pw; // position x sur le factionset
	var sy = Math.floor(_arme / nbrLine) * ph; // position y sur le factionset
	this.contents.blt(bitmap, sx, sy, pw/2, ph, x, y);
};
Window_Base.prototype.GFS_drawWeapon			= function(arme, x , y) {
	var _arme = arme - 1;
	var width = 64;
	var height = 32;
	var nbrLine = 6;
	var bitmap = ImageManager.GFS_loadHud('arme');
	var pw = width;
	var ph = height;
	var sx = _arme % nbrLine * pw; // position x sur le factionset
	var sy = Math.floor(_arme / nbrLine) * ph; // position y sur le factionset
	this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};
// -> draw life + stamina
Window_Base.prototype.GFS_drawLife				= function(x, y) {
	if($gamePlayer.GFS_getGiletValue() > 0)
		this.GFS_drawGiletFill(x, y);
    this.GFS_drawLifeFill(x, y);
	this.GFS_drawStaminaFill(x, y);
	
}
Window_Base.prototype.GFS_drawLifeFill			= function(x, y) {
	var width = 64;
	var _x = 6 + x;
	var _y = -24 + y;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(_x, _y, width, $gameParty.leader().hpRate(), color1, color2);
};
Window_Base.prototype.GFS_drawStaminaFill		= function(x, y) {
	var width = 64;
	var rate = $gamePlayer.GFS_stamina / $gameParty.leader().mhp;
	var _y = this.lineHeight() - 32 + y;
	var fillW = Math.floor(width * rate);
	var _x = width - fillW + 6 + x;
	
    var color1 = this.hpGaugeColor2();
    var color2 = this.crisisColor();
	this.contents.gradientFillRect(_x, _y, fillW, 6, color1, color2);
};
Window_Base.prototype.GFS_drawGiletFill			= function(x, y) {
	var _giletValue = $gamePlayer.GFS_getGiletValue();
	var _x = 6  + x - _giletValue;
	//_aliasGFS.log("GILET:"+_giletValue);
	var width = 64 + _giletValue * 2;
	var height = 6 + _giletValue * 2;
	var _y = this.lineHeight() - 32 - _giletValue + y;
	this.contents.fillRect(_x, _y, width, height, this.textColor(9));
}
// -> Draw munit
Window_Base.prototype.GFS_drawMunits			= function(armeId, x, y) {
	
	var _arme = $dataArm[armeId];
	var m = $gameParty.numItems($dataItems[_arme.munit])
	//--------------------------
	//Chambre
	if(m > 0) {
		var _hudWidth = 68;
		var _munitMax = _arme.loadCap;
		var bitmap = ImageManager.GFS_loadHud('mu' + armeId);
		var _munitWidth = bitmap._canvas.width + 4;
		var _munitHeight = bitmap._canvas.height;
		var _padding = [];
		
		
		var _munitByLine = this.GFS_getMunitByLine(_hudWidth, _arme, _munitWidth);
		//_aliasGFS.log("munition/line: " + _munitByLine);
		
		_padding[1] = this.GFS_getMunitPadding(_hudWidth, _munitByLine, _munitWidth);
		_padding[0] = this.GFS_getMunitFirstSpace(_hudWidth, _munitByLine, _munitWidth);
		//_aliasGFS.log("FirstSpace:" + _padding[0] + " / padding:" + _padding[1]);
		var _lign = 0; 
		for(i=0; i < m; i++){
			if(i >= _munitByLine){
				_lign = 1;
			};
			var _xMunit = ( i * (_munitWidth + _padding[1]) ) - (_lign * _hudWidth) + x + _padding[0] + (_lign * _padding[0] * 2) + _arme.padd;
			var _yMunit = (_lign * (_munitHeight + 4)) + y;
			//_aliasGFS.log("x:" + _xMunit + " / y:" + _yMunit);
			this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _xMunit, _yMunit);
		}
	} else {
		var bitmap = ImageManager.GFS_loadHud('reload');
		this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, x, y-5);		
	};
};
Window_Base.prototype.GFS_drawPack				= function(armeId, x, y) {
	var pk = $gameParty.numItems($dataItems[$dataArm[armeId].munitPack])
	if(pk>0) {
		var bitmap = ImageManager.GFS_loadHud('pa'+armeId);
		var _pkWidth = bitmap._canvas.width + 4;
		var _pkHeight = bitmap._canvas.height;
		var _hudWidth = 68;
		var _maxVisible = Math.floor(_hudWidth / _pkWidth);
		var _padding = Math.floor((_hudWidth  - _maxVisible * _pkWidth) / 2); 
		
		for(i=0; i < _maxVisible; i++){
			if(i < pk && pk <= _maxVisible){
				var _xPk = ( i * _pkWidth) + _padding + x;
				var _yPk = 4 + y;
				this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _xPk, _yPk);
			};
		}
		
		if(pk > _maxVisible){
			var _yPk = y;
			var _xPk = x + Math.floor((_hudWidth / 2) - 4);
			this.contents.blt(bitmap, 0, 0,  bitmap._canvas.width, bitmap._canvas.height, _xPk, _yPk);
			this.drawText("+" + pk, _xPk + 5, _yPk, bitmap._canvas.width, 20, 'center');
		};
	}else{
		this.contents.textColor = this.textColor(2);
		this.drawText("0 munition", x + 4, y + 4, _hudWidth, 20, 'center');
	};
};
Window_Base.prototype.GFS_getNumLineMunit		= function(lineWidth, arme, munitWidth) {
	if(arme.loadCap * munitWidth > lineWidth)
		return 2;
	return 1;
}
Window_Base.prototype.GFS_getMunitByLine		= function(width, arme, munitWidth) {
	if(this.GFS_getNumLineMunit(width, arme, munitWidth)  > 1)
	return Math.floor(arme.loadCap / 2);
	else
		return arme.loadCap;
}
Window_Base.prototype.GFS_getMunitLineWidth		= function(munitWidth, munitNum) {
	return munitWidth * munitNum;
}
Window_Base.prototype.GFS_getMunitPadding		= function(lineWidth, munitNum, munitWidth) {
	if($dataArm[$gameParty.leader().equips()[0].id].loadCap == 1)
		return 0;
	
	var _blankSpace = lineWidth - this.GFS_getMunitLineWidth( munitWidth, munitNum);
	var _interSpace;
	if(munitNum > 1)
		_interSpace = Math.floor(_blankSpace / munitNum);
	else
		_interSpace = 0;
	return _interSpace;
}
Window_Base.prototype.GFS_getMunitFirstSpace	= function(lineWidth, munitNum, munitWidth) {
	_interSpace = this.GFS_getMunitPadding(lineWidth, munitNum, munitWidth);
	if($dataArm[$gameParty.leader().equips()[0].id].munitCap == 1)
		return lineWidth / 2 - munitWidth / 2;
	
	var _blankSpace = lineWidth - this.GFS_getMunitLineWidth( munitWidth, munitNum);
var _blankRest = Math.floor(_blankSpace - _interSpace * munitNum);
	return _blankRest / 2;
}


//GS HUD
function GFS_Hud(){
    this.initialize.apply(this, arguments);
};
GFS_Hud.prototype								= Object.create(Window_Base.prototype);
GFS_Hud.prototype.initialize					= function() {
	this.GFS_x = 8;
	this.GFS_y = 8;
    Window_Base.prototype.initialize.call(this, 0, 0, 250, 250);
	this.refreshCounter = 0;
	this.refresh();
};
GFS_Hud.prototype.refresh						= function() {
	if($gameSystem.GFS_HudNeedRefresh){
		this.contents.clear();
		this.visible = $gameSystem.GFS_HudVisible;
		this.contents.fontSize = 12;
		this.contents.opacity = 150;
		this.padding = 0;
		//this.opacity = 0;
		this.refreshHud();
	};
};
GFS_Hud.prototype.refreshHud					= function() {
	this.GFS_drawLayer("layer1", this.GFS_x, this.GFS_y);
	this.refreshWeapons();
	this.refreshWeapons2();
	//this.refreshGSDrogs();
	//this.refreshGSItems();
	this.refreshHpFil();
	if(this.refreshCounter >= 10){
		this.refreshCounter = 0;
		$gameSwitches.setValue(3,false);
	}else{
		this.refreshCounter++;
	};
};
GFS_Hud.prototype.refreshHpFil					= function(){
	this.GFS_drawLife(this.GFS_x,this.GFS_y);
}
GFS_Hud.prototype.refreshWeapons				= function() {
	var _arme = $gamePlayer.GFS_getArmeData().id;
	this.GFS_drawWeapon(_arme, 4 + this.GFS_x, 10 + this.GFS_y);
	if(_arme > 5){
		this.GFS_drawMunits(_arme, 4 + this.GFS_x, 48 + this.GFS_y);
		this.GFS_drawPack(_arme, 4 +  + this.GFS_x, 84 +  + this.GFS_y);
	};
};
GFS_Hud.prototype.refreshWeapons2				= function() {
	var _armeA;
	var _armeB;
	if ($gameParty.leader().equips()[1])
		_armeA = $gameParty.leader().equips()[1].id;
	else
		_armeA = 1;
	if ($gameParty.leader().equips()[2])
		_armeB = $gameParty.leader().equips()[2].id;
	else
		_armeB = 1;
	this.contents.textColor = this.textColor(0);
	//this.GFS_drawWeapon2(_armeA, 4, 120);
	this.drawIcon($gameParty.leader().equips()[1].id, 4 + this.GFS_x, 120 + this.GFS_y);
	this.drawText("J", 16 + this.GFS_x, 125 + this.GFS_y, 34, 20, 'center');
	//this.GFS_drawWeapon2(_armeB, 34, 120);
	this.drawIcon($gameParty.leader().equips()[2].id, 34 + this.GFS_x, 120 + this.GFS_y);
	this.drawText("K", 46 + this.GFS_x, 125 + this.GFS_y, 34, 20, 'center');
}

//===================== BULLET MOVE WIP
Game_Player.prototype.GFS_getBulletMoveRoute		= function() {
	var _armeGFS = $dataArm[$gameParty.leader().equips()[0].id];
	var _list = [];
	for(i = 0; i <= _armeGFS.range; i++){
		_list.push({"code":12,"indent":null});
	}
	_list.push({"code":41, "parameters":["", 0], "indent":null});
	_list.push({"code":0});
	var _moveRoute = {};
	_moveRoute.list = _list;
	_moveRoute.repeat = false;
	_moveRoute.skippable = false;
	_moveRoute.wait = true;
	
	
};
//==================== BULLET MOVE WIP
Scene_Map.prototype.WIP__GFS_updateAllBullets		= function() {
	for(i = 1; i < 11; i++){
		if($gamePlayer.GFS_bullets[i]){
				this.GFS_updateBullet(i);
				this.GFS_checkHit(i);
				this.GFS_checkRange(i);
		}
	}
}
Scene_Map.prototype.WIP__GFS_updateBullet			= function(id) {
	var _event = $gameMap.event(id);
	if(_event.charcaterName == ""){
		$gamePlayer.GFS_resetBullet(id);
	}
};
Scene_Map.prototype.WIP__GFS_checkRange				= function(id) {

};
//====================================
//GAME MAP
/*Game_Map.prototype.initialize						= function(){
	_aliasGFS._gamMap_init.call(this);
	if(this.GFS_baseLength){
		if(this.GFS_baseLength < this._events.length){
			this.GFS_eraseRespawn();
		};
	}else{
		this.GFS_baseLength = this._events.length;
	}
};
Game_Map.prototype.eraseRespawn						= function(){
	this._events.splice(this.GFS_baseLength, this._events.length - 1);
};*/