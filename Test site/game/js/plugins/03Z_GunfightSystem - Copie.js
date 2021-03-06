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

/*
	Actor Data
	nickname		= characterBaseName
	HP		param0	= hp bonus
	MP		param 1	= stamina
	ATK		param 2	= Force
	DEF		param 3	= Resistance
	MAT		param 4	= precision
	MDEF	param 5	= charisme
	AGI		param 6	= Agilité
	LUK		param 7	= 
	
	Arme Data
	HP		param0	= loadCap
	MP		param 1	= loadPerc
	ATK		param 2	= Dmg
	DEF		param 3	= loadType
	MAT		param 4	= precision
	MDEF	param 5	= munit
	AGI		param 6	= munitPack
	LUK		param 7 = perc
	
	
	Armors Data
	HP param0 = hp bonus WIP
	MP param 1 = stamina bonus WIP
	ATK param 2 = precision bonus
	DEF param 3 = bulletproof vest (Max 5)
*/
var _aliasGFS										= _aliasGFS || {};
_aliasGFS._DataMana_loaDat							= DataManager.loadDatabase;
_aliasGFS._DataMana_isDatLoa						= DataManager.isDatabaseLoaded;

_aliasGFS._gamSys_init								= Game_System.prototype.initialize;
_aliasGFS._DataMana_setNewGam						= DataManager.setupNewGame;
_aliasGFS._gamCharBas_init							= Game_CharacterBase.prototype.initialize;
_aliasGFS._gamChar_init								= Game_Character.prototype.initialize;
_aliasGFS._gamPlay_refr								= Game_Player.prototype.refresh;
_aliasGFS._gamPlay_canMov							= Game_Player.prototype.canMove;
_aliasGFS._gamMap_init								= Game_Map.prototype.initialize;
_aliasGFS._gamMap_isDashDis							= Game_Map.prototype.isDashDisabled;
_aliasGFS._gamPar_gainItem							= Game_Party.prototype.gainItem;
_aliasGFS._scenMana_run								= SceneManager.run;
_aliasGFS._scenMap_upda								= Scene_Map.prototype.update;
_aliasGFS._scenMap_star								= Scene_Map.prototype.start;
_aliasGFS._scenMap_init								= Scene_Map.prototype.initialize;

//DEBUG TOOLS
_aliasGFS._debug									= 3; // 1: error / 2: error + info / 3: error + log + info
_aliasGFS.openConsole								= function() {
  if (Utils.isNwjs() || Utils.isOptionValid('test')) {
    var _debugWindow = require('nw.gui').Window.get().showDevTools();
    if (_debugWindow) _debugWindow.moveTo(0, 0);
  }
};
_aliasGFS.log										= function(content) {
	if(this._debug > 2)
		console.log(content);
};
_aliasGFS.info										= function(content) {
	if(this._debug > 1)
		console.info(content);
};
_aliasGFS.error										= function(content) {
	if(this._debug > 0)
		console.error("Error 03Z_GunfightSystem.js>" + content);
};
_aliasGFS.toDo										= function(){
	/*_aliasGFS.info("Hud Sprite OK!");
	_aliasGFS.info("Character OK!");
	_aliasGFS.info("Sound OK!");
	_aliasGFS.info("Data munitType OK!");
	_aliasGFS.info("Reload OK! (padd + type)");*/
}

//SCENE MANAGER RESOLUTION
SceneManager._screenWidth  = 1280;
SceneManager._screenHeight = 720;
SceneManager._boxWidth     = 1280;
SceneManager._boxHeight    = 720;
SceneManager.run									= function(sceneClass) {
	_aliasGFS._scenMana_run.call(this, sceneClass);
	this.updateResolution();
	if (!Utils.isNwjs()) return;
	if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= "1.6.0") return;
	if (_aliasGFS._debug) _aliasGFS.openConsole();
};
SceneManager.updateResolution						= function() {
	var resizeWidth = 1280 - window.innerWidth;
	var resizeHeight = 720 - window.innerHeight;
	window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
};

//KEY
Input.keyMapper = {
    9: 'tab',       // tab
    13: 'ok',       // enter
    16: 'shift',    // shift
    17: 'control',  // control
    18: 'control',  // alt
    27: 'escape',   // escape
    32: 'ok',       // space
    33: 'pageup',   // pageup
    34: 'pagedown', // pagedown
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    45: 'escape',   // insert
	62: 'ok',		// spacebar
	68: 'right',	// D
    81: 'left',   	// Q
	83: 'down',		// S
    90: 'up',       // Z
    96: 'escape',   // numpad 0
    98: 'down',     // numpad 2
    100: 'left',    // numpad 4
    102: 'right',   // numpad 6
    104: 'up',      // numpad 8
    120: 'debug'    // F9
};
//IMAGE MANAGER
ImageManager.GFS_loadHud							= function(filename) {
    return this.loadBitmap('img/hud/', filename, 0, true);
};

//AUDIO MANAGER
AudioManager.GFS_playAmmoOut						= function() {
	var _se = {};
	_se.volume=100;
	_se.pitch=100;
	_se.pan=0;
	_se.name="03Z_ammoOut";
	this.playSe(_se);
}
AudioManager.GFS_playReload							= function(step) {
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
AudioManager.GFS_playShoot							= function() {
	var _SE = {};
	_SE.name = "03Z_sh_" + $gameParty.leader().equips()[0].id;
	_SE.volume = 90;
	_SE.pitch = 100;
	_SE.pan = 0;
	AudioManager.playSe(_SE);
}
AudioManager.GFS_playDie							= function() {
	var _SE = {};
	_SE.name = this.GFS_getDieZombieSoundName();
	_SE.volume = 90;
	_SE.pitch = 100;
	_SE.pan = 0;
	AudioManager.playSe(_SE);
};
AudioManager.GFS_getDieZombieSoundName				= function() {
	var _soundNames = [
		"vocal_growl_04",
		"vocal_growl_06",
		"vocal_snarl_01",
		"vocal_snarl_02",
		"gore_02"
	];
	return _soundNames[Math.round(Math.random() * _soundNames.length) - 1];
}
AudioManager.playHurtedZombie						= function() {
	var _SE = {};
	_SE.name = this.GFS_getHurtedZombieSoundName();
	_SE.volume = 90;
	_SE.pitch = 100;
	_SE.pan = 0;
	AudioManager.playSe(_SE);
};
AudioManager.GFS_getHurtedZombieSoundName				= function() {
	var _soundNames = [
		"vocal_growl_04",
		"vocal_growl_06",
		"vocal_snarl_01",
		"vocal_snarl_02",
		"gore_02"
	];
	return _soundNames[Math.round(Math.random() * _soundNames.length) - 1];
};
//DATAMANAGER
// -> Chargement des fichiers Json du jeu
DataManager.loadDatabase							= function() {
	_aliasGFS._DataMana_loaDat.call(this);
	this.GFS_loadDatabase();
};
DataManager.isDatabaseLoaded						= function() {
    if (!_aliasGFS._DataMana_isDatLoa.call(this)) {
		return false;
	}else{
		return this.GFS_isDatabaseLoaded();
	}
};
DataManager.GFS_loadDatabase						= function() {
    for (var i = 0; i < this.GFS_databaseFilesList().length; i++) {
        var name = this.GFS_databaseFilesList()[i].name;
        var src = this.GFS_databaseFilesList()[i].src;
        this.GFS_loadDataFile(name, src);
    }
};
DataManager.GFS_databaseFilesList					= function() {
	return [
		{name: '$dataArm',		src: 'Weapons.json'},
		{name: '$dataPj',		src: 'Actors.json'},
		{name: '$dataAmmo',		src: 'Ammo.json'}
	];
};
DataManager.GFS_loadDataFile						= function(name, src) {
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
DataManager.GFS_isDatabaseLoaded					= function() {
    this.checkError();
    for (var i = 0; i < this.GFS_databaseFilesList().length; i++) {
        if (!window[this.GFS_databaseFilesList()[i].name]) {
            return false;
        }
    }
    return true;
};

//GAME SYSTEM
Game_System.prototype.initialize					= function() {
	this.GFS_isRetractableHud = false;
	_aliasGFS._gamSys_init.call(this);
	_aliasGFS.toDo();
};
Game_System.prototype.GFS_HudNeedRefresh			= function() {
	return true;
};
Game_System.prototype.GFS_hudVisible				= function() {
	if($gameVariables.value(2) > 0 && $gameSwitches.value(2))
		return $gameVariables.value(2);
	else
		return 0;
};
Game_System.prototype.GFS_getHudForcedContent		= function() {
	return Math.max(	Math.min(this.GFS_getHudNumLimit(), $gameVariables.value(3)),	0);
};
Game_System.prototype.GFS_getHudNumLimit			= function() {
	return 3;
};
Game_System.prototype.GFS_resetHudForcedContent		= function() {
	this.GFS_setHudForcedValue(0);
};
Game_System.prototype.GFS_setHudForcedValue			= function(value) {
	$gameVariables.setValue(3,value);
};
Game_System.prototype.GFS_setHudVisible				= function(value, switchVal) {
	$gameVariables.setValue(2, value);
	$gameSwitches.setValue(2, switchVal);
};
//GAME CHARACTER BASE
Game_CharacterBase.prototype.initialize				= function() {
	_aliasGFS._gamCharBas_init.call(this);
	this.GFS_action = 0;
};


// GAME PARTY
// -> manage stockage
Game_Party.prototype.GFS_getNumItemsById			= function(itemId) {
	return this.numItems($dataItems[itemId]);
}
Game_Party.prototype.GFS_hasItemById				= function(itemId) {
	return this.hasItem($dataItems[itemId]);
};
Game_Party.prototype.GFS_loseItemById				= function(itemId, quant) {
	this.loseItem($dataItems[itemId]);
};
Game_Party.prototype.GFS_havePackage				= function() {
	var _packages = this.GFS_getWeightCapacity();
	var _weight = this.GFS_getWeightUsed();
	return _packages - _weight;
};
Game_Party.prototype.GFS_haveItemsSlots				= function() {
	var _packages = this.GFS_getSlotCapacity();
	var _weight = this.GFS_getSlotUsed();
	return _packages - _weight;
};
Game_Party.prototype.GFS_getSlotUsed				= function() {
	var _slots = 0;
	for(i = 0; i < this.items().length; i++){
		if(this.items()[i].itypeId <3){
			_slots++;
		}
	}
	return _slots;
};
Game_Party.prototype.GFS_getSlotCapacity			= function() {
	var _packages = 0;
	var _pack;
	for(i = 0; i < $gameParty._actors.length; i++){
		if($gameParty.battleMembers()[i]){
			_pack = $gameParty.battleMembers()[i].equips()[6];
			if(_pack != null)
				_packages += _pack.params[7];
			_packages += Math.round($gameParty.battleMembers()[i].atk / 10);
		}
	};
	return _packages + 2;
};
Game_Party.prototype.GFS_getWeightCapacity			= function() {
	var _packages = 0;
	var _pack;
	for(i = 0; i < $gameParty._actors.length; i++){
		if($gameParty.battleMembers()[i]){
			_pack = $gameParty.battleMembers()[i].equips()[6];
			if(_pack != null)
				_packages += _pack.price;
			_packages += $gameParty.battleMembers()[i].atk;
		}
	};
	return _packages;
};
Game_Party.prototype.GFS_getWeightUsed				= function() {
	var _weight = 0;
	for(i = 0; i < this.items().length; i++){
		if(this.items()[i].itypeId <3)
			_weight += this.items()[i].price * this.itemContainer(this.items()[i])[this.items()[i].id];
	}
	return _weight;
}
Game_Party.prototype.GFS_gainItemById				= function(id, quant) {
	this.gainItem($dataItems[id], quant)
};
Game_Party.prototype.gainItem 						= function(item, amount, includeEquip) {
	if((amount > 0 && $gameParty.GFS_havePackage() > item.price * amount && this.GFS_haveItemsSlots()) || amount < 0){
		_aliasGFS._gamPar_gainItem.call(this, item, amount, includeEquip);
	}else{
		$gameMessage.add("Trop lourd");
	}
	$gameSystem.GFS_setHudForcedValue(3);
};

//GAME CHARACTER
Game_Character.prototype.initialize					= function() {
    _aliasGFS._gamChar_init.call(this);
	this.GFS_waitDash = 0;
	this.GFS_bullets = [0, false, false, false, false, false, false, false, false, false, false];
	this.GFS_bulletsMove = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	this.GFS_usedGilet = 0;
	this.GFS_waitShootPerc = 0;
};
// -> Character visual
Game_Character.prototype.GFS_getActorChar			= function(actor) {
	var _armeId = this.GFS_getArme(actor).id || 1;
	var _tenueId;
	if (this.GFS_getTenue(actor))
		_tenueId = this.GFS_getTenue(actor).id;
	else
		_tenueId = 59;
	
	if(this.GFS_action < 6)
		return this.GFS_getBasicChar(this.GFS_getCharacterBaseName(actor), _tenueId, _armeId);
	else
		return this.GFS_getSpecialChar(this.GFS_getCharacterBaseName(actor), _tenueId);
};
Game_Character.prototype.GFS_getCharacterBaseName	= function(actor) {
	return actor._nickname;
};
Game_Character.prototype.GFS_getSpecialChar			= function(name, tenueId) {
	var _charName = name + "-" + tenueId + "_s";
	return _charName;
}
Game_Character.prototype.GFS_getBasicChar			= function(name, tenueId, armeId) {
	var _charName = name + "-" + tenueId + "_" + armeId;
	return _charName;
}
Game_Character.prototype.GFS_getAction				= function() {
	if(this.isDashing())
		return 4;
	else
		return this.GFS_action;
}
Game_Character.prototype.GFS_setVisualChar			= function(actor) {
	var _chIndex = this.GFS_getAction();
	var _chName = this.GFS_getActorChar(actor);
	if(_chIndex == 6)
		_chIndex = 4;
	if(_chIndex > 6)
		_chIndex -= 6;
	this.setImage(_chName,_chIndex);
};

// -> getter
Game_Character.prototype.GFS_getArme				= function(actor) {
	return this.GFS_getEquipBySlot(0, actor);
};
Game_Character.prototype.GFS_getEquipBySlot			= function(slotId, actor) {
	return actor.equips()[slotId];
};
Game_Character.prototype.GFS_getTenue				= function(actor) {
	 return actor.equips()[5];
};
Game_Character.prototype.GFS_getArmeGFS				= function(actor){
	return $dataArm[this.GFS_getArme(actor).id];
};
// -> set Arme
Game_Character.prototype.GFS_setArmeBySlot			= function(slotId, actor) {
	if(slotId == 0 || !slotId){
		actor._equips[0].setObject($dataWeapons[1]);
	}else{
		if(actor.equips()[slotId])
			actor._equips[0].setObject($dataWeapons[actor.equips()[slotId].id]);
	}
	this.refresh();
};

// GAME PLAYER
// -> Arme
Game_Player.prototype.GFS_getPlayerArme				= function() {
	return this.GFS_getArme($gameParty.leader());
};
Game_Player.prototype.GFS_getPlayerArmeGFS			= function (){
	return this.GFS_getArmeGFS($gameParty.leader());
};
Game_Player.prototype.GFS_getPlayerArmeReloadType	= function() {
	return this.GFS_getPlayerArmeGFS().loadType;
};
Game_Player.prototype.GFS_getPlayerArmeMunitId		= function() {
	return this.GFS_getPlayerArmeGFS().munit;
};
Game_Player.prototype.GFS_getPlayerArmeMunitCap		= function() {
	return this.GFS_getPlayerArmeGFS().loadCap;
};
Game_Player.prototype.GFS_getPlayerArmeReloadPerc	= function() {
	return this.GFS_getPlayerArmeGFS().loadPerc;
};
Game_Player.prototype.GFS_getPlayerArmeShotPerc		= function() {
	return this.GFS_getPlayerArmeGFS().perc;
};
Game_Player.prototype.GFS_getPlayerArmeSortRate		= function() {
	return this.GFS_getPlayerArmeGFS().shortRate;
};
Game_Player.prototype.GFS_getPlayerArmePrecision	= function() {
	if(this.GFS_getPlayerArme.id < 7)
		return this.GFS_getPlayerAgility();
	return this.GFS_getPlayerArmeGFS().preci;
};
Game_Player.prototype.GFS_getPlayerArmeRange		= function() {
	return this.GFS_getPlayerArmeGFS().range;
};
Game_Player.prototype.GFS_getPlayerArmePerf			= function() {
	return this.GFS_getPlayerArmeGFS().perf;
};
Game_Player.prototype.GFS_getPlayerArmeMunitPackId	= function() {
	return this.GFS_getPlayerArmeGFS().munitPack;
};
Game_Player.prototype.GFS_getPlayerArmeNumMunit		= function() {
	return $gameParty.GFS_getNumItemsById(this.GFS_getPlayerArmeMunitId());
};
Game_Player.prototype.GFS_getPlayerArmeDisp			= function(){
	return this.GFS_getPlayerArmeGFS().disp;
};
Game_Player.prototype.GFS_getPlayerArmeDmg			= function(){
	return this.GFS_getPlayerArmeGFS().dmg;
};
//-> Armors
Game_Player.prototype.GFS_getPlayerArmor			= function(){
	return $gameParty.leader().equips()[5];
};	
Game_Player.prototype.GFS_getPlayerArmorDef			= function(){
	return this.GFS_getPlayerArmor().params[3];
};	
Game_Player.prototype.GFS_getPlayerArmorValue		= function() {
	return Math.max(Math.min(this.GFS_getPlayerArmorDef(),  this.GFS_getPlayerArmorDef() - this.GFS_usedGilet, 5),0);
};
Game_Player.prototype.GFS_getPlayerArmorsBlind		= function(){
	return this.GFS_getPlayerArmor().params[5];
};
// player info
Game_Player.prototype.GFS_getPlayerChar				= function() {

	return this.GFS_getActorChar($gameParty.leader());
};
Game_Player.prototype.GFS_getPlayerAction			= function() {
	if(this.isDashing()){
		return 4;
	}else{
		return this.GFS_action;
	}
};
// Player stats
Game_Player.prototype.GFS_getPlayerFor				= function() {
	return $gameParty.leader().atk;
};	
Game_Player.prototype.GFS_getPlayerDef				= function() {
	return $gameParty.leader().mdf;
};
Game_Player.prototype.GFS_getPlayerAgility			= function() {
	return $gameParty.leader().agi;
};
Game_Player.prototype.GFS_getPlayerPrecision		= function() {
	return $gameParty.leader().mat;
};

	

// -> refresh
Game_Player.prototype.refresh						= function() {
	_aliasGFS._gamPlay_refr.call(this);
    var _actor = $gameParty.leader();
    var _charName = _actor ? this.GFS_getPlayerChar() : '';
    var _charIndex = _actor ? this.GFS_getPlayerAction() : 0;
    this.setImage(_charName, _charIndex);
    this._followers.refresh();
	if(this.GFS_isReload)
		this.GFS_refreshReload();
};

// -> Change d'arme
Game_Player.prototype.GFS_setPlayerArmeBySlot		= function(slotId) {
	this.GFS_setArmeBySlot(slotId, $gameParty.leader());
};
Game_Player.prototype.GFS_setPlayerNoArme			= function() {
	this.GFS_setPlayerArmeBySlot(0);
};
Game_Player.prototype.GFS_setPlayerArme1			= function() {
	this.GFS_setPlayerArmeBySlot(1);
};
Game_Player.prototype.GFS_setPlayerArme2			= function() {
	this.GFS_setPlayerArmeBySlot(2);
};
Game_Player.prototype.GFS_playerPharma				= function() {
	this.GFS_setPlayerArmeBySlot(3);
};
Game_Player.prototype.GFS_playerTool				= function() {
	this.GFS_setPlayerArmeBySlot(4);
};

// -> Reload
Game_Player.prototype.GFS_reload					= function() {
	if(this.GFS_getPlayerArmeReloadType() == 0 || this.GFS_isReload || this.GFS_action == 1)
		return;
	else if(this.GFS_usePackMunit()){
		$gameSystem.GFS_setHudForcedValue(2);
		this.GFS_isReloaded = false;
		this.GFS_isReload = true;
		this.GFS_action = 2;
		this.GFS_reloadWait = 0;
		this.refresh();
	}else{
		AudioManager.GFS_playAmmoOut();
	}
};
Game_Player.prototype.GFS_usePackMunit				= function() {
	var _munitCap = this.GFS_getPlayerArmeMunitCap();
	var _numMunit = this.GFS_getPlayerArmeNumMunit();
	var _munitPId = this.GFS_getPlayerArmeMunitPackId();
	console.log(_munitCap + " - " + _numMunit + " - " + _munitPId)
	if( _numMunit < _munitCap && $gameParty.GFS_getNumItemsById(_munitPId) > 0){
		$gameParty.GFS_gainItemById(_munitPId, -1);
		return true;
	}
	return false;
}
Game_Player.prototype.GFS_refreshReload				= function() {
	switch(this.GFS_getPlayerArmeReloadType()){
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
Game_Player.prototype.GFS_refreshNormalReload		= function() {
	var _munitCap = this.GFS_getPlayerArmeMunitCap();
	var _numMunit = this.GFS_getPlayerArmeNumMunit();
	var _munitId = this.GFS_getPlayerArmeMunitId();
	
	if(_numMunit < _munitCap){
		$gameParty.GFS_gainItemById(_munitId, Math.min(_munitCap, _munitCap - _numMunit));
		AudioManager.GFS_playReload();
	}
	
	this.GFS_reloadWaitUpdate();
};
Game_Player.prototype.GFS_reloadWaitUpdate			= function() {
	if(this.GFS_reloadWait <= this.GFS_getPlayerArmeReloadPerc()){
		this.GFS_reloadWait++;
	}else{
		this.GFS_isReloaded = true;
	}
};
Game_Player.prototype.GFS_refreshOneByOneReload		= function() {
	var _munitCap = this.GFS_getPlayerArmeMunitCap();
	var _numMunit = this.GFS_getPlayerArmeNumMunit();
	var _reloadPerc = this.GFS_getPlayerArmeReloadPerc();
	var _munitId = this.GFS_getPlayerArmeMunitId();
	
	if(_numMunit <= _munitCap){
		if(this.GFS_reloadWait <= _reloadPerc){
			this.GFS_reloadWait++;
		}else{
			if(_numMunit == _munitCap - 1){
				this.GFS_isReloaded = true;
				$gameParty.gainItemById(_munitId, 1);
				AudioManager.GFS_playReload(2);
			}else{
				$gameParty.gainItemById(_munitId, 1);
				AudioManager.GFS_playReload(1);
				this.GFS_reloadWait = 0;
			}
		}
	}	
	
};
// -> Weight
Game_Player.prototype.canMove						= function() {
	return _aliasGFS._gamPlay_canMov.call(this);
}
// -> Shoot
Game_Player.prototype.GFS_shoot						= function() {
	if($gamePlayer.GFS_isLatencyOk())
		if(this.GFS_isShootReady())
			if(this.GFS_checkMunit()){
				this.GFS_waitShootingPerc = 0;
				this.GFS_proceedShoot();
			}
};
Game_Player.prototype.GFS_isLatencyOk				= function() {
	if(this.GFS_waitShootPerc <= 0){
		this.GFS_waitShootPerc = this.GFS_getPlayerArmeShotPerc();
		return true;
	}
	return false;
};
Game_Player.prototype.GFS_isShootReady				= function() {
	var _wtypeId = this.GFS_getPlayerArme().wtypeId;
	if($gamePlayer.GFS_isReload)
		return false;
	if($gamePlayer.isDashing && (_wtypeId == 12 || _wtypeId == 9 || _wtypeId == 6)) // arme lourde on peut pas tirer et courir
		return false;
	return true;
};
// -> Munit
Game_Player.prototype.GFS_checkMunit				= function() {
	var _arme = this.GFS_getPlayerArme();
	var _munitId = this.GFS_getPlayerArmeMunitId();
	var _munitNum = this.GFS_getPlayerArmeNumMunit();
	if( _arme.id >= 7 && _munitNum == 0){
		AudioManager.GFS_playAmmoOut();
		return false;
	}
	return true;
};
Game_Player.prototype.GFS_consumeMunit				= function() {
	$gameParty.GFS_gainItemById(this.GFS_getPlayerArmeMunitId(), -1);
};
// -> Shoot OK
Game_Player.prototype.GFS_proceedShoot				= function() {
	this.GFS_consumeMunit();
	this.GFS_action = 1;
	this.GFS_isShooting = true;
	this.GFS_waitShootPose = 30;
	var _event;
	for(var i = 1; i < 11; i++){
		_event = $gameMap.event(i);
		if(_event._x == i && _event._y == 0 && !this.GFS_bullets[i]){
			AudioManager.GFS_playShoot();
			_event.setImage(this.GFS_getPlayerChar() , 7);
			_event.setPosition($gamePlayer._x, $gamePlayer._y);
			_event.setDirection($gamePlayer._direction);
			this.GFS_bullets[i] = true;
			$gameSwitches.setValue(40 + i, true);
			i = 11;
		}
	}
};
// -> Bullet Setup
Game_Player.prototype.GFS_resetBullet				= function(id) {
	this.GFS_bullets[id] =false;
	this.GFS_bulletsMove[id] = 0;
	$gameSwitches.setValue(40 + id, false);
	var _event = $gameMap.event(id);
	_event.setImage("" , 0);
	_event.setPosition(id, 0);
	_event.setDirection(8);
};
//-> Dash Stamina
Game_Player.prototype.GFS_updateStamina				= function() {
	if(this.GFS_waitDash <= 0){
	
		var _agi = Math.round($gameParty.leader().agi/10);
		
		if($gameParty.leader().mp <= $gameParty.leader().mmp && $gamePlayer.isDashing())
			$gameParty.leader().gainMp(Math.min(-10, -15 + _agi * 2));
		
		else
			if(!$gamePlayer.isMoving())
				$gameParty.leader().gainMp(Math.max(4, Math.round(_agi / 2)));
			else
				$gameParty.leader().gainMp(Math.max(1, Math.round(_agi / 2)));
		this.GFS_waitDash = 20;		
	}else
		this.GFS_waitDash--;
};
// -> Respawn
Game_Player.prototype.executeEncounter				= function() {
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        this.makeEncounterCount();
        return true;
    } else {
        return false;
    }
};
// -> Hurted
Game_Player.prototype.GFS_hurted					= function(eventId){
	var _dmg = this.GFS_getHurtedDmg(eventId);
	$gameParty.leader().gainHp(_dmg *-1);
	$gameParty.leader().gainMp(Math.floor(_dmg/3)*-1);
};
Game_Player.prototype.GFS_getHurtedDmg					= function(eventId){
	var _enemyId = $gameMap._events[eventId].GFS_enemyId;
	var _dmg = $dataEnemies[_enemyId].params[2]; 
	_dmg - this.GFS_getPlayerDef();
	_dmg = Math.max($dataEnemies[_enemyId].params[2]/2, _dmg)
	if(this.GFS_usedGilet < this.GFS_getPlayerArmorDef()){
		this.GFS_usedGilet++;
		_dmg -= this.GFS_getPlayerArmorsBlind();
	}
	return Math.max(5, _dmg);
};


//GAMEMAP
Game_Map.prototype.initialize						= function() {
	this.GFS_enemies = [];
	_aliasGFS._gamMap_init.call(this);
};
Game_Map.prototype.isDashDisabled					= function() {
	if($gameParty.leader().mp <= Math.floor($gameParty.leader().mmp/5) || $gameParty.leader().mp < $gameParty.leader().hp /5)
		return true;
    return _aliasGFS._gamMap_isDashDis.call(this);
};

// SCENE BASE
Scene_Base.prototype.GFS_isRandomOk					= function(rate) {
	var _rand = Math.random();
	return rate >= _rand;
}

//SCENE MAP
Scene_Map.prototype.initialize						= function() {
	this.GFS_Hud_needRefresh = 0;
	this.GFS_inputWait = 0;
	this.GFS_bulletIndex = 1;
	this.GFS_waitHud = 0;
	_aliasGFS._scenMap_init.call(this);
};
Scene_Map.prototype.start							= function() {
    _aliasGFS._scenMap_star.call(this);
	this.GFS_createHUD();
};
Scene_Map.prototype.update							= function() {
    _aliasGFS._scenMap_upda.call(this);
	this._Hud1.refresh();
	this.GFS_updateHud();
	$gamePlayer.refresh();
	this.GFS_updateInput();
	$gamePlayer.GFS_updateStamina();
	this.GFS_updateShoot();
	this.GFS_updateHitEnemy()
};
// -> Shoot update
Scene_Map.prototype.GFS_updateShoot					= function() {
	this.GFS_updateShootPerc();
}
Scene_Map.prototype.GFS_updateShootPerc				= function() {
	if($gamePlayer.GFS_waitShootPerc > 0)
		$gamePlayer.GFS_waitShootPerc--;
	else if ($gamePlayer.GFS_action == 1 && $gamePlayer.GFS_waitShootPose <=0)
		$gamePlayer.GFS_action = 0;
	else
		$gamePlayer.GFS_waitShootPose--;
};
// -> Hud
Scene_Map.prototype.GFS_createHUD					= function(id) {
	this._Hud1 = new GFS_Hud();
	this._Hud1.opacity = 0;
	this.addWindow(this._Hud1);
};
Scene_Map.prototype.GFS_isInputReady				= function() {
	if($gamePlayer.GFS_isReload)
		return false;
	if(this.GFS_inputWait > 0){
		this.GFS_inputWait--;
		return false
	};
	return true;
}
Scene_Map.prototype.GFS_updateHud					= function(){
	if(this.GFS_waitHud == 600 && $gameSystem.GFS_getHudForcedContent() != 0 && $gameSystem.GFS_isRetractableHud){
		$gameSystem.GFS_setHudForcedValue(0);
		this.GFS_waitHud = 0;
	}else
		this.GFS_waitHud++;
};
// -> Input
Scene_Map.prototype.GFS_updateInput					= function() {
	if(this.GFS_isInputReady()){
		if(Input.keyTriggered("R")){
			if($gamePlayer.GFS_getPlayerArme().id > 6){
				$gamePlayer.GFS_reload();
				$gameSystem.GFS_setHudForcedValue(2);
			}else
				_aliasGFS.log("defendre")
		}
		if(Input.keyTriggered("J")){
			$gamePlayer.GFS_setPlayerArme1();
			$gameSystem.GFS_setHudForcedValue(2);
			this.GFS_waitHud = 0;
			this.GFS_inputWait = 4;
		}
		if(Input.keyTriggered("K")){
			$gamePlayer.GFS_setPlayerArme2();
			$gameSystem.GFS_setHudForcedValue(2);
			this.GFS_waitHud = 0;
			this.GFS_inputWait = 4;
		}
		if(Input.keyTriggered("E") || Input.keyPressed("E")){
			$gamePlayer.GFS_shoot();
			this.GFS_inputWait = 4;
		}
		if(Input.keyTriggered("A")){
			this.GFS_waitHud = 0;
			if($gameSystem.GFS_getHudForcedContent() != 1){
				_aliasGFS.info("Open Menu Stats");
				$gameSystem.GFS_setHudForcedValue(1);
				$gameSystem.GFS_isRetractableHud = false;
				this.GFS_inputWait = 4;
			}else if($gameSystem.GFS_getHudForcedContent() == 1){
				$gameSystem.GFS_setHudForcedValue(0);
				$gameSystem.GFS_isRetractableHud = true;
			}
		}
		if(Input.keyTriggered("I")){
			this.GFS_waitHud = 0;
			if($gameSystem.GFS_getHudForcedContent() != 3){
				_aliasGFS.info("Open Menu Inventory");
				$gameSystem.GFS_setHudForcedValue(3);
				$gameSystem.GFS_isRetractableHud = false;
				this.GFS_inputWait = 4;
			}else if($gameSystem.GFS_getHudForcedContent() == 3){
				$gameSystem.GFS_setHudForcedValue(0);
				$gameSystem.GFS_isRetractableHud = true;
			}
		}
	}
}
//-> Encounter + Respawn
Scene_Map.prototype.updateEncounter					= function() {
	if ($gamePlayer.executeEncounter()) {
		_aliasGFS.log("check respawn");
		this.GFS_checkRespawn();
	}
};
Scene_Map.prototype.GFS_checkRespawn				= function() {
	var _encounterList = $gameMap.encounterList();
	for (i = 0; i < _encounterList.length; i++){
		var _respawn = _encounterList[i];
		var _x = _respawn.regionSet[0];
		var _y = _respawn.regionSet[1];
		if(!$gameMap.GFS_enemies[i]){
			if(this.GFS_isFarEnoughtToRespawn(_x, _y)){
				if(this.GFS_isRandomOk(_respawn.weight /100)){
					var _eventId = _respawn.regionSet[2];
					var _enemyId = _respawn.troopId;
					this.GFS_respawn(_eventId, _x, _y, _enemyId);
					$gameMap.GFS_enemies[i] = true;
					i = _encounterList.length;
				}
			}
		}
	}
}
Scene_Map.prototype.GFS_isFarEnoughtToRespawn		= function(x, y) {
	var _distX = $gameMap.deltaX(x, $gamePlayer._x);
	var _distY = $gameMap.deltaY(y, $gamePlayer._y);
	if(_distX < 0)
		_distX *= -1;
	if(_distY < 0)
		_distY *= -1;
	return _distX > 11 || _distY > 7;
}
Scene_Map.prototype.GFS_respawn						= function(eventId, x, y, enemyId){
	var _event = $gameMap._events[eventId];
	_event.GFS_enemyId = enemyId;
	_event.GFS_hp = $dataEnemies[enemyId].params[0];
	_event.setPosition(x, y);
}
// -> Refresh enemy
Scene_Map.prototype.GFS_updateEnemies				= function(){
	for(i = 1; i < $gameMap._events.length; i++){
		if($gameMap.GFS_enemies[i] && $gameMap._events[i].GFS_hp >= 1){
			this.GFS_updateEnemy(i);
		}
	}
}
Scene_Map.prototype.GFS_updateEnemy					= function(eventId){
}
Scene_Map.prototype.GFS_resetEnemy					= function(eventId) {
	$gameMap.GFS_enemies[i] = false;
}
// -> Hit
Scene_Map.prototype.GFS_updateHitEnemy				= function() {
	for(i = 11; i < $gameMap._events.length; i++){
		if(this.GFS_isHitable(i)){
			for(j = 1; j < 11; j++){
				this.GFS_updateBulletHitEvent(j, i);
			}
		}
	}
};
Scene_Map.prototype.GFS_isHitable					= function(id) {
	return $gameMap._events[id] != undefined
		&& $gameMap._events[id].GFS_hp
		&& $gameMap._events[id].GFS_hp > 0;
};
Scene_Map.prototype.GFS_updateBulletHitEvent		= function(bulletId, eventId) {
	var _bullet = $gameMap.event(bulletId);
	var _event = $gameMap.event(eventId);
	var _distX = $gameMap.deltaX(_event._x, _bullet._x);
	var _distY = $gameMap.deltaY(_event._y, _bullet._y);
	if(this.GFS_isInHitRange(_distX, _distY) && this.GFS_isHitActorSkill())
		this.GFS_performHit(bulletId, eventId);
};
Scene_Map.prototype.GFS_isHitActorSkill				= function() {
	var _actorP = $gamePlayer.GFS_getPlayerPrecision();
	var _armeP = $gamePlayer.GFS_getPlayerArmePrecision() || 100;
	var _rate = Math.round((_armeP + _actorP * 2)/3);
	var _dice = Math.round(Math.random() * 80);
	console.log("value precision:" + _rate + "/" + _dice)
	return _rate > _dice;
};
Scene_Map.prototype.GFS_isInHitRange				= function(x, y) {
	var _armeDisp = $gamePlayer.GFS_getPlayerArmeDisp();
	if(x < 0)
		x *= -1;
	if(y < 0)
		y *= -1;
	return x <= _armeDisp && y <= _armeDisp;
};
//-> Hit OK
Scene_Map.prototype.GFS_performHit					= function(bulletId, eventId) {
	$gamePlayer.GFS_resetBullet(bulletId);
	var _keyAlert = [$gameMap.mapId(), eventId, "A"]; 				//  A: alert, B:hurt, C: shoot D:die
	var _keyHurt = [$gameMap.mapId(), eventId, "B"];
	if(!$gameSelfSwitches.value(_keyAlert))
		$gameSelfSwitches.setValue(_keyAlert,true);
	$gameSelfSwitches.setValue(_keyHurt,true);
	AudioManager.playHurtedZombie();
	this.GFS_dmgTarget(eventId, bulletId);
};
// -> Damages
Scene_Map.prototype.GFS_dmgTarget					= function(eventId, bulletId) {
	var _event = $gameMap._events[eventId];
	var _hpValue = _event.GFS_hp;
	var _enemyId = _event.GFS_enemyId;
	var _enemy = $dataEnemies[_enemyId];
	console.log(_enemy);
	var _rangeType = this.GFS_getRangeType();
	//console.log("rangeType:"+ _rangeType);
	//console.log("Damage:"+this.GFS_getTotalDmg(_enemy, _rangeType));
	var _newHp = Math.max(0,  _event.GFS_hp  - this.GFS_getTotalDmg(_enemy, _rangeType));
	_event.GFS_hp = _newHp;
	console.log(_newHp);
	if(_newHp == 0)
		this.GFS_dieEnemy(eventId, _enemy);
}
// -> Dmg math
Scene_Map.prototype.GFS_getRangeType				= function(bulletId){
	var _range = $gamePlayer.GFS_getPlayerArmeRange();
	if($gamePlayer.GFS_bulletsMove[bulletId] < Math.floor(_range / 2))
		return "short";
	return "long";
};
Scene_Map.prototype.GFS_getTotalDmg					= function(enemy, rangeType) {
	console.log(this.GFS_getArmeDmg(rangeType) - this.GFS_getPerfDebuff(enemy));
	return this.GFS_getArmeDmg(rangeType) - this.GFS_getPerfDebuff(enemy);
};
Scene_Map.prototype.GFS_getPerfDebuff				= function(enemy){
return Math.max(0, enemy.params[4] - $gamePlayer.GFS_getPlayerArmePerf());
};
Scene_Map.prototype.GFS_getArmeDmg					= function(rangeType) {
	if(rangeType == "short")
		return this.GFS_getArmeshortDmg();
	return this.GFS_getArmeLongDmg();
};
Scene_Map.prototype.GFS_getArmeshortDmg				= function() {
	var _shortRate =  $gamePlayer.GFS_getPlayerArmeShortRate();
	return Math.round(this.GFS_getArmeLongDmg() * _shortRate);
}
Scene_Map.prototype.GFS_getArmeLongDmg				= function() {
	var _armePwr = $gamePlayer.GFS_getPlayerArmeDmg();
	if($gamePlayer.GFS_getPlayerArme().id <= 6)
		_armePwr += $gameParty.leader().atk;
	return Math.floor(_armePwr * (Math.random() * 0.4 + 0.8));
}
// -> Die Enemy
Scene_Map.prototype.GFS_dieEnemy					=function(eventId, enemy){
	var _keyDie = [$gameMap.mapId(), eventId, "D"];
	if(!$gameSelfSwitches.value(_keyDie)){
		AudioManager.GFS_playDie(enemy);
		$gameParty.leader().gainExp(enemy.exp);
		$gameSelfSwitches.setValue(_keyDie, true);
	}
};

//GAME EVENT
// ->get items
Game_Event.prototype.GFS_getDropItem				= function(dropItem) {
	console.log("dropItem");
	console.log(dropItem);
	console.log("================================");
	var _item;
	switch(dropItem.kind){
		case 1:
			_item = $dataItems[dropItem.dataId];
			break;
		case 2:
			_item = $dataWeapons[dropItem.dataId];
			break;
		case 3:
			_item = $dataArmors[dropItem.dataId];
			break;
		default:
			_aliasGFS.error("Game_Event>GFS_getDropItem>line:1015");
			break;
	}
	$gameMessage.add("Trouvé:" + _item.name);
	if(_item)
		$gameParty.gainItem(_item, 1);
	
};
Game_Event.prototype.GFS_getDropItems				= function(enemyId, eventId) {
    var _dropItems = $dataEnemies[enemyId].dropItems;
	for(i = 0; i < _dropItems.length; i++){
		var _item = _dropItems[i];
		if(_item.kind > 0){
		var _rand = Math.round(Math.random() * _item.denominator);
			if(_rand == 1){
				this.GFS_getDropItem(_item);
			}
		}
	}
};



// ============================= >>>>>>>>> HUD

//WINDOWS BASE
Window_Base.prototype.GFS_drawLayer					= function(x, y) {
	var bitmap = ImageManager.GFS_loadHud("layer_" + this.GFS_content);
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, -2 + x, -4 + y);
};
// -> Draw Weapons
Window_Base.prototype.GFS_drawWeapon2				= function(arme, x , y) {
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
Window_Base.prototype.GFS_drawWeapon				= function(arme, x , y) {
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
Window_Base.prototype.GFS_drawLife					= function(x, y, width) {
	if($gamePlayer.GFS_getPlayerArmorValue() > 0)
		this.GFS_drawGiletFill(x, y, width);
    this.GFS_drawLifeFill(x, y, width);
	this.GFS_drawStaminaFill(x, y, width);
	
}
Window_Base.prototype.GFS_drawLifeFill				= function(x, y, width) {
	var _x = 6 + x;
	var _y = -24 + y;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(_x, _y, width, $gameParty.leader().hpRate(), color1, color2);
};
Window_Base.prototype.GFS_drawStaminaFill			= function(x, y, width) {
	var _width = $gameParty.leader().hpRate() * width;
	var rate = $gameParty.leader().mpRate();
	var _y = this.lineHeight() - 32 + y;
	var fillW = Math.floor(_width * rate);
	var _x = _width - fillW + 6 + x;
	
    var color1 = this.tpGaugeColor2();
    var color2 = this.tpGaugeColor1();
	this.contents.gradientFillRect(_x, _y, fillW, 6, color1, color2);
};
Window_Base.prototype.GFS_drawGiletFill				= function(x, y, width) {
	var _giletValue = $gamePlayer.GFS_getPlayerArmorValue();
	var _x = 6  + x - _giletValue;
	var _width = width + _giletValue * 2;
	var height = 6 + _giletValue * 2;
	var _y = this.lineHeight() - 32 - _giletValue + y;
	this.contents.fillRect(_x, _y, _width, height, this.textColor(9));
};
// -> Draw munit
Window_Base.prototype.GFS_drawMunits				= function(armeId, x, y) {
	
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
Window_Base.prototype.GFS_drawPack					= function(armeId, x, y) {
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
Window_Base.prototype.GFS_getNumLineMunit			= function(lineWidth, arme, munitWidth) {
	if(arme.loadCap * munitWidth > lineWidth)
		return 2;
	return 1;
}
Window_Base.prototype.GFS_getMunitByLine			= function(width, arme, munitWidth) {
	if(this.GFS_getNumLineMunit(width, arme, munitWidth)  > 1)
	return Math.floor(arme.loadCap / 2);
	else
		return arme.loadCap;
}
Window_Base.prototype.GFS_getMunitLineWidth			= function(munitWidth, munitNum) {
	return munitWidth * munitNum;
}
Window_Base.prototype.GFS_getMunitPadding			= function(lineWidth, munitNum, munitWidth) {
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
Window_Base.prototype.GFS_getMunitFirstSpace		= function(lineWidth, munitNum, munitWidth) {
	_interSpace = this.GFS_getMunitPadding(lineWidth, munitNum, munitWidth);
	if($dataArm[$gameParty.leader().equips()[0].id].munitCap == 1)
		return lineWidth / 2 - munitWidth / 2;
	
	var _blankSpace = lineWidth - this.GFS_getMunitLineWidth( munitWidth, munitNum);
	var _blankRest = Math.floor(_blankSpace - _interSpace * munitNum);
	return _blankRest / 2;
}
//-> Draw stats tab
Window_Base.prototype.GFS_drawStatsTab				= function(x, y) {
	var _stats = [
		null,
		$gamePlayer.GFS_getPlayerFor(),
		$gamePlayer.GFS_getPlayerDef(),
		$gamePlayer.GFS_getPlayerAgility(),
		$gamePlayer.GFS_getPlayerPrecision()
	];
	
	for(i = 1; i< _stats.length; i++){
		var _name = $dataSkills[i].name;
		var _iconId = $dataSkills[i].iconIndex;
		var _value = _stats[i];
		var _y = y + i * 32 - 4;
		this.GFS_drawStat(_name, _iconId, _value, x, _y);
	}
};
Window_Base.prototype.GFS_drawStat					= function(name, iconId, value, x, y){
	this.drawIcon(iconId, x, y);
	this.contents.textColor = this.textColor(0);
	this.contents.fontSize = 20;
	this.drawText(" " + name.substr(0,3).toUpperCase() + ": " + value, x + 36, y, 60, 32, 'left');
};
//-> inventory
Window_Base.prototype.GFS_drawItemsGrid				= function (x, y, numCase, caseWidth, itemsList){
	
	var _line = 0;
	var _case = 0;
	var _caseAll = 0;
	for(i = 0; i < itemsList.length; i++){
		if(itemsList[i].itypeId < 3){
			var _item = itemsList[i];
			if(_case >= caseWidth){
				_case = 0;
				_line++;
			}
			var _x = 32 * _case + x;
			var _y = 32 * _line + y;
			
			var _num = $gameParty.itemContainer(_item)[_item.id];
			
			if(i < numCase)
				this.drawIcon(this.GFS_getPackBlankIconId(), _x, _y);
			else
				this.drawIcon(this.GFS_getPackOverIconId(), _x, _y);
				
			this.drawIcon(_item.iconIndex, _x, _y);
			this.drawText(_num,_x + 18,	_y + 8,12,	20,'center');
			
			_case++;
			_caseAll++;
			
		}
	}
	while(_caseAll < numCase){
		
		if(_case >= caseWidth){
			_case = 0;
			_line++;
		}
		var _x = 32 * _case + x;
		var _y = 32 * _line + y;
		
		this.drawIcon(this.GFS_getPackBlankIconId(), _x, _y);
		_case++;
		_caseAll++;
	}
	return _line;
};
Window_Base.prototype.GFS_getPackBlankIconId		= function() {
	return 208;
};
Window_Base.prototype.GFS_getPackOverIconId		= function() {
	return 209;
};
//GS HUD
function GFS_Hud(){
    this.initialize.apply(this, arguments);
};
GFS_Hud.prototype									= Object.create(Window_Base.prototype);
GFS_Hud.prototype.initialize						= function() {
	this.GFS_x = this.getOutHudPosX();
	this.GFS_y = this.getOutHudPosY();
	this.GFS_xDest = this.getInHudPosX();
	this.GFS_yDest = this.getInHudPosY();
	this.GFS_content = 0;
    Window_Base.prototype.initialize.call(this, 0, 0, 250, 250);
	this.GFS_refreshCounter = 0;
	this.refresh();
};
// -> getter
GFS_Hud.prototype.getOutHudPosX 					= function() {
	return -100;
};
GFS_Hud.prototype.getOutHudPosY 					= function() {
	return -100;
};
GFS_Hud.prototype.getInHudPosX 						= function() {
	return 8;
};
GFS_Hud.prototype.getInHudPosY 						= function() {
	return 8;
};

// -> Refresh
GFS_Hud.prototype.GFS_counterAntiLag				= function() {
	if(this.GFS_refreshCounter < 4){
		this.GFS_refreshCounter++;
		return false;
	};
	this.GFS_refreshCounter = 0;
	return true;
};
GFS_Hud.prototype.refresh							= function() {
	if($gameSystem.GFS_HudNeedRefresh() && this.GFS_counterAntiLag()){
		this.contents.clear();
		if($gameSystem.GFS_hudVisible() > 0)
			this.visible = true;
		else
			this.visible = false;
		this.contents.fontSize = 12;
		this.contents.opacity = 150;
		this.padding = 0;
		this.refreshHud();
	};
};
GFS_Hud.prototype.refreshHud						= function() {
	this.refreshHudChange();
	this.refreshPosition();
	this.refreshHudType();
};
GFS_Hud.prototype.refreshHudChange					= function() {
	if(this.GFS_content != $gameSystem.GFS_getHudForcedContent()){
		if(this.isHudOut()){
			_aliasGFS.log("HUD IS OUT");
			this.GFS_content = $gameSystem.GFS_getHudForcedContent();
			this.visible = true;
			this.setMoveInHud();
			$gameSystem.GFS_setHudVisible($gameSystem.GFS_getHudForcedContent(), true);
		}else if(this.isHudIn()){
			_aliasGFS.log("HUD IS IN");
			this.setMoveOutHud();
		}else{
			_aliasGFS.log("HUD IS WHAT ???");
		}
	}
};
GFS_Hud.prototype.isHudOut							= function() {
	return this.GFS_x == this.getOutHudPosX() && this.GFS_y == this.getOutHudPosY();
};
GFS_Hud.prototype.isHudIn							= function() {
	return this.GFS_x == this.getInHudPosX() && this.GFS_y == this.getInHudPosY();
};
// -> Position
GFS_Hud.prototype.refreshPosition					= function() {
	var _spd = this.getHudMoveSpeed();

	if(this.GFS_x < this.GFS_xDest){
		this.GFS_x = Math.min(_spd + this.GFS_x, this.GFS_xDest);
		_aliasGFS.log("HudMoveRight");
	}
	
	if(this.GFS_y < this.GFS_yDest){
		this.GFS_y = Math.min(_spd + this.GFS_y, this.GFS_yDest);
		_aliasGFS.log("HudMoveUp");
	}
	
	if(this.GFS_x > this.GFS_xDest){
		this.GFS_x = Math.max(this.GFS_x - _spd, this.GFS_xDest);
		_aliasGFS.log("HudMoveLeft");
	}
	
	if(this.GFS_y > this.GFS_yDest){
		this.GFS_y = Math.max(this.GFS_y - _spd, this.GFS_yDest);
		_aliasGFS.log("HudMoveDown ... Get Down on it !");
	}
};
GFS_Hud.prototype.getHudMoveSpeed					= function() {
	return 50;
};
GFS_Hud.prototype.setMoveOutHud						= function() {
	this.GFS_xDest = this.getOutHudPosX();
	this.GFS_yDest = this.getOutHudPosY();
	_aliasGFS.log("MoveHudOut");
};
GFS_Hud.prototype.setMoveInHud						= function() {
	this.GFS_xDest = this.getInHudPosX();
	this.GFS_yDest = this.getInHudPosY();
	_aliasGFS.log("MoveHudIn");
};
GFS_Hud.prototype.refreshHudType					= function() {
	switch(this.GFS_content){
		case 0:
			break;
		case 1:
			this.refreshHudStats();
			break;
		case 2:
			this.refreshHudWeapons();
			break;
		case 3:
			this.refreshHudPackage();
			break;
		default:
			_aliasGFS.error("GFS_hud>refreshHudType>line:1318");
			break;
	}
};
// -> Package Hud
GFS_Hud.prototype.refreshHudPackage					= function() {
	this.GFS_drawLayer(this.GFS_x, this.GFS_y);
	this.refreshHpFil(128);
	this.refreshItemsGrid();
};
GFS_Hud.prototype.refreshItemsGrid					= function() {
	var _numCase = $gameParty.GFS_getSlotCapacity();
	var _caseWidth = 4;
	var _itemsList = $gameParty.items();
	var _lines = this.GFS_drawItemsGrid(this.GFS_x, this.GFS_y + 24, _numCase, _caseWidth, _itemsList);
	this.drawText(
		"Weight: " +
		$gameParty.GFS_getWeightUsed() + "/" + $gameParty.GFS_getWeightCapacity() +
		"   -   Slots:" +
		$gameParty.GFS_getSlotUsed() + "/" + _numCase,
		this.GFS_x,
		this.GFS_y + _lines * 32 + 60,
		_caseWidth * 32,
		20,
		'center');
};
// -> Stats Hud
GFS_Hud.prototype.refreshHudStats					= function() {
	this.GFS_drawLayer(this.GFS_x, this.GFS_y);
	this.refreshHpFil(88);
	this.refreshStatsTab();
};
GFS_Hud.prototype.refreshHpFil						= function(width) {
	this.GFS_drawLife(this.GFS_x,this.GFS_y, width);
};
GFS_Hud.prototype.refreshStatsTab					= function() {
	this.GFS_drawStatsTab(this.GFS_x,this.GFS_y);
};
// -> Weapons Hud
GFS_Hud.prototype.refreshHudWeapons					= function() {
	this.GFS_drawLayer(this.GFS_x, this.GFS_y);
	this.refreshWeapons();
	this.refreshWeapons2();
	this.refreshHpFil(64);
	if(this.refreshCounter >= 10){
		this.refreshCounter = 0;
	}else{
		this.refreshCounter++;
	};
};
GFS_Hud.prototype.refreshWeapons					= function() {
	var _arme = $gamePlayer.GFS_getPlayerArme().id;
	this.GFS_drawWeapon(_arme, 4 + this.GFS_x, 10 + this.GFS_y);
	if(_arme > 5){
		this.GFS_drawMunits(_arme, 4 + this.GFS_x, 48 + this.GFS_y);
		this.GFS_drawPack(_arme, 4 +  + this.GFS_x, 84 +  + this.GFS_y);
	};
};
GFS_Hud.prototype.refreshWeapons2					= function() {
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
};



