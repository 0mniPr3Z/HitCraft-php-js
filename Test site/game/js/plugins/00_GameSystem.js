var _SC							= _SC || {};
_SC._GamSys_init				= Game_System.prototype.initialize;

Game_System.prototype.initialize = function() {
	this._messageWindowSkin		= Galv.Mstyle.skin + "";
	this._messageArrowGraphic	= Galv.Mstyle.arrow + "";
	this.hudVisible				= false;
	this.hudForced				= 0;
	this.isShootActivate		= false;
	this._barils				= [];
	this._quests				= [];
	this.sc_isShootActivate = false;
	_SC._GamSys_init.call(this);
}
Game_System.prototype.getMapHudX					= function() {
	return 16;
}
Game_System.prototype.getMapHudY					= function() {
	return 16;
}
Game_System.prototype.hudNeedRefresh			= function() {
	return true;
};