Window_Base.prototype.drawTextExTest 				= function(text, x, y) {
	Galv.Mstyle.testActive = false;
    if (text) {
		Galv.Mstyle.testActive = true;
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
		Galv.Mstyle.testActive = false;
        return textState.x - x;
    } else {
        return 0;
    }
};