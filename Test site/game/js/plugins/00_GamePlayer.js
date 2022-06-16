var _SC					= _SC || {};
_SC._gamPlayr_init		= Game_Player.prototype.initialize;
_SC._gamPlayr_refr		= Game_Player.prototype.refresh;

Game_Player.prototype.initialize					= function(){
	this.SC_action = 0;
    _SC._gamPlayr_init.call(this);
}
Game_Player.prototype.refresh						= function() {
	_SC._gamPlayr_refr.call(this);
    var _actor			= $gameParty.leader();
    var _charName		= _actor ? this.SC_getChar() : '';
    var _charIndex		= _actor ? this.SC_getActionIndex() : 0;
    this.setImage(_charName, _charIndex);
    this._followers.refresh();
}

//GETTERS
Game_Character.prototype.SC_getCharName				= function() {
	return $gameParty.leader()._nickname;
}
Game_Player.prototype.SC_getWeaponId				= function() {
	 return $gameParty.leader().equips()[0].id || 1;
}
Game_Player.prototype.SC_getArmorId					= function() {
	 return $gameParty.leader().equips()[5].id || 63;
	 
}
Game_Character.prototype.SC_getActionIndex			= function() {
	if(this.isDashing())
		return 4;
	else
	return (this.SC_action + 1) % 8 - 1;
}
Game_Player.prototype.SC_getChar					= function(){
	var _armeId			= this.SC_getWeaponId()  || 1;
	var _tenueId		= this.SC_getArmorId() || 63;
	var _actionIndex	= this.SC_getActionIndex();
	
	if(_actionIndex < 8)
		return this.SC_getFullChar(this.SC_getCharName(), _tenueId, _armeId);
	else if(_actionIndex < 16)
		return this.SC_getFullChar(this.SC_getCharName() + "_B", _tenueId, _armeId);
	else
		return this.SC_getFullChar(this.SC_getCharName() + "_C", _tenueId, _armeId);
}
Game_Character.prototype.SC_getFullChar				= function(name, tenueId, armeId) {
	return name + "-" + tenueId + "_" + armeId;
}
