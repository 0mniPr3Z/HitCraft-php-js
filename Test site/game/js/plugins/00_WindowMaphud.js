function Window_MapHud(){
    this.initialize.apply(this, arguments);
};
Window_MapHud.prototype									= Object.create(Window_Base.prototype);
Window_MapHud.prototype.initialize						= function() {
	this.GFS_x = this.getOutHudPosX();
	this.GFS_y = this.getOutHudPosY();
	this.GFS_xDest = this.getInHudPosX();
	this.GFS_yDest = this.getInHudPosY();
	this.GFS_content = 0;
	this.GFS_totalWidth = 228;
    Window_Base.prototype.initialize.call(this, this.getInHudPosX(), this.getInHudPosY(), 275, 226);
	this._padding = 0;
	this.refreshCounter = 0;
	this.refresh();
	this.GFS_cursor = 0;
	this.minimapZoom = 7;
	this.expVisu = 0;
	//this.loadHudColorBitmap();
}
// -> getter
Window_Base.prototype.getOutHudPosX 				= function() {
	return $gameSystem.getMapHudX()-100;
};
Window_Base.prototype.getOutHudPosY 				= function() {
	return $gameSystem.getMapHudY();
};
Window_Base.prototype.getInHudPosX 					= function() {
	return $gameSystem.getMapHudX();
};
Window_Base.prototype.getInHudPosY 					= function() {
	return $gameSystem.getMapHudY();
};

// GFS HUD
// -> Refresh
Window_MapHud.prototype.counterAntiLag				= function() {
	if(this.refreshCounter < 4){
		this.refreshCounter++;
		return false;
	};
	this.refreshCounter = 0;
	return true;
};
Window_MapHud.prototype.refresh							= function() {
	if($gameSystem.hudNeedRefresh() && this.counterAntiLag()){
		this.contents.clear();
		if($gameSystem.hudVisible > 0)
			this.visible = true;
		else
			this.visible = false;
		this.contents.fontSize = 12;
		this.opacity = 0;
		this.padding = 0;
		this.changeTextColor(this.systemColor());
		this.refreshHud();
	};
};
Window_MapHud.prototype.refreshHud						= function() {
	this.refreshHudChange();
	this.refreshPosition();
	this.refreshHudType();
};
Window_MapHud.prototype.refreshHudChange					= function() {
	if(this.GFS_content != $gameSystem.hudForced){
		if(this.isHudOut()){
			this.GFS_content = $gameSystem.GFS_getHudForcedContent();
			this.visible = true;
			this.GFS_cursor = 0;
			this.setMoveInHud();
			$gameSystem.GFS_setHudVisible($gameSystem.GFS_getHudForcedContent(), true);
		}else if(this.isHudIn()){
			this.setMoveOutHud();
		}
	}
};
Window_MapHud.prototype.isHudOut							= function() {
	return this.GFS_x == this.getOutHudPosX() && this.GFS_y == this.getOutHudPosY();
};
Window_MapHud.prototype.isHudIn							= function() {
	return this.GFS_x == this.getInHudPosX() && this.GFS_y == this.getInHudPosY();
};
// -> Position
Window_MapHud.prototype.refreshPosition					= function() {
	var _spd = this.getHudMoveSpeed();

	if(this.GFS_x < this.GFS_xDest){
		this.GFS_x = Math.min(_spd + this.GFS_x, this.GFS_xDest);
	}
	
	if(this.GFS_y < this.GFS_yDest){
		this.GFS_y = Math.min(_spd + this.GFS_y, this.GFS_yDest);
	}
	
	if(this.GFS_x > this.GFS_xDest){
		this.GFS_x = Math.max(this.GFS_x - _spd, this.GFS_xDest);
	}
	
	if(this.GFS_y > this.GFS_yDest){
		this.GFS_y = Math.max(this.GFS_y - _spd, this.GFS_yDest);
	}
};
Window_MapHud.prototype.getHudMoveSpeed					= function() {
	return 50;
};
Window_MapHud.prototype.setMoveOutHud						= function() {
	this.GFS_xDest = this.getOutHudPosX();
	this.GFS_yDest = this.getOutHudPosY();
};
Window_MapHud.prototype.setMoveInHud						= function() {
	this.GFS_xDest = this.getInHudPosX();
	this.GFS_yDest = this.getInHudPosY();
};
Window_MapHud.prototype.refreshHudType					= function() {
	if(this.GFS_content > 0){
		this.GFS_drawLayer();
		this.refreshHpFil();
	}
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
		case 4:
			this.refreshHudMinimap();
			break;
		case 5:
			this.refreshHudLight();
			break;
		default:
			_aliasGFS.error("Window_MapHud>refreshHudType>line:1318");
			break;
	}
};

Game_Event.prototype.GFS_hpRate						= function(){
	return this.GFS_hp / $dataEnemies[this.GFS_enemyId].params[0];
}

// -> MiniMap Hud
Window_MapHud.prototype.refreshHudMinimap					= function() {
	this.refreshMinimap();
	this.refreshMinimapEventsList();
	
};
// -> Package Hud
Window_MapHud.prototype.refreshHudPackage					= function() {
	this.refreshHpFil();
	this.refreshItemsGrid();
};
Window_MapHud.prototype.refreshItemsGrid					= function() {
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
Window_MapHud.prototype.refreshHudStats					= function() {
	this.refreshStatsTab();
	this.refreshHealthTab();
	this.refreshLvl();
};
Window_MapHud.prototype.refreshHpFil						= function() {
	this.GFS_drawLife();
};
Window_MapHud.prototype.refreshStatsTab					= function() {
	this.GFS_drawStatsTab(this.GFS_x-7,this.GFS_y + 7);
};
Window_MapHud.prototype.refreshHealthTab					= function() {
	this.GFS_drawHealthTab(this.GFS_x-7,this.GFS_y + 2);
};
Window_MapHud.prototype.refreshLvl						= function() {
	this.refreshVisuExp();
    var _current = this.expVisu;
    var _lvlUp = $gameParty.leader().nextRequiredExp();
	var _lvl =  $gameParty.leader()._level;
	var _content = " Lvl:" + _lvl+ "   Exp:" + _current + "   Next lvl at:" + _lvlUp + " ";
	var width = 180;
	var _h = 2;
	var fillW = width * (_current/(_lvlUp + _current));
	
	this.contents.fillRect(this.GFS_x + 15, this.GFS_y + 143, width + 2, _h + 2, this.gaugeBackColor());
    this.contents.fillRect(this.GFS_x + 16, this.GFS_y + 144, fillW, _h, this.systemColor());
	
	this.changeTextColor(this.systemColor());
	this.drawText(_content, this.GFS_x + 16, this.GFS_y + 138, width, 32, 'left');
};
Window_MapHud.prototype.refreshVisuExp					= function() {
	var realExp = $gameParty.leader().currentExp();
	if(this.expVisu > realExp)
		this.expVisu = 0;
	else if(this.expVisu < realExp)
		this.expVisu +=1;
};
// -> Weapons Hud
Window_MapHud.prototype.refreshHudWeapons					= function() {
	this.refreshWeapons();
	this.refreshWeapons2();
	this.refreshHpFil(64);
	if(this.refreshCounter >= 10){
		this.refreshCounter = 0;
	}else{
		this.refreshCounter++;
	};
};
Window_MapHud.prototype.refreshWeapons					= function() {
	var _arme = $gamePlayer.GFS_getPlayerArme().id;
	this.GFS_drawWeapon(_arme, 4 + this.GFS_x, 10 + this.GFS_y);
	if(_arme > 5){
		this.GFS_drawMunits(_arme, 4 + this.GFS_x, 48 + this.GFS_y);
		this.GFS_drawPack(_arme, 4 +  + this.GFS_x, 84 +  + this.GFS_y);
	};
};
Window_MapHud.prototype.refreshWeapons2					= function() {
	var _armeA;
	var _armeB;
	if ($gameParty.leader().equips()[1] != null)
		_armeA = $gameParty.leader().equips()[1].id;
	else
		_armeA = 1;
	if ($gameParty.leader().equips()[2] != null)
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

function Window_MapHud2(){
    this.initialize.apply(this, arguments);
};
Window_MapHud2.prototype									= Object.create(Window_Base.prototype);
Window_MapHud2.prototype.initialize						= function() {
    Window_Base.prototype.initialize.call(this, this.getInHudPosX() - 27, this.getInHudPosY()- 24,1280, 720);
	this.radTimer = 0;
	this.refresh();
};
Window_MapHud2.prototype.refresh							= function() {
	
	this.contents.clear();
	if($gameSystem.Window_MapHudVisible() > 0 && $gameSystem.Window_MapHudVisible() < 5){
		this.visible = true;
		this.refreshHud();
	}else{
		this.visible = false;
	};
};
Window_MapHud2.prototype.refreshHud						= function() {
	this.refreshHudMask();
	this.refreshRadGauges();
};

Window_Base.prototype.refreshHudMask				= function() {
	var _name = "layout";
	var bitmap = ImageManager.GFS_loadHud(_name);
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, 0, 0);
	for(i = 1; i < $gamePlayer.GFS_actionPts; i++){
		var y = 193;
		var x = 233 - i * 8;
		var bitmap2 = ImageManager.GFS_loadHud("actionLed");
		this.contents.blt(bitmap2, 0, 0, bitmap2._canvas.width, bitmap2._canvas.height, x, y);
	}
};
Window_MapHud2.prototype.refreshRadGauges				= function() {
	if(this.radTimer == 0){
		this.radIndex = $gameSystem.radZone + Math.round(Math.random());
		this.radTimer = 18;
	}else{
		this.radTimer--;
	}
	/*if($gameSystem.radZone == 0)
	_index = 0;*/
	var width = 6;
	var height = 12;
	var nbrLine = 3;
	var bitmap = ImageManager.GFS_loadHud('radiation');
	var pw = width;
	var ph = height;
	var sx = this.radIndex % nbrLine * pw;
	var sy = Math.floor(this.radIndex / nbrLine) * ph;
	this.contents.blt(bitmap, sx, sy, pw/2, ph, 13, 134);
};