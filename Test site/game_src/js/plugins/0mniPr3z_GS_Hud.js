var _alias								= _alias || {};
_alias.GSH_map_update					= Scene_Map.prototype.update;
_alias.GSH_map_start					= Scene_Map.prototype.start;
_alias.GSH_map_init						= Scene_Map.prototype.initialize;
_alias.GSH_gameSys_init					= Game_System.prototype.initialize;

function GSdebug(content){
	var Debug = true;
	if(Debug)
		console.log(content);
}

//IMAGE MANAGER
ImageManager.loadGSHud					= function(filename) {
    return this.loadBitmap('img/hud/', filename, 0, true);
};

//GAME SYSTEM

//WINDOWS BASE
Window_Base.prototype.drawGSLayer		= function(nom) {
	var bitmap = ImageManager.loadGSHud(nom);
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, 0, 0);
};
Window_Base.prototype.drawWeapon		= function(arme) {
	var width = 64;
	var height = 32;
	var nbrLine = 5;
	var bitmap = ImageManager.loadGSHud('arme');
	var pw = width;
	var ph = height;
	var sx = arme % nbrLine * pw; // position x sur le factionset
	var sy = Math.floor(arme / nbrLine) * ph; // position y sur le factionset
	this.contents.blt(bitmap, sx, sy, pw, ph, 4, 4);
};
Window_Base.prototype.drawGSlife		= function() {
    var width = 63;
	var x = 6;
	var y = 114;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, $gameParty.leader().hpRate(), color1, color2);
};
Window_Base.prototype.drawMunits		= function(arme, m, pk) {
	var _y = 4;
	var _x= 4;
	var _hudW = 68;
	var _mPaddingX = 4;
	var _yBase = _y+33;
	var _lign =0;
	//--------------------------
	//Chambre
	if(m>0) {
		var bitmap = ImageManager.loadGSHud('M'+arme);
		var _mWidth = bitmap._canvas.width+_mPaddingX + $gameVariables.value(112);
		var _mHeight = bitmap._canvas.height+_y;
		var _maxWidth = _hudW -_mWidth;
		for(i=0; i<m; i++){
			var _xMunit = ( i * _mWidth )- (_lign * _hudW) +_mPaddingX;
			var _yMunit = (_lign * _mHeight) + _yBase;
			if(_xMunit>_maxWidth){
				_lign++;
			};
			this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _xMunit, _yMunit);
		}
		_lign++;
	} else {
		var bitmap = ImageManager.loadGSHud('reload');
		this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _x, _yBase);		
	};
	//--------------------------
	//Reserve
	if(pk>0) {
		var bitmap = ImageManager.loadGSHud('P'+arme);
		var _pkWidth = bitmap._canvas.width+_mPaddingX;
		var _pkHeight = bitmap._canvas.height+_y;
		var _maxWidth = _hudW -_pkWidth;
		_yBase = 77;
		_lign = 0;
		
		//Dessin des chargeurs
		for(i=0; i<pk; i++){
		
			var _xPk = ( i * _pkWidth) + _mPaddingX;
			var _yPk = (_lign * _pkHeight) + _yBase;
			if(_xPk + _pkWidth - _mPaddingX> _hudW){
				var _pk = pk - i;
				_lign++;
				i= pk;
			}else{
				this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _xPk, _yPk);
			};
			
		};
		
		if(_pk>0){
			var _yPk = (_lign * _pkHeight) + _yBase;
			var _xPk = _x+(_hudW/2)-(bitmap._canvas.height/2);
			this.contents.blt(bitmap, 0, 0,  bitmap._canvas.width, bitmap._canvas.height, _xPk, _yPk);
			this.drawText("+"+_pk, _xPk, _yPk, bitmap._canvas.width, 20, 'center');
		};
	}else{
		this.contents.textColor = this.textColor(2);
		this.drawText("Plus de reserve", _x, _yBase+20, _hudW-(_mPaddingX*2), 20, 'center');
	};
};
//SCENE MAP
Scene_Map.prototype.initialize			= function() {
	this.gS_hit_needRefresh = 0;
	_alias.GSH_map_init.call(this);
};
Scene_Map.prototype.start				= function() {
    _alias.GSH_map_start.call(this);
	this.createGrassHUD();
};
Scene_Map.prototype.createGrassHUD		= function() {
	this._Hud1 = new GS_Hud();
	this._Hud1.opacity = 0;
	this.addWindow(this._Hud1);
};
Scene_Map.prototype.update				= function() {
    _alias.GSH_map_update.call(this);
	this.updateGsNeedRefresh();
	this._Hud1.refresh();		
};
Scene_Map.prototype.updateGsNeedRefresh	= function() {
	if(this.gS_hit_needRefresh <= 0){
		this.gS_verifHit();
		this.gS_hit_needRefresh = 2;
		$gameSystem._GStimeStep[0]++;
		this.refreshGSTime();
	}else{
		this.gS_hit_needRefresh--;
	};
};
// * TimeStep
Scene_Map.prototype.refreshGSTime		= function(){
	this.timeGSneedRefresh = false;
	if($gameSystem._GStimeStep[0] > 360){
		$gameSystem._GStimeStep[0] = 0;
		$gameSystem._GStimeStep[1]++;
		this.timeGSneedRefresh = true;
	}
	if($gameSystem._GStimeStep[1] > 23){
		$gameSystem._GStimeStep[1] = 0;
		$gameSystem._GStimeStep[2]++;
	}
	this.refreshLumino();
};
Scene_Map.prototype.refreshLumino		= function(){
	if($gameSystem._GStimeStep[1] < 5 || $gameSystem._GStimeStep[1] > 22)
		$gameScreen.startTint([0,0,0,0], 250);
	else if ($gameSwitches.value(16))
		$gameScreen.startTint([-30,-20,50,150], 250);
}
// * Shoot
Scene_Map.prototype.gS_verifHit			= function() {
	for(var j = 21; j < 200; j++ ){
	
		var _keyA = [$gameMap.mapId(), j,"A"];
		var _keyC = [$gameMap.mapId(), j,"C"];
		var _arme = $gameVariables.value(101);
		var _ammoRange = [null,83,85,86,91,93];
		
		if( $gameMap.event(j) != undefined  && $gameVariables.value(j+200) <= 300 && $gameVariables.value(j+200) > 0){
			var _event = $gameMap.event(j);
			for(var i = 1; i < 5; i++){
				var _balle = $gameMap.event(i);
				var _distX = _event._x - _balle._x;
				var _distY = _event._y - _balle._y;
				var _direct = _balle._direction;
				if(this.gS_isArmHit(_distX, _distY, _direct, _arme) && $gameVariables.value(j+200) > 0){
					$gameMap.event(i).setPosition(i - 1, 0);
					$gameVariables.setValue($gameVariables.value(_ammoRange[i]), $gameVariables.value(106));
					$gameSelfSwitches.setValue(_keyC,true);
					this.hurtTarget(j);
				};
				
			};
		}else if($gameVariables.value(j+200) > 300 && $gameVariables.value(j+200) < 1500 && $gameMap.event(j) != undefined){
			$gameVariables.setValue(j+200, $gameVariables.value(j + 200) + 1);
			if($gameSystem._GStimeStep[1] < 5 || $gameSystem._GStimeStep[1] > 22)
				$gameVariables.setValue(j+200, $gameVariables.value(j + 200) + 2);
		}else if(j < 100 && $gameVariables.value(j+200) >= 1500 && $gameMap.event(j) != undefined){
			GSdebug("----------------- RESPAWN event " + j + " ---------------------");
			this.respawnGoule(j);
		}else if ($gameVariables.value(j + 200) < -100){
			
			$gameSelfSwitches.setValue(keyA,true);
		}else if ($gameVariables.value(200 + j) < 0){
			$gameVariables.setValue(j + 200, $gameVariables.value(j + 200) - Math.round(Math.random() * 10) )
		};
	};
};
Scene_Map.prototype.hurtTarget			= function(eventId) {
	
	GSdebug("----------------- Hurt Event " + eventId + " ---------------------");
	
	var _npcVarId = eventId + 200;
	var _hpValue = $gameVariables.value(_npcVarId);
	
	GSdebug("PV de l'ennemi: " + _hpValue + " (variable "+ _npcVarId +")");
	
	var _pwr = $gameVariables.value(107);
	
	GSdebug("Puissance Arme: " + _pwr);
	
	var _dmg = _pwr + Math.ceil(Math.random()* $gameVariables.value(32));
	
	console.log("Dégats infligés: " + _dmg);
	
	var _rest = Math.max( _hpValue - _dmg, 0)
	console.log("PV restants: " + _rest);
	$gameVariables.setValue(_npcVarId,_rest);
	this.gS_hit_needRefresh = 8;
}
Scene_Map.prototype.respawnGoule		= function(eventId){
	var _event = $gameMap.event(eventId);
	var _actor = $gameParty.leader();
	var _pose = this.getRespawnPose(eventId);
	GSdebug("RESPAWN AT: x: " + _pose[0]+ ", y:" +_pose[1]);
	$gameMap.event(eventId).setPosition(_pose[0],_pose[1]);
	
	var _distX = _event._x - _actor._x;
	var _distY = _event._y - _actor._y;
	var _range = 10;
	
	if(!this.gS_isInRange(_distX, _distY, _range)){
		$gameVariables.setValue(eventId + 200, this.getHpRespawn(eventId));
		var _SE = [];
		_SE[0] = {};
		_SE[0].name = "Forme";
		_SE[0].volume = 100;
		_SE[0].pitch = 50;
		_SE[0].pan = 0;
		_SE[1] = {};
		_SE[1].name = "P4_Damage_02";
		_SE[1].volume = 90;
		_SE[1].pitch = 70;
		_SE[1].pan = 0;
		_SE[2] = {};
		_SE[2].name = "P4_Damage_03";
		_SE[2].volume = 90;
		_SE[2].pitch = 110;
		_SE[2].pan = 0;
		_SE[3] = {};
		_SE[3].name = "P4_Victory_02";
		_SE[3].volume = 90;
		_SE[3].pitch = 60;
		_SE[3].pan = 0;
		AudioManager.playSe(_SE[Math.round(Math.random()*3)]);
		_event.setOpacity(255)
	}else{
		$gameVariables.setValue(eventId + 200, $gameVariables.value(eventId + 200) - 100);
	}
};
Scene_Map.prototype.gS_isInRange		= function (distX, distY, range){
	return false;
}
Scene_Map.prototype.getMapRespawnPose	= function (mapId){
	var _array;
	switch(mapId){
		case 5:
			_array = [
				[8, 12],
				[32, 12],
				[20, 14],
				[3, 18],
				[37, 18],
				[0, 39],
				[40, 39],
				[17, 34],
				[2, 34],
				[23, 34],
				[38, 34],
				[38, 3]
			];
			break;
		default:
			_array = [
				
			];
			break;
	}
	return _array;
}
Scene_Map.prototype.getRespawnPose		= function (eventId){
	var _posesArray = this.getMapRespawnPose($gameMap.mapId());
	console.log("MAP_ID : " + $gameMap.mapId());
	return _posesArray[Math.floor(Math.random() * _posesArray.length)];
}
Scene_Map.prototype.getHpRespawn		= function (eventId){
	var _enemyHP;
	if(eventId < 51){
		//zombie
		_enemyHP = 80;
	}else if(eventId < 61){
		//zombie coureur
		_enemyHP = 40;
	}else if(eventId < 71){
		//zombie dog
		_enemyHP = 50;
	}else if(eventId < 81){
		//zombie Monster
		_enemyHP = 200;
	}else if(eventId < 91){
		//npc
		_enemyHP = 25;
	}else{
		//elements
		_enemyHP = 50;
	}
	return Math.floor(Math.random() * 20) + _enemyHP;
};
Scene_Map.prototype.gS_isArmHit			= function(distanceX, distanceY, direction, arme) {
	if(distanceY ==0 && distanceX >= -1 && distanceX <= 1 && distanceX >= -1 && distanceX <= 1 ){
		return true;
	}
	/*BON
	if(arme<8 || arme>11){
		if ( direction == 4 || direction == 6){
			if(distanceY == 0 && distanceX >= -1 && distanceX <= 1 ){
				return true;
			}else{
				return false;
			};
		}else if(distanceX == 0 && distanceY >= -1 && distanceY <= 1 ){
			return true;
		} else{
			return false;
		}
	} else if (distanceX == 0 && distanceY >= -1 && distanceY <= 1 ||	distanceY ==0 && distanceX >= -1 && distanceX <= 1 ){
		return true;
	} else {
		return false;
		};*/
};
Scene_Map.prototype.useMunit			= function() {
	var _armeId = $gameVariables.value(101);
	var _mId = 137 + _armeId;
	var _m = $gameVariables.value(_mId);
	var _mHud = 102;
	if( _arme > 3) {
		$gameVariables.setValue( _mId , _m-1 );
		$gameVariables.setValue(_mHud, _m-1);
		$gameSwitches.setValue(3,true);
	};
};
// * setArmeData 							WIP
Game_System.prototype.initialize		= function() {
	this._loadedPwr = 0;
	this._armeData = {};
	this._GStimeStep = [0,0,0];
	_alias.GSH_gameSys_init.call(this);
};
Game_System.prototype.getArmeData1		= function() {
	return[
	null,
	{	name: "Main Nue",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{	name: "Couteau",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{	name: "Matraque",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 1,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Machette",
		cap: 1,
		range: 0,
		pwr: 2,
		perf: 2,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Pistolet à plomb",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{	name: "Gun",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{	name: "6 Coups",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "AutoGun",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Pétoire",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Double Barret",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Pompe",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{	name: "Carabine d'Assaut",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{	name: "Fusil de Chasse",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Fusil Sniper",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Sniper Lourd",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{	name: "Sniper WarTek",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{	name: "AK47",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "R90",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Proto DefSystem",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Sulfateuse Wartek",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Cocktails Molotov",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Grenades",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Grenades Fumigènes",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Grenades aveuglantes",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Cocktails Molotov",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Grenades",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{	name: "Grenades Fumigènes",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{	name: "Grenades aveuglantes",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	}];
};
Game_System.prototype.getArmeData2		= function() {
	return[
	null,
	{
		name: "Main Nue",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Couteau",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "Matraque",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 1,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Machette",
		cap: 1,
		range: 0,
		pwr: 2,
		perf: 2,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Pistolet à plomb",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Gun",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "6 Coups",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "AutoGun",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Pétoire",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Double Barret",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Pompe",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Carabine d'Assaut",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "Fusil de Chasse",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Fusil Sniper",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Sniper Lourd",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Sniper WarTek",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "AK47",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "R90",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Proto DefSystem",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Proto Wartek",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Cocktails Molotov",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Grenades Fumigènes",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades aveuglantes",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Cocktails Molotov",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Grenades Fumigènes",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades aveuglantes",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	}];
};
Game_System.prototype.getArmeData3		= function() {
	return[
	null,
	{
		name: "Main Nue",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Couteau",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "Matraque",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 1,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Machette",
		cap: 1,
		range: 0,
		pwr: 2,
		perf: 2,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Pistolet à plomb",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Gun",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "6 Coups",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "AutoGun",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Pétoire",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Double Barret",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Pompe",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Carabine d'Assaut",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "Fusil de Chasse",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Fusil Sniper",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Sniper Lourd",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 2.4,
		padding: -15
	},
	{
		name: "Sniper WarTek",
		cap: 1,
		range: 0,
		pwr: 1.1,
		perf: 1,
		shortPwr: 100,
		latence: 2.8,
		padding: -15
	},
	{
		name: "AK47",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "R90",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Proto DefSystem",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Proto Wartek",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Cocktails Molotov",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Grenades Fumigènes",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades aveuglantes",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Cocktails Molotov",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	},
	{
		name: "Grenades Fumigènes",
		cap: 1,
		range: 0,
		pwr: 1.7,
		perf: 0,
		shortPwr: 100,
		latence: 2.1,
		padding: -15
	},
	{
		name: "Grenades aveuglantes",
		cap: 1,
		range: 0,
		pwr: 1,
		perf: 0,
		shortPwr: 100,
		latence: 3,
		padding: -15
	}];
}
Game_System.prototype.setArmeData		= function() {
	var _armeId;
	if ($gameParty.leader()){
		if($gameParty.leader().equips()[0]) {
			_armeId = $gameParty.leader().equips()[0];
		}else{
			_armeId = 1;
		};
	}else{
		_armeId = 1;
	};
	if($gameParty.leader().actorId == 1){
		this._armeData = this.getArmeData1()[_armeId];
	}else if($gameParty.leader().actorId == 2){
		this._armeData = this.getArmeData2()[_armeId];
	}else if($gameParty.leader().actorId == 3){
		this._armeData = this.getArmeData3()[_armeId];
	}
}
Game_System.prototype.refreshArmeData	= function() {
	this.setArmeData();
	this.setArmeVar();
	this.setAmmoVar();
	this.gS_hit_needRefresh = 1;
};
Game_System.prototype.setAmmoVar		= function() {
	//munitions
	$gameVariables.setValue(102, $gameVariables.value(this._armeData.id + 137));
	//Pack
	$gameVariables.setValue(103, $gameVariables.value(this._armeData.id+157));
}
Game_System.prototype.setArmeVar		= function() {
	var _armeId = this._armeData.id;
	//armeId
	$gameVariables.setValue(101, _armeId);
	//capacité chargeur:
	$gameVariables.setValue(105, this._armeData.cap);
	//portée:
	$gameVariables.setValue(106, this._armeData.range);
	//puissance
	if(_armeId <= 3){
		$gameVariables.setValue(107, 30 - Math.floor($gameParty.leader().atk * this._armeData.pwr));
	}else if(_armeId < 20){
		$gameVariables.setValue(107, this._armeData.pwr);
	}else{
		$gameVariables.setValue(107, this._loadedPwr);
	}
	//perforation
	$gameVariables.setValue(108, this._armeData.perf);
	//Poucentage puissance à courte portée
	$gameVariables.setValue(109, this._armeData.shortPwr);
	//temps de latence
	if(_armeId <= 3){
		$gameVariables.setValue(111, 30 - Math.floor($gameParty.leader().agi * this._armeData.latence));
	}else if(_armeId < 20){
		$gameVariables.setValue(111, this._armeData.latence);
	}
	//Padding
	$gameVariables.setValue(112, this._armeData.padding);
};
//visu 										WIP
Scene_Map.prototype.setVisu				= function(type) {
	this.refreshArmeData();
	var _actor = $dataActors[$gameParty.leader()._actorId];
	var _chName = _actor.nickname + "_" + this.armeData.id;
	var _chIndex = 2;
	switch (type){
		case 0:
			_chIndex = 0;
			break;
		case "marche":
			_chIndex = 0;
			break;
		case "walk":
			_chIndex = 0;
			break;
		case 1:
			_chIndex = 1;
			break;
		case "tir":
			_chIndex = 1;
			break;
		case "shoot":
			_chIndex = 1;
			break;
		case 2:
			_chIndex = 2;
			break;
		case "recharge":
			_chIndex = 2;
			break;
		case "reload":
			_chIndex = 2;
			break;
		case 3:
			_chIndex = 3;
			break;
		case "touche":
			_chIndex = 3;
			break;
		case "hurt":
			_chIndex = 3;
			break;
		case 4:
			_chIndex = 4;
			break;
		case "touche":
			_chIndex = 4;
			break;
		case "hurt":
			_chIndex = 4;
			break;
		case 5:
			_chIndex = 5;
			break;
		case "ko":
			_chIndex = 5;
			break;
		case "down":
			_chIndex = 5;
			break;
		default:
			_chIndex = 0;
			break;
	}
	$gamePlayer.setImage(_chName,_chIndex);
}
//	GS HUD
function GS_Hud(){
    this.initialize.apply(this, arguments);
};
GS_Hud.prototype						= Object.create(Window_Base.prototype);
GS_Hud.prototype.initialize				= function() {
    Window_Base.prototype.initialize.call(this, 0, 0, 120, 250);
	this.refreshCounter =0
	this.refresh();
};
GS_Hud.prototype.refresh				= function() {
	if($gameSwitches.value(3)){
		this.contents.clear();
		this.visible = $gameSwitches.value(2);
		this.contents.fontSize = 12;
		this.contents.opacity = 150;
		this.padding = 0;
		//this.opacity = 0;
		this.refreshHud();
	};
};
GS_Hud.prototype.refreshHud				= function() {
	this.drawGSLayer("layer1");
	this.refreshGSWeapons();
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
GS_Hud.prototype.refreshHpFil			= function(){
	this.drawGSlife();
}
GS_Hud.prototype.refreshGSWeapons		= function() {
	var _arme = $gameVariables.value(101);
	this.drawWeapon(_arme);
	if(_arme > 3){
		var _munit = $gameVariables.value(102);
		var _chargeur = $gameVariables.value(103);
		this.drawMunits(_arme,_munit,_chargeur);
	};
};
