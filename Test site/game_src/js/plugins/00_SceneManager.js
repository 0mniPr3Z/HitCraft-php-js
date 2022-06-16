var _SC					= _SC || {};
_SC._scenMana_run		= SceneManager.run;

SceneManager._screenWidth  = 1280;
SceneManager._screenHeight = 720;
SceneManager._boxWidth     = 1280;
SceneManager._boxHeight    = 720;
SceneManager.run									= function(sceneClass) {
	_SC._scenMana_run.call(this, sceneClass);
	this.updateResolution();
	if (!Utils.isNwjs()) return;
	if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= "1.6.0") return;
};
SceneManager.updateResolution						= function() {
	var resizeWidth = 1280 - window.innerWidth;
	var resizeHeight = 720 - window.innerHeight;
	window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
};