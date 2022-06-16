var _SC							= _SC || {};
_SC._winChoice_init				= Window_ChoiceList.prototype.initialize;
_SC._winChoice_drawItem			= Window_ChoiceList.prototype.drawItem;
_SC._winChoice_resetFontSett	= Window_ChoiceList.prototype.resetFontSettings;

Window_ChoiceList.prototype.initialize = function(messageWindow) {
	_SC._winChoice_init.call(this,messageWindow);
	this.backOpacity = 180;
};
Window_ChoiceList.prototype.drawItem = function(index) {
    _SC._winChoice_drawItem.call(this,index);
};

Window_ChoiceList.prototype.resetFontSettings = function() {
    _SC._winChoice_resetFontSett.call(this);
	if (Galv.Mstyle.font != "") this.contents.fontFace = Galv.Mstyle.font;
	this.contents.fontSize = Galv.Mstyle.fontSize;
};

Window_ChoiceList.prototype.updateChoiceFloat = function(x,w,y,h) {
	var positionType = Galv.VNC.alwaysMid ? 1 : $gameMessage.choicePositionType();
	var setY = y + h;
	if (setY + this.height > Graphics.boxHeight) {
		this.y = y - this.height;
	} else {
		this.y = setY;
	}
	
    switch (positionType) {
    case 0:
        this.x = x;
        break;
    case 1:
        this.x = x + (w / 2) - this.width / 2;
        break;
    case 2:
        this.x = x + w - this.width;
        break;
    };
};
Window_ChoiceList.prototype.loadWindowskin = function() {
	this.windowskin = ImageManager.loadSystem("Window_1");
};