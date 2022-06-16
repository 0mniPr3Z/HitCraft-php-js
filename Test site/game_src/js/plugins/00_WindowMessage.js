var _SC						= _SC || {};
_SC._WinMsg_nwLinX			= Window_Message.prototype.newLineX;
_SC._WinMsg_nwPg			= Window_Message.prototype.newPage;
_SC._WinMsg_procssEscChar	= Window_Message.prototype.processEscapeCharacter;
_SC._WinMsg_strtWait		= Window_Message.prototype.startWait;
_SC._WinMsg_rfrshPausSign	= Window_Message.prototype._refreshPauseSign;
_SC._WinMsg_creatAllParts	= Window_Message.prototype._createAllParts;
_SC._WinMsg_creatSubWin		= Window_Message.prototype.createSubWindows;

Window_Message.prototype.newLineX					= function() {
	return $gameMessage.faceName() === '' ? Galv.Mstyle.padding[3] : Window_Base._faceWidth + 24 + Galv.Mstyle.padding[3];
};
Window_Message.prototype.newPage					= function(textState) {
	_SC._WinMsg_nwPg.call(this,textState);
	textState.y += Galv.Mstyle.padding[0];
};
Window_Message.prototype.processEscapeCharacter		= function(code, textState) {
	if (Galv.Mstyle.testActive && Galv.Mstyle.ignoreChars.contains(code)) {
		var code = '.';
	};
	_SC._WinMsg_procssEscChar.call(this,code,textState);
};
Window_Message.prototype.startWait 					= function(count) {
	if (Galv.Mstyle.testActive) return;
	_SC._WinMsg_strtWait.call(this,count);
};
Window_Message.prototype.changeWindowDimensions 	= function() {
	if (this.pTarget != null) {
		// Calc max width and line height to get dimensions
		var w = 10;
		var h = 0;

		if (Imported.Galv_MessageBusts) {
			if ($gameMessage.bustPos == 1) {
				var faceoffset = 0;
			} else {
				var faceoffset = Galv.MB.w;
			};
		} else {
			var faceoffset = Window_Base._faceWidth + 25;
		};

		// Calc X Offset
		var xO = $gameMessage._faceName ? faceoffset : 0;
		xO += Galv.Mstyle.padding[1] + Galv.Mstyle.padding[3]; // Added padding

		// Calc text width
		this.resetFontSettings();
		for (var i = 0; i < $gameMessage._texts.length; i++) {
			var lineWidth = this.testWidthEx($gameMessage._texts[i]) + this.standardPadding() * 2 + xO;
			if (w < lineWidth) w = lineWidth;
			
		};
		this.resetFontSettings();
		this.width = Math.min(Graphics.boxWidth,w);
		
		// Calc minimum lines
		var minFaceHeight = 0;
		if ($gameMessage._faceName) {
			w += 15;
			if (Imported.Galv_MessageBusts) {
				if ($gameMessage.bustPos == 1) w += Galv.MB.w;
				minFaceHeight = 0;
			} else {
				minFaceHeight = Window_Base._faceHeight + this.standardPadding() * 2;
			};
		};
		
		// Calc text height
		var textState = { index: 0 };
		textState.text = this.convertEscapeCharacters($gameMessage.allText());
		var allLineHeight = this.calcTextHeight(textState,true);
		var height = allLineHeight + this.standardPadding() * 2;
		var minHeight = this.fittingHeight($gameMessage._texts.length);
		this.height = Math.max(height,minHeight,minFaceHeight);
		this.height += Galv.Mstyle.padding[0] + Galv.Mstyle.padding[2];
		this.yOffset = -Galv.Mstyle.yOffet - this.height;
		
	} else {
		this.yOffset = 0;
		this.width = this.windowWidth();
		this.height = Galv.Mstyle.Window_Message_windowHeight.call(this);
		this.x = (Graphics.boxWidth - this.width) / 2;
	};
};
Window_Message.prototype.testWidthEx 				= function(text) {
    return this.drawTextExTest(text, 0, this.contents.height);
};
Window_Message.prototype.loadWindowskin 			= function() {
	this.windowskin = ImageManager.loadSystem($gameSystem._messageWindowSkin);
};
Window_Message.prototype.refreshPauseSign			= function() {
	_SC._WinMsg_rfrshPausSign.call(this);
	
	var x = 0;
	var y = 0;
	var oX = Galv.Mstyle.indPos[1];
	var oY = Galv.Mstyle.indPos[2];
	
	this._windowPauseSignSprite.anchor.y = 0.5;
	this._windowPauseSignSprite.anchor.x = 0.5;
	
	var pos = Galv.Mstyle.indPos[0];
	
	switch (pos) {
		case 1:
			x = oX;
			y = this._height + oY;
			break;
		case 2:
			x = this._width / 2 + oX;
			y = this._height + oY;
			break;
		case 3:
			x = this.width + oX;
			y = this._height + oY;
			break;
		case 4:
			x = oX;
			y = this.height / 2 + oY;
			break;
		case 6:
			x = this.width + oX;
			y = this.height / 2 + oY;
			break;
		case 7:
			x = oX;
			y = oY;
			break;
		case 8:
			x = this._width / 2 + oX;
			y = oY;
			break;
		case 9:
			x = this.width + oX;
			y = oY;
			break;
	}
	this._windowPauseSignSprite.move(x, y);
};
Window_Message.prototype.createAllParts				= function() {
	_SC._WinMsg_creatAllParts.call(this);
	this._windowPauseSignSprite.scale.x	= Galv.Mstyle.iZoom;
	this._windowPauseSignSprite.scale.y	= Galv.Mstyle.iZoom;
	this._downArrowSprite.scale.x		= Galv.Mstyle.iZoom;
	this._downArrowSprite.scale.y		= Galv.Mstyle.iZoom;
	this._upArrowSprite.scale.x			= Galv.Mstyle.iZoom;
	this._upArrowSprite.scale.y			= Galv.Mstyle.iZoom;
};
Window_Message.prototype.createSubWindows			= function() {
	/*
	this._itemsCatWin	= new Window_ItemsCat(this);		
    this._bagWin		= new Window_Bag(this);
	this._stockWin		= new Window_Stock(this);
	*/
	_SC._WinMsg_creatSubWin.call(this);
};



