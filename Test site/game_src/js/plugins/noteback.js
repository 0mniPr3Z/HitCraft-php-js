//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.
//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.
Game_Exp.prototype =  new Object();

Game_Exp.prototype.constructor = function(){
	this.initialize.call(this);
}

Game_Exp.prototype.initialize = function (){
	this._exp = 0;
	this._lvl = 0;
	this._rate = this.getRate();
	this.refresh();
}

Game_Exp.prototype.refresh = function(){

}

Game_Exp.prototype.gainXp = function(){
	
}




define properties 
strength
	real = function()
	buff = [{BUFF OBJ},...]
	exp = {EXP OBJ}

perception
endurance

Game_Battler.prototype.(){
	return this._hp;
}
//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.
//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.