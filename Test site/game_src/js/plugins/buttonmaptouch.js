DMV.createMapButton = function(parent, id) {
	let button = new DMV.Sprite_MapButton(id);
	button.bitmap = ImageManager.loadSystem('IconSet');
	let icon1 = $gameSystem.mapButtonIcon1(id);
	let icon2 = $gameSystem.mapButtonIcon2(id);
	button.setBothFrames(icon1, icon2);
	if (parent !== undefined && parent.addChild){
		parent.addChild(button);
	}
	return button;
};

Sprite_MapButton = new class(Sprite_Button);

Sprite_MapButton.prototype.initialize = function(buttID) {
	parent.initialize.apply(this, arguments);
	this._map_butt_id = buttID;
};
Sprite_MapButton.prototype.isButtonTouched = function(){
	return !$gameMessage.isBusy() && parent.isButtonTouched.call(this);
};
Sprite_MapButton.prototype.setBothFrames = function(icon1, icon2){
	let bw = Window_Base._iconWidth, bh = Window_Base._iconHeight;
	this.setColdFrame(icon1%16*bw, Math.floor(icon1/16)*bh, bw, bh);
	this.setHotFrame(icon2%16*bw, Math.floor(icon2/16)*bh ,bw, bh);
};
Sprite_MapButton.prototype.callClickHandler = function() {
	let funk = $gameSystem.mapButtonFunk(this._map_butt_id);
	if (funk)  Function(funk).apply(this, arguments);
};
Sprite_MapButton.prototype.update = function() {
	parent.update.apply(this, arguments);
	this.visible = $gameSystem.mapButtonVisible(this._map_butt_id);
	this.x = $gameSystem.mapButtonX(this._map_butt_id);
	this.y = $gameSystem.mapButtonY(this._map_butt_id);
};

//Spriteset Map
Spriteset_Map.prototype.createUpperLayer = function() {
	_aliasGFS._spritMap_creaUppLay.apply(this, arguments);
	this.createMapButtons();
};
Spriteset_Map.createMapButtons = function() {
	this._mapButtons = [];
	let button, x, y, i; 
	for (i=0; i < button_size; i++){
		x = $gameSystem.mapButtonX(i);
		y = $gameSystem.mapButtonY(i);
		if (x != -1 && y != -1){
			button = DMV.createMapButton(this, i);
		}else{
			button = false;
		}
		this._mapButtons.push(button);
	}
};

Game_Temp.prototype.setDestinationNotaButton = function(){
	var bt, ix, iy;
	var x = TouchInput.x;
	var y = TouchInput.y;
	var s = this.map_buttons.length;
	for (var i = 0; i < s; i++){
		bt = this.map_buttons[i];
		ix = (x >= bt.x) && (x <= bt.x + bt.width);
		iy = (y >= bt.y) && (y <= bt.y + bt.height);
		if (ix && iy) return false;
	}
	return true;
};
Game_Temp.prototype.setDestination = function(x, y) {
	if (this.setDestinationNotaButton()){
		old_setDestination.apply(this, arguments);
	}
};

Game_System.prototype.initialize = function() {
	old_initialize.apply(this, arguments);
	this.resetMapButtons();
};
Game_System.prototype.resetMapButtons = function(){
	this._mapButtonDatas = [];
	this._mapButtonFunks = [];
	for (var i = 1; i <= button_size; i++) {
		let string = 'Button ' + i + ' ';
		this._mapButtonDatas.push(DMV.mapParams2n(params[string+'Data']));
		this._mapButtonFunks.push(params[string+'Func']);
	}
};
Game_System.prototype.isMapButt = function(id){
	return id >= 0 && id <= button_size;
};
Game_System.prototype.mapButton = function(id) {
	return this.isMapButt(id) ? $gameTemp.map_buttons[id] : null;
};
Game_System.prototype.mapButtonX = function(id){
	return this.isMapButt(id) ? this._mapButtonDatas[id][0] : -1;
};
Game_System.prototype.setMapButtonX = function(id, newX){
	return this.isMapButt(id) ? this._mapButtonDatas[id][0] = newX : false;
};
Game_System.prototype.mapButtonY = function(id){
	return this.isMapButt(id) ? this._mapButtonDatas[id][1] : -1;
};
Game_System.prototype.setMapButtonY = function(id, newY){
	return this.isMapButt(id) ? this._mapButtonDatas[id][1] = newY : false;
};
Game_System.prototype.mapButtonIcon1 = function(id){
	return this.isMapButt(id) ? this._mapButtonDatas[id][2] : 0;
};
Game_System.prototype.mapButtonIcon2 = function(id){
	return this.isMapButt(id) ? this._mapButtonDatas[id][3] : 0;
};
Game_System.prototype.setMapButtonIcons = function(buttonID, icon1, icon2){
	var button;
	if (this.isMapButt(buttonID)){
	this._mapButtonDatas[buttonID][2] = icon1;
	this._mapButtonDatas[buttonID][3] = icon2;
	if (button = this.mapButton(buttonID)){
		button.setBothFrames(icon1, icon2);
		return true;
	}
	}
	return false;
};
Game_System.prototype.mapButtonVisible = function(id){
	return this.isMapButt(id) ? this._mapButtonDatas[id][4] : false;
};
Game_System.prototype.setMapButtonVisible = function(id, visiBool){
	return this.isMapButt(id) ? this._mapButtonDatas[id][4] = visiBool : false;
};
Game_System.prototype.mapButtonFunk = function(id){
	return this.isMapButt(id) ? this._mapButtonFunks[id] : false;
};
Game_System.prototype.setMapButtonFunk = function(id, newFunkString){
	return this.isMapButt(id) ? this._mapButtonFunks[id] = newFunkString : false;
};

sceneProto.prototype.start = function() {
	sceneProto_start.apply(this, arguments);
	if (this._statusWindow && this._statusWindow.refresh){
		this._statusWindow.refresh();
	}
};