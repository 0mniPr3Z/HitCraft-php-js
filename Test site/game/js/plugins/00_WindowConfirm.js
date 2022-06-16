var  _SC = _SC || {};
_SC._WinOk_WinSlct_drawAllIt = Window_Selectable.prototype.drawAllItems;
function Window_Confirm() {
    this.initialize.apply(this, arguments);
}

Window_Confirm.prototype = Object.create(Window_Command.prototype);
Window_Confirm.prototype.constructor = Window_Confirm;

Window_Confirm.prototype.initialize = function(cancel, msg) {
    Window_Command.prototype.initialize.call(this, 0, 0);
	this._msg = msg.length > 0 ? msg : "Confirmer"; 
	this._isCancelable = cancel;
    this.updatePlacement();
    this.openness = 0;
    this.open();
};

Window_Confirm.prototype.windowWidth = function() {
    return 500;
};

Window_Confirm.prototype.updateCursor = function() {
    if (this._cursorAll) {
        var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, this.fittingHeight(0), this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index() + 1);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, this.fittingHeight(0), 0, 0);
    }
};
Window_Confirm.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
Window_Confirm.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index + 1);
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, "center");
};

Window_Confirm.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_Confirm.prototype.makeCommandList = function() {
	this.addCommand(this._msg, 'blank', true);
    this.addCommand("Confirmer", 'confirm');
	if(this._isCancelable)
		this.addCommand(TextManager.cancel,  'cancel');
};

Window_Confirm.prototype.loadWindowskin 			= function() {
	this.windowskin = ImageManager.loadSystem("Window_3");
};