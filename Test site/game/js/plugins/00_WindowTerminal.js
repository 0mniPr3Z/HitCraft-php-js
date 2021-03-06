SoundManager.playTerminalKey = function(){
	var se = {};
	se.name = "Terminal_" + Math.randomInt(0,4);
	se.pan = 0;
	se.pitch = 100;
	se.volume = 90;
	AudioManager.playSe(se);
}

var $scTerminal      = null;
ImageManager.loadTerminal					= function(filename) {
    return this.loadBitmap('img/pictures/', filename, 0, true);
};
Scene_Map.prototype.isSceneChangeOk = function() {
    return this.isActive() && !$gameMessage.isBusy() && !$scTerminal.isBusy;
};
Game_Message.prototype.hasText = function() {
    return this._texts.length > 0 && !$scTerminal.isBusy();
};
Scene_Map.prototype.createAllWindows = function() {
	this.sc_createTerminalWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};
Scene_Map.prototype.sc_createTerminalWindow = function() {
    this._terminalWindow = new Window_Terminal();
    this.addWindow(this._terminalWindow);
    this._terminalWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
};
DataManager.createGameObjects = function() {
    $gameTemp			= new Game_Temp();
    $gameSystem			= new Game_System();
    $gameScreen			= new Game_Screen();
    $gameTimer			= new Game_Timer();
    $gameMessage		= new Game_Message();
    $gameSwitches      = new Game_Switches();
    $gameVariables     = new Game_Variables();
    $gameSelfSwitches  = new Game_SelfSwitches();
    $gameActors        = new Game_Actors();
    $gameParty         = new Game_Party();
    $gameTroop         = new Game_Troop();
    $gameMap           = new Game_Map();
    $gamePlayer        = new Game_Player();
	
    $scTerminal			= new Game_Terminal();
};
Window_Message.prototype.canStart						= function() {
    return $gameMessage.hasText() && !$gameMessage.scrollMode() && !$scTerminal.hasText();
};
Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
	text = text.replace(/\x1bZ\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1])).padZero(3);
    }.bind(this));
	text = text.replace(/\x1bk\[(\d+)\]/gi, function(){this.playHacking(); return""}.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};
Window_Terminal.prototype.playHacking = function(){
	this._isHacking = true;
};

Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false;
    switch (this._waitMode) {
	case 'terminal':
        waiting = $scTerminal.isBusy();
        break;
    case 'message':
        waiting = $gameMessage.isBusy();
        break;
    case 'transfer':
        waiting = $gamePlayer.isTransferring();
        break;
    case 'scroll':
        waiting = $gameMap.isScrolling();
        break;
    case 'route':
        waiting = this._character.isMoveRouteForcing();
        break;
    case 'animation':
        waiting = this._character.isAnimationPlaying();
        break;
    case 'balloon':
        waiting = this._character.isBalloonPlaying();
        break;
    case 'gather':
        waiting = $gamePlayer.areFollowersGathering();
        break;
    case 'action':
        waiting = BattleManager.isActionForced();
        break;
    case 'video':
        waiting = Graphics.isVideoPlaying();
        break;
    case 'image':
        waiting = !ImageManager.isReady();
        break;
    }
    if (!waiting) {
        this._waitMode = '';
    }
    return waiting;
};
Game_Interpreter.prototype.command303 = function() {
    if (!$gameParty.inBattle()) {
        if ($dataActors[this._params[0]]) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    return true;
};
SceneManager.snapForBackground = function() {
	this._backgroundBitmap = this.snap();
	//this._backgroundBitmap.blur();
};
//-----------------------------------------------------------------------------
// Game_Terminal
//
// The game object class for the state of the message window that displays text
// or selections, etc.

function Game_Terminal() {
    this.initialize.apply(this, arguments);
}
Game_Terminal.prototype.initialize				= function() {
    this.clear();
};
Game_Terminal.prototype.clear					= function() {
    this._texts = [];
    this._choices = [];
    this._faceName = '';
    this._faceIndex = 0;
    this._background = 0;
    this._positionType = 2;
    this._choiceDefaultType = 0;
    this._choiceCancelType = 0;
    this._choiceBackground = 0;
    this._choicePositionType = 2;
    this._numInputVariableId = 0;
    this._numInputMaxDigits = 0;
    this._itemChoiceVariableId = 0;
    this._itemChoiceItypeId = 0;
    this._scrollMode = false;
    this._scrollSpeed = 2;
    this._scrollNoFast = false;
    this._choiceCallback = null;
};
Game_Terminal.prototype.choices					= function() {
    return this._choices;
};
Game_Terminal.prototype.faceName				= function() {
    return this._faceName;
};
Game_Terminal.prototype.faceIndex				= function() {
    return this._faceIndex;
};
Game_Terminal.prototype.background				= function() {
    return this._background;
};
Game_Terminal.prototype.positionType			= function() {
    return this._positionType;
};
Game_Terminal.prototype.choiceDefaultType		= function() {
    return this._choiceDefaultType;
};
Game_Terminal.prototype.choiceCancelType		= function() {
    return this._choiceCancelType;
};
Game_Terminal.prototype.choiceBackground		= function() {
    return this._choiceBackground;
};
Game_Terminal.prototype.choicePositionType		= function() {
    return this._choicePositionType;
};
Game_Terminal.prototype.numInputVariableId		= function() {
    return this._numInputVariableId;
};
Game_Terminal.prototype.numInputMaxDigits		= function() {
    return this._numInputMaxDigits;
};
Game_Terminal.prototype.itemChoiceVariableId	= function() {
    return this._itemChoiceVariableId;
};
Game_Terminal.prototype.itemChoiceItypeId		= function() {
    return this._itemChoiceItypeId;
};
Game_Terminal.prototype.scrollMode				= function() {
    return this._scrollMode;
};
Game_Terminal.prototype.scrollSpeed				= function() {
    return this._scrollSpeed;
};
Game_Terminal.prototype.scrollNoFast			= function() {
    return this._scrollNoFast;
};
Game_Terminal.prototype.add						= function(text) {
    this._texts.push(text);
};
Game_Terminal.prototype.setFaceImage			= function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};
Game_Terminal.prototype.setBackground			= function(background) {
    this._background = background;
};
Game_Terminal.prototype.setPositionType			= function(positionType) {
    this._positionType = positionType;
};
Game_Terminal.prototype.setChoices				= function(choices, defaultType, cancelType) {
    this._choices = choices;
    this._choiceDefaultType = defaultType;
    this._choiceCancelType = cancelType;
};
Game_Terminal.prototype.setChoiceBackground		= function(background) {
    this._choiceBackground = background;
};
Game_Terminal.prototype.setChoicePositionType	= function(positionType) {
    this._choicePositionType = positionType;
};
Game_Terminal.prototype.setNumberInput			= function(variableId, maxDigits) {
    this._numInputVariableId = variableId;
    this._numInputMaxDigits = maxDigits;
};
Game_Terminal.prototype.setItemChoice			= function(variableId, itemType) {
    this._itemChoiceVariableId = variableId;
    this._itemChoiceItypeId = itemType;
};
Game_Terminal.prototype.setScroll				= function(speed, noFast) {
    this._scrollMode = true;
    this._scrollSpeed = speed;
    this._scrollNoFast = noFast;
};
Game_Terminal.prototype.setChoiceCallback		= function(callback) {
    this._choiceCallback = callback;
};
Game_Terminal.prototype.onChoice				= function(n) {
    if (this._choiceCallback) {
        this._choiceCallback(n);
        this._choiceCallback = null;
    }
};
Game_Terminal.prototype.hasText					= function() {
    return this._texts.length > 0;
};
Game_Terminal.prototype.isChoice				= function() {
    return this._choices.length > 0;
};
Game_Terminal.prototype.isNumberInput			= function() {
    return this._numInputVariableId > 0;
};
Game_Terminal.prototype.isItemChoice			= function() {
    return this._itemChoiceVariableId > 0;
};
Game_Terminal.prototype.isBusy					= function() {
    return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice());
};
Game_Terminal.prototype.newPage					= function() {
    if (this._texts.length > 0) {
        this._texts[this._texts.length - 1] += '\f';
    }
};
Game_Terminal.prototype.allText					= function() {
    return this._texts.reduce(function(previousValue, currentValue) {
        return previousValue + '\n' + currentValue;
    });
};
Game_Terminal.prototype.specialTxt				= function(filename,obj) {
	var text = this.loadTerminalData(filename) + "";
	obj.setWaitMode('terminal');
}
Game_Terminal.prototype.loadTerminalData		= function(filename) {
	var xhr = new XMLHttpRequest();
	var url = 'data/terminal/' + filename + '.txt';
	xhr.open('GET', url);
	xhr.overrideMimeType('text/xml');
	xhr.onload = function() {
		if (xhr.status < 400 && xhr.readyState == 4) {
			$scTerminal.add(xhr.responseText);
		}
	};
	xhr.onerror = function() {
		DataManager._errorUrl = DataManager._errorUrl || url;
	};
	xhr.send();
};

//=============================================
function Window_Terminal() {
    this.initialize.apply(this, arguments);
}

Window_Terminal.prototype = Object.create(Window_Base.prototype);
Window_Terminal.prototype.constructor = Window_Terminal;
//================================= WindowBase
var _aliasWinProcessChara = Window_Base.prototype.processNormalCharacter;
Window_Terminal.prototype.processNormalCharacter		= function(textState) {
	var c = textState.text[textState.index++];
	this.playScreenSound(c, textState);
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x + this.hudX(), textState.y + this.hudY(), w * 2, textState.height);
    textState.x += w;
};
Window_Terminal.prototype.playScreenSound				= function(c, textState) {
	if(c != ""){
		if (!this._showFast && this._delayTime >= this._delaySe) {
			this.playTerminalCharaterSound(textState);
			this._delayTime = 0;
		}else 
			this._delayTime++;
	}
}
Window_Terminal.prototype.hudX							= function() {
		return 380;
}
Window_Terminal.prototype.hudY							= function() {
		return 150;
}
Window_Terminal.prototype.playTerminalCharaterSound		= function(textState) {
	var se = {};
	se.name = "Terminal_read_all";
	if(textState.y > 300)
		se.name = "Terminal_Hacking_" + Math.randomInt(1, 4);
	se.pan = 0;
	se.pitch = 100;
	se.volume = 90;
	AudioManager.playSe(se);
}
//============================================
Window_Terminal.prototype.initialize					= function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
	this._delaySe = 54;
	this._delayTime = this._delaySe;
    Window_Base.prototype.initialize.call(this, x,  0, width, height);
	this._isOkHud = false;
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
	this.drawTerminalImg("Terminal_1", 0, 0);
};
Window_Terminal.prototype.initMembers					= function() {
    this._background = 0;
    this._positionType = 2;
    this._waitCount = 0;
    this._faceBitmap = null;
    this._textState = null;
    this.clearFlags();
};
Window_Terminal.prototype.subWindows					= function() {
    return [this._choiceWindow,
            this._numberWindow, this._itemWindow];
};
Window_Terminal.prototype.createSubWindows				= function() {
    this._choiceWindow = new Window_TerminalChoiceList(this);
    this._numberWindow = new Window_TerminalNumberInput(this);
    this._itemWindow = new Window_TerminalEventItem(this);
};
Window_Terminal.prototype.windowWidth					= function() {
	return Graphics.boxWidth;
};
Window_Terminal.prototype.windowHeight					= function() {
    return Graphics.boxHeight;
};
Window_Terminal.prototype.clearFlags					= function() {
    this._showFast = false;
    this._lineShowFast = false;
    this._pauseSkip = false;
};
Window_Terminal.prototype.numVisibleRows				= function() {
    return 10;
};
Window_Terminal.prototype.update						= function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
	this.opacity = 0;
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};
Window_Terminal.prototype.updateMessage				= function() {
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};
Window_Terminal.prototype.checkToNotClose				= function() {
    if (this.isClosing() && this.isOpen()) {
        if (this.doesContinue()) {
            this.open();
        }
    }
};
Window_Terminal.prototype.canStart						= function() {
    return $scTerminal.hasText() && !$scTerminal.scrollMode();
};
Window_Terminal.prototype.startMessage					= function() {
	
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters($scTerminal.allText());
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
};
Window_Terminal.prototype.updatePlacement				= function() {
    this.y = 0;
};
Window_Terminal.prototype.updateBackground				= function() {
    this._background = $scTerminal.background();
    this.setBackgroundType(this._background);
};
Window_Terminal.prototype.drawTerminalImg				= function(name, x, y) {
	var bitmap = ImageManager.loadTerminal(name);
	this.contents.blt(bitmap, 12, 12, Graphics.boxWidth - 12, Graphics.boxHeight -12, 0, 0);
};
Window_Terminal.prototype.terminateMessage				= function() {
    this.close();
    $scTerminal.clear();
};
Window_Terminal.prototype.updateWait					= function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    } else {
        return false;
    }
};
Window_Terminal.prototype.updateLoading				= function() {
    if (this._faceBitmap) {
        if (ImageManager.isReady()) {
            this.drawMessageFace();
            this._faceBitmap = null;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
Window_Terminal.prototype.updateInput					= function() {
    if (this.isAnySubWindowActive()) {
        return true;
    }
    if (this.pause) {
        if (this.isTriggered()) {
            Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
        }
        return true;
    }
    return false;
};
Window_Terminal.prototype.isAnySubWindowActive			= function() {
    return (this._choiceWindow.active ||
            this._numberWindow.active ||
            this._itemWindow.active);
};
Window_Terminal.prototype.onEndOfText					= function() {
    if (!this.startInput()) {
        if (!this._pauseSkip) {
            this.startPause();
        } else {
            this.terminateMessage();
        }
    }
    this._textState = null;
};
Window_Terminal.prototype.startInput					= function() {
    if ($scTerminal.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if ($scTerminal.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($scTerminal.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else {
        return false;
    }
};
Window_Terminal.prototype.isTriggered					= function() {
    return (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
            TouchInput.isRepeated());
};
Window_Terminal.prototype.doesContinue					= function() {
    return ($scTerminal.hasText() && !$scTerminal.scrollMode() &&
            !this.areSettingsChanged());
};
Window_Terminal.prototype.areSettingsChanged			= function() {
    return (this._background !== $scTerminal.background() ||
            this._positionType !== $scTerminal.positionType());
};
Window_Terminal.prototype.updateShowFast				= function() {
    if (this.isTriggered()) {
        this._showFast = true;
    }
};
Window_Terminal.prototype.newPage						= function(textState) {
    this.contents.clear();
    this.resetFontSettings();
    this.clearFlags();
    this.loadMessageFace();
    textState.x = this.newLineX();
    textState.y = 0;
    textState.left = this.newLineX();
    textState.height = this.calcTextHeight(textState, false);
	this.drawTerminalImg("Terminal_1", 0, 0);
};
Window_Terminal.prototype.loadMessageFace				= function() {
    this._faceBitmap = ImageManager.loadFace($scTerminal.faceName());
};
Window_Terminal.prototype.drawMessageFace				= function() {
    this.drawFace($scTerminal.faceName(), $scTerminal.faceIndex(), 0, 0);
};
Window_Terminal.prototype.newLineX						= function() {
    return $scTerminal.faceName() === '' ? 0 : 168;
};
Window_Terminal.prototype.processNewLine				= function(textState) {
    this._lineShowFast = false;
    Window_Base.prototype.processNewLine.call(this, textState);
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};
Window_Terminal.prototype.processNewPage				= function(textState) {
    Window_Base.prototype.processNewPage.call(this, textState);
    if (textState.text[textState.index] === '\n') {
        textState.index++;
    }
    textState.y = this.contents.height;
    this.startPause();
};
Window_Terminal.prototype.isEndOfText					= function(textState) {
    return textState.index >= textState.text.length;
};
Window_Terminal.prototype.needsNewPage					= function(textState) {
    return (!this.isEndOfText(textState) &&
            textState.y + textState.height > 380);
};
Window_Terminal.prototype.processEscapeCharacter		= function(code, textState) {
    switch (code) {
    case '$':
        this._goldWindow.open();
        break;
    case '.':
        this.startWait(15);
        break;
    case '|':
        this.startWait(60);
        break;
    case '!':
        this.startPause();
        break;
    case '>':
        this._lineShowFast = true;
        break;
    case '<':
        this._lineShowFast = false;
        break;
    case '^':
        this._pauseSkip = true;
        break;
    default:
        Window_Base.prototype.processEscapeCharacter.call(this, code, textState);
        break;
    }
};
Window_Terminal.prototype.startWait						= function(count) {
    this._waitCount = count;
};
Window_Terminal.prototype.startPause					= function() {
    this.startWait(10);
    this.pause = true;
};



function Window_TerminalNumberInput() {
    this.initialize.apply(this, arguments);
}
Window_TerminalNumberInput.prototype = Object.create(Window_Selectable.prototype);
Window_TerminalNumberInput.prototype.constructor = Window_TerminalNumberInput;
Window_TerminalNumberInput.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Selectable.prototype.initialize.call(this, 0, 0, 0, 0);
    this._number = 0;
    this._maxDigits = 1;
    this.openness = 0;
    this.createButtons();
    this.deactivate();
};
Window_TerminalNumberInput.prototype.start = function() {
    this._maxDigits = $scTerminal.numInputMaxDigits();
    this._number = $gameVariables.value($scTerminal.numInputVariableId());
    this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
    this.updatePlacement();
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.createContents();
    this.refresh();
    this.open();
    this.activate();
    this.select(0);
};
Window_TerminalNumberInput.prototype.updatePlacement = function() {
    var messageY = this._messageWindow.y;
    var spacing = 8;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height - spacing;
    } else {
        this.y = messageY + this._messageWindow.height + spacing;
    }
};
Window_TerminalNumberInput.prototype.windowWidth = function() {
    return this.maxCols() * this.itemWidth() + this.padding * 2;
};
Window_TerminalNumberInput.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
Window_TerminalNumberInput.prototype.maxCols = function() {
    return this._maxDigits;
};
Window_TerminalNumberInput.prototype.maxItems = function() {
    return this._maxDigits;
};
Window_TerminalNumberInput.prototype.spacing = function() {
    return 0;
};
Window_TerminalNumberInput.prototype.itemWidth = function() {
    return 32;
};
Window_TerminalNumberInput.prototype.createButtons = function() {
    var bitmap = ImageManager.loadSystem('ButtonSet');
    var buttonWidth = 48;
    var buttonHeight = 48;
    this._buttons = [];
    for (var i = 0; i < 3; i++) {
        var button = new Sprite_Button();
        var x = buttonWidth * [1, 2, 4][i];
        var w = buttonWidth * (i === 2 ? 2 : 1);
        button.bitmap = bitmap;
        button.setColdFrame(x, 0, w, buttonHeight);
        button.setHotFrame(x, buttonHeight, w, buttonHeight);
        button.visible = false;
        this._buttons.push(button);
        this.addChild(button);
    }
    this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
    this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
    this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
};
Window_TerminalNumberInput.prototype.placeButtons = function() {
    var numButtons = this._buttons.length;
    var spacing = 16;
    var totalWidth = -spacing;
    for (var i = 0; i < numButtons; i++) {
        totalWidth += this._buttons[i].width + spacing;
    }
    var x = (this.width - totalWidth) / 2;
    for (var j = 0; j < numButtons; j++) {
        var button = this._buttons[j];
        button.x = x;
        button.y = this.buttonY();
        x += button.width + spacing;
    }
};
Window_TerminalNumberInput.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this.showButtons();
    } else {
        this.hideButtons();
    }
};
Window_TerminalNumberInput.prototype.showButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = true;
    }
};
Window_TerminalNumberInput.prototype.hideButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = false;
    }
};
Window_TerminalNumberInput.prototype.buttonY = function() {
    var spacing = 8;
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        return 0 - this._buttons[0].height - spacing;
    } else {
        return this.height + spacing;
    }
};
Window_TerminalNumberInput.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processDigitChange();
};
Window_TerminalNumberInput.prototype.processDigitChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('up')) {
            this.changeDigit(true);
        } else if (Input.isRepeated('down')) {
            this.changeDigit(false);
        }
    }
};
Window_TerminalNumberInput.prototype.changeDigit = function(up) {
    var index = this.index();
    var place = Math.pow(10, this._maxDigits - 1 - index);
    var n = Math.floor(this._number / place) % 10;
    this._number -= n * place;
    if (up) {
        n = (n + 1) % 10;
    } else {
        n = (n + 9) % 10;
    }
    this._number += n * place;
    this.refresh();
    SoundManager.playCursor();
};
Window_TerminalNumberInput.prototype.isTouchOkEnabled = function() {
    return false;
};
Window_TerminalNumberInput.prototype.isOkEnabled = function() {
    return true;
};
Window_TerminalNumberInput.prototype.isCancelEnabled = function() {
    return false;
};
Window_TerminalNumberInput.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};
Window_TerminalNumberInput.prototype.processOk = function() {
    SoundManager.playOk();
    $gameVariables.setValue($scTerminal.numInputVariableId(), this._number);
    this._messageWindow.terminateMessage();
    this.updateInputData();
    this.deactivate();
    this.close();
};
Window_TerminalNumberInput.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var align = 'center';
    var s = this._number.padZero(this._maxDigits);
    var c = s.slice(index, index + 1);
    this.resetTextColor();
    this.drawText(c, rect.x, rect.y, rect.width, align);
};
Window_TerminalNumberInput.prototype.onButtonUp = function() {
    this.changeDigit(true);
};
Window_TerminalNumberInput.prototype.onButtonDown = function() {
    this.changeDigit(false);
};
Window_TerminalNumberInput.prototype.onButtonOk = function() {
    this.processOk();
    this.hideButtons();
};

function Window_TerminalChoiceList() {
    this.initialize.apply(this, arguments);
}
Window_TerminalChoiceList.prototype = Object.create(Window_HorzCommand.prototype);
Window_TerminalChoiceList.prototype.constructor = Window_TerminalChoiceList;
Window_TerminalChoiceList.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._background = 0;
};
Window_TerminalChoiceList.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.refresh();
    this.selectDefault();
    this.open();
    this.activate();
};
Window_TerminalChoiceList.prototype.selectDefault = function() {
    this.select($scTerminal.choiceDefaultType());
};
Window_TerminalChoiceList.prototype.updatePlacement = function() {
    var positionType = $scTerminal.choicePositionType();
    var messageY = this._messageWindow.y;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
    case 0:
        this.x = 0;
        break;
    case 1:
        this.x = (Graphics.boxWidth - this.width) / 2;
        break;
    case 2:
        this.x = Graphics.boxWidth - this.width;
        break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};
Window_TerminalChoiceList.prototype.updateBackground = function() {
    this._background = $scTerminal.choiceBackground();
    this.setBackgroundType(this._background);
};
Window_TerminalChoiceList.prototype.windowWidth = function() {
    var width = this.maxChoiceWidth() + this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
};
Window_TerminalChoiceList.prototype.numVisibleRows = function() {
    var messageY = this._messageWindow.y;
    var messageHeight = this._messageWindow.height;
    var centerY = Graphics.boxHeight / 2;
    var choices = $scTerminal.choices();
    var numLines = choices.length;
    var maxLines = 8;
    if (messageY < centerY && messageY + messageHeight > centerY) {
        maxLines = 4;
    }
    if (numLines > maxLines) {
        numLines = maxLines;
    }
    return numLines;
};
Window_TerminalChoiceList.prototype.maxChoiceWidth = function() {
    var maxWidth = 96;
    var choices = $scTerminal.choices();
    for (var i = 0; i < choices.length; i++) {
        var choiceWidth = this.textWidthEx(choices[i]) + this.textPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};
Window_TerminalChoiceList.prototype.textWidthEx = function(text) {
    return this.drawTextEx(text, 0, this.contents.height);
};
Window_TerminalChoiceList.prototype.contentsHeight = function() {
    return this.maxItems() * this.itemHeight();
};
Window_TerminalChoiceList.prototype.makeCommandList = function() {
    var choices = $scTerminal.choices();
    for (var i = 0; i < choices.length; i++) {
        this.addCommand(choices[i], 'choice');
    }
};
Window_TerminalChoiceList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    this.drawTextEx(this.commandName(index), rect.x, rect.y);
};
Window_TerminalChoiceList.prototype.isCancelEnabled = function() {
    return $scTerminal.choiceCancelType() !== -1;
};
Window_TerminalChoiceList.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};
Window_TerminalChoiceList.prototype.callOkHandler = function() {
    $scTerminal.onChoice(this.index());
    this._messageWindow.terminateMessage();
    this.close();
};
Window_TerminalChoiceList.prototype.callCancelHandler = function() {
    $scTerminal.onChoice($scTerminal.choiceCancelType());
    this._messageWindow.terminateMessage();
    this.close();
};



function Window_TerminalEventItem() {
    this.initialize.apply(this, arguments);
}
Window_TerminalEventItem.prototype = Object.create(Window_ItemList.prototype);
Window_TerminalEventItem.prototype.constructor = Window_TerminalEventItem;
Window_TerminalEventItem.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    var width = Graphics.boxWidth;
    var height = this.windowHeight();
    Window_ItemList.prototype.initialize.call(this, 0, 0, width, height);
    this.openness = 0;
    this.deactivate();
    this.setHandler('ok',     this.onOk.bind(this));
    this.setHandler('cancel', this.onCancel.bind(this));
};
Window_TerminalEventItem.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
Window_TerminalEventItem.prototype.numVisibleRows = function() {
    return 4;
};
Window_TerminalEventItem.prototype.start = function() {
    this.refresh();
    this.updatePlacement();
    this.select(0);
    this.open();
    this.activate();
};
Window_TerminalEventItem.prototype.updatePlacement = function() {
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        this.y = 0;
    } else {
        this.y = Graphics.boxHeight - this.height;
    }
};
Window_TerminalEventItem.prototype.includes = function(item) {
    var itypeId = $scTerminal.itemChoiceItypeId();
    return DataManager.isItem(item) && item.itypeId === itypeId;
};
Window_TerminalEventItem.prototype.isEnabled = function(item) {
    return true;
};
Window_TerminalEventItem.prototype.onOk = function() {
    var item = this.item();
    var itemId = item ? item.id : 0;
    $gameVariables.setValue($scTerminal.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};
Window_TerminalEventItem.prototype.onCancel = function() {
    $gameVariables.setValue($scTerminal.itemChoiceVariableId(), 0);
    this._messageWindow.terminateMessage();
    this.close();
};
