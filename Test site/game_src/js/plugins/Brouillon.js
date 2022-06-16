

Scene_Map.prototype.updateGSAction = function(){
	this.gsAction = this.gsAction || "libre";
	if(this.gsAction == "libre"){
		this.attente = 0;
		if(Input.keyPressed("R")){ //
			this._gsAction ="recharger";
		}else if(Input.keyPressed("E")){ //
			this._gsAction ="tirer";
		}else if(Input.keyPressed("W")){ //
			this._gsAction ="arme_plus";
		}else if(Input.keyPressed("X")){ //
			this._gsAction ="arme_moins";
		}else if(Input.keyPressed("S")){ //
			this._gsAction ="autre";
		};
	}else{
		switch(this.gsAction){
			case "recharger":
				this.recharge();
			break;
			case "tirer":
				this.tirer();
			break;
			case "armePlus":
				this.changeArme(true);
			break;
			case "armeMoins":
				this.changeArme(false);
			break;
			case "autre":
				this.changeArme(false);
			break;
			default:
				this.gsAction = "libre";
			break;
		};
	};
};

Scene_Map..prototype.recharge = function(){
	var _armeId = $gameVariables.value(101);
	var _munit = $dataArm[_armeId].munit.nbrActu;
	var _munitStk = $dataArm[_armeId].munit.stock;
	var _munitMax= $dataArme[_armeId].munit.nbrMax;
	
	if( _armeId > 3 && _munit < _munitMax){
		if(_munitStk > 0){
			//six pistol
			if(_armeId == 5){
				switch(this.attente){
					case 0:
						AudioManager.playReload(_1);
						_munitStk--;
						_munit++;
					break;
					case 30:
						AudioManager.playReload(_1);
						_munit++;
					break;
					case 60:
						AudioManager.playReload(_1);
						_munit++;
					break;
					case 90:
						AudioManager.playReload(_1);
						_munit++;
					break;
					case 120:
						AudioManager.playReload(_1);
						_munit++;
					break;
					case 150:
						AudioManager.playReload(_2);
						_munit++;
						this.gsAction = "libre";
					break;
					default:
						this.attente++;
					break;
				};
			//double barrel
			} else if(_armeId == 8){
				switch(this.attente){
					case 0:
						AudioManager.playReload();
						_munitStk--;
						_munit++;
					break;
					case 55:
						AudioManager.playReload();
						_munit++;
					break;
					case 80:
						this.gsAction = "libre";
					break;
					default:
						this.attente++;
					break;
				};
			//others
			} else {
				AudioManager.playReload();
				_munit=_munitMax;
				_munitStk--;
				if(this.attente > $dataArm[_armeId].vitesse.recharg){
					this.gsAction = "libre";
				}else{
					this.attente++;
				};
			};
		}else{
			AudioManager.playNoAmmo();
		};
	};
};

AudioManager.playReload =function(suffix){
	var _suffix = suffix || "";
	var _armeId = $gameSwitches.value(101);
	var _se = {};
	_se.name="OZ_rech_"+_armeId+_suffix;
	_se.volume=100;
	_se.pitch=100;
	_se.pan=0;
	AudioManager.playSe(_se);
};

AudioManager.playNoAmmo =function(){
	var _se = {};
	_se.name="OZ_ammoOut";
	_se.volume=100;
	_se.pitch=100;
	_se.pan=0;
	AudioManager.playSe(_se);
};

var _actor = $dataActors[$gameParty.leader()._actorId];
		var _chName = _actor.nickname + "_" + $gameVariables.value(101);
var _chIndex = 2;
$gamePlayer.setImage(_chName,_chIndex);
//================


Game_Map.prototype.distance(x1, y1, x2, y2) 
_clone_SMap_updaMain = Scene_Map.prototype.updateMain;

Scene_Map.prototype.updateMain = function(){
	_clone_SMap_updaMain.call(this);
	GS.gunFight.updateMain()
}


Scene_Map.prototype.createDisplayObjects













var _chName = $gamePlayer._characterNickname + $gameVariables.value(101);
var _chIndex = $gameVariables.value(61);
$gamePlayer.setImage(_chName,_chIndex);
}

image":{"characterIndex":0,"characterName":"","direction":2,"pattern":0,"tileId":0},"list":[{"co

var _arme = $gameVariables.value(101);
var _mSlot=_arme+137; var _pkSlot=_arme+157; var _gV=$gameVariables;
var _mNbr=_gV.value(_mSlot);  var _pkNbr=_gV.value(_pkSlot); var _mCap=_gV.value(105);
var _se = {}; _se.volume=100; _se.pitch=100; _se.pan=0;
if ( _mNbr <0 && _pkNbr >0){
_se.name="rech_"+_arme; _gV.setValue(_mSlot, _mNbr+_mCap); _gV.setValue(_pkSlot, _pkNbr-1);
} else { 	_se.name="noAmmo";  }; AudioManager.playSe(_se);



this._tileId = 0;
    this._characterName = '';
    this._characterIndex = 0;

Game_Character.prototype.processMoveCommand = function(command) {
    var gc = Game_Character;
    var params = command.parameters;
    switch (command.code) {
    case gc.ROUTE_END:
        this.processRouteEnd();
        break;
    case gc.ROUTE_MOVE_DOWN:
        this.moveStraight(2);
        break;
    case gc.ROUTE_MOVE_LEFT:
        this.moveStraight(4);
        break;
    case gc.ROUTE_MOVE_RIGHT:
        this.moveStraight(6);
        break;
    case gc.ROUTE_MOVE_UP:
        this.moveStraight(8);
        break;
    case gc.ROUTE_MOVE_LOWER_L:
        this.moveDiagonally(4, 2);
        break;
    case gc.ROUTE_MOVE_LOWER_R:
        this.moveDiagonally(6, 2);
        break;
    case gc.ROUTE_MOVE_UPPER_L:
        this.moveDiagonally(4, 8);
        break;
    case gc.ROUTE_MOVE_UPPER_R:
        this.moveDiagonally(6, 8);
        break;
    case gc.ROUTE_MOVE_RANDOM:
        this.moveRandom();
        break;
    case gc.ROUTE_MOVE_TOWARD:
        this.moveTowardPlayer();
        break;
    case gc.ROUTE_MOVE_AWAY:
        this.moveAwayFromPlayer();
        break;
    case gc.ROUTE_MOVE_FORWARD:
        this.moveForward();
        break;
    case gc.ROUTE_MOVE_BACKWARD:
        this.moveBackward();
        break;
    case gc.ROUTE_JUMP:
        this.jump(params[0], params[1]);
        break;
    case gc.ROUTE_WAIT:
        this._waitCount = params[0] - 1;
        break;
    case gc.ROUTE_TURN_DOWN:
        this.setDirection(2);
        break;
    case gc.ROUTE_TURN_LEFT:
        this.setDirection(4);
        break;
    case gc.ROUTE_TURN_RIGHT:
        this.setDirection(6);
        break;
    case gc.ROUTE_TURN_UP:
        this.setDirection(8);
        break;
    case gc.ROUTE_TURN_90D_R:
        this.turnRight90();
        break;
    case gc.ROUTE_TURN_90D_L:
        this.turnLeft90();
        break;
    case gc.ROUTE_TURN_180D:
        this.turn180();
        break;
    case gc.ROUTE_TURN_90D_R_L:
        this.turnRightOrLeft90();
        break;
    case gc.ROUTE_TURN_RANDOM:
        this.turnRandom();
        break;
    case gc.ROUTE_TURN_TOWARD:
        this.turnTowardPlayer();
        break;
    case gc.ROUTE_TURN_AWAY:
        this.turnAwayFromPlayer();
        break;
    case gc.ROUTE_SWITCH_ON:
        $gameSwitches.setValue(params[0], true);
        break;
    case gc.ROUTE_SWITCH_OFF:
        $gameSwitches.setValue(params[0], false);
        break;
    case gc.ROUTE_CHANGE_SPEED:
        this.setMoveSpeed(params[0]);
        break;
    case gc.ROUTE_CHANGE_FREQ:
        this.setMoveFrequency(params[0]);
        break;
    case gc.ROUTE_WALK_ANIME_ON:
        this.setWalkAnime(true);
        break;
    case gc.ROUTE_WALK_ANIME_OFF:
        this.setWalkAnime(false);
        break;
    case gc.ROUTE_STEP_ANIME_ON:
        this.setStepAnime(true);
        break;
    case gc.ROUTE_STEP_ANIME_OFF:
        this.setStepAnime(false);
        break;
    case gc.ROUTE_DIR_FIX_ON:
        this.setDirectionFix(true);
        break;
    case gc.ROUTE_DIR_FIX_OFF:
        this.setDirectionFix(false);
        break;
    case gc.ROUTE_THROUGH_ON:
        this.setThrough(true);
        break;
    case gc.ROUTE_THROUGH_OFF:
        this.setThrough(false);
        break;
    case gc.ROUTE_TRANSPARENT_ON:
        this.setTransparent(true);
        break;
    case gc.ROUTE_TRANSPARENT_OFF:
        this.setTransparent(false);
        break;
    case gc.ROUTE_CHANGE_IMAGE:
        this.setImage(params[0], params[1]);
        break;
    case gc.ROUTE_CHANGE_OPACITY:
        this.setOpacity(params[0]);
        break;
    case gc.ROUTE_CHANGE_BLEND_MODE:
        this.setBlendMode(params[0]);
        break;
    case gc.ROUTE_PLAY_SE:
        AudioManager.playSe(params[0]);
        break;
    case gc.ROUTE_SCRIPT:
        eval(params[0]);
        break;
    }
};