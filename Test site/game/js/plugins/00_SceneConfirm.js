function Scene_Confirm() {
    this.initialize.apply(this, arguments);
}

Scene_Confirm.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Confirm.prototype.constructor = Scene_Confirm;

Scene_Confirm.prototype.initialize = function() {
	$gameSwitches.setValue(8, false);
	this._cancelEnable = $gameSwitches.value(9);
	this._msg = $dataActors[50].nickname.length > 0 ? $dataActors[50].nickname : "Confirmer";
	console.log(this._msg);
	Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Confirm.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

Scene_Confirm.prototype.update_particles = function() {
	
};

Scene_Confirm.prototype.stop = function() {
    Scene_MenuBase.prototype.stop.call(this);
    this._commandWindow.close();
};

Scene_Confirm.prototype.createBackground = function() {
    Scene_MenuBase.prototype.createBackground.call(this);
    this.setBackgroundOpacity(255);
};

Scene_Confirm.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_Confirm(this._cancelEnable, this._msg);
    this._commandWindow.setHandler('confirm',	this.commandConfirm.bind(this));
    this._commandWindow.setHandler('cancel',	this.commandCancel.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Confirm.prototype.commandConfirm = function() {
    $gameSwitches.setValue(8, true);
	SoundManager.playOk();
	SceneManager.pop();
};
Scene_Confirm.prototype.commandCancel = function() {
	if(this._cancelEnable){
		SoundManager.playCancel();
		SceneManager.pop();
	}else{
		SoundManager.playBuzzer();
	}
};