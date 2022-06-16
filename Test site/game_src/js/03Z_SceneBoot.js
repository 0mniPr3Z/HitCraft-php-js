function Scene_Boot() {
    this.initialize.apply(this, arguments);
}
Scene_Boot.prototype = Object.create(Scene_Base.prototype);
Scene_Boot.prototype.constructor = Scene_Boot;
Scene_Boot.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._startDate = Date.now();
}
Scene_Boot.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    //DataManager.loadDatabase();
    //ConfigManager.load();
    this.loadSystemImage();
}
Scene_Boot.prototype.loadSystemWindowImage = function() {
    ImageManager.loadSystem('IconSet');
    ImageManager.loadSystem('Balloon');
    ImageManager.loadSystem('Shadow1');
    ImageManager.loadSystem('Shadow2');
    ImageManager.loadSystem('Damage');
    ImageManager.loadSystem('States');
    ImageManager.loadSystem('ButtonSet');
}
Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
	if($dataManager.loadPlayerData()){
		DataManager.loadRegisteredGameData();
		SceneManager.goto(Scene_Map);
	}else{
		DataManager.loadDatabase();
		DataManager.setupNewGame();
		SceneManager.goto(Scene_CharacterCreator);
	}
}
Scene_Boot.prototype.isReady = function() {
    if (Scene_Base.prototype.isReady.call(this)) {
        return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
    }else{
        return false;
    }
}
Scene_Boot.prototype.isGameFontLoaded = function() {
    if (Graphics.isFontLoaded('GameFont')) {
        return true;
    } else {
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= 20000) {
            throw new Error('Failed to load GameFont');
        }
    }
}
