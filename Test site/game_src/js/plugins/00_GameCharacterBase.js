$scActors = [null,
	{
		"quests" : []
	}
];
Game_CharacterBase.prototype.shiftY = function() {
    return this.isObjectCharacter() ? 0 : 20;
};
