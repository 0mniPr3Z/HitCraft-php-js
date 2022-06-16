//-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.
Window_NameEdit.prototype.initialize = function(actor, maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2 + 150;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = actor;
    this._name = actor.name().slice(0, this._maxLength);
    this._index = this._name.length;
    this._maxLength = maxLength;
    this._defaultName = this._name;
	this.loadWindowskin();
	this.opacity = 0;
    this.deactivate();
    this.refresh();
};
Window_NameEdit.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('Window_Terminal');
};
Window_NameEdit.prototype.name = function() {
    return this._name[0].toUpperCase() + this._name.substr(1, this._name.length -1).toLowerCase();
};
Window_NameEdit.prototype.faceWidth = function() {
    return 0;
};
Window_NameEdit.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
		if(this._index == 0)
			this._name += ch.toUpperCase();
		else
			this._name += ch.toLowerCase();
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};
Window_NameEdit.prototype.underlineColor = function() {
    return this.normalColor();
};
Window_NameEdit.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
};
Window_NameEdit.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._name[index] || '', rect.x, rect.y);
};
Window_NameEdit.prototype.refresh = function() {
    this.contents.clear();
    for (var i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (var j = 0; j < this._name.length; j++) {
        this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};
//-----------------------------------------------------------------------------
// Window_NameInput
//
// The window for selecting text characters on the name input screen.
Window_NameInput.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('Window_Terminal');
};
Window_NameInput.prototype.cursorDown = function(wrap) {
    if (this._index < 20 || wrap) {
        this._index = (this._index + 10) % 30;
    }
};
Window_NameInput.prototype.cursorUp = function(wrap) {
    if (this._index >= 10 || wrap) {
        this._index = (this._index + 20) % 30;
    }
};
Window_NameInput.LATIN1 =
        [	'A','B','C','D','E','F','G','H','I','J',
			'K','L','M','N','O','P','Q','R','S','T',
			'U','V','W','X','Y','Z','-',' ', '<-', 'OK'];
Window_NameInput.prototype.initialize = function(editWindow) {
    var x = editWindow.x;
    var y = editWindow.y + editWindow.height + 8;
    var width = editWindow.width;
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._editWindow = editWindow;
    this._page = 0;
    this._index = 0;
	this.opacity = 0;
	this.loadWindowskin();
    this.refresh();
    this.updateCursor();
    this.activate();
};
Window_NameInput.prototype.table = function() {
	return [Window_NameInput.LATIN1];
};
Window_NameInput.prototype.maxCols = function() {
    return 10;
};
Window_NameInput.prototype.maxItems = function() {
    return 30;
};
Window_NameInput.prototype.character = function() {
    return this._index < 28 ? this.table()[this._page][this._index] : '';
};
Window_NameInput.prototype.isPageChange = function() {
    return false;
};
Window_NameInput.prototype.isOk = function() {
    return this._index === 29;
};
Window_NameInput.prototype.itemRect = function(index) {
    return {
        x: index % 10 * 42,
        y: Math.floor(index / 10) * this.lineHeight(),
        width: 42,
        height: this.lineHeight()
    };
};
Window_NameInput.prototype.refresh = function() {
    var table = this.table();
    this.contents.clear();
this.changeTextColor("#80FF80");
    for (var i = 0; i < 90; i++) {
        var rect = this.itemRect(i);
        rect.x += 3;
        rect.width -= 6;
        this.drawText(table[this._page][i], rect.x, rect.y, rect.width, 'center');
    }
};
Window_NameInput.prototype.processJump = function() {
    if (this._index !== 29) {
        this._index = 29;
        SoundManager.playCursor();
    }
};
Window_NameInput.prototype.processBack = function() {
    if (this._editWindow.back()) {
        SoundManager.playCancel();
    }
};
Window_NameInput.prototype.processOk = function() {
    if (this.character()) {
        this.onNameAdd();
    } else if (this.isPageChange()) {
        SoundManager.playOk();
        this.cursorPagedown();
    } else if (this.isOk()) {
        this.onNameOk();
    }
};
Window_NameInput.prototype.onNameAdd = function() {
    if (this._editWindow.add(this.character())) {
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
    }
};
Window_NameInput.prototype.onNameOk = function() {
    if (this._editWindow.name() === '') {
        if (this._editWindow.restoreDefault()) {
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
    } else {
        SoundManager.playOk();
        this.callOkHandler();
    }
};
