//	SCENE PHONE
function Scene_Phone(){
    this.initialize.apply(this, arguments);
};
Scene_Phone.prototype = Object.create(Scene_Base.prototype);
Scene_Phone.prototype.constructor = Scene_Phone;
Scene_Phone.prototype.initialize = function() {
	Scene_Base.prototype.initialize.call(this);
	this._index = [0,0,0,0];//profondeur,index,compteur,action
	this.createWindowLayer();
	this.createPhoneHud();
	this._phone.refresh();
};
Scene_Phone.prototype.createPhoneHud = function() {
	this._phone = new GS_phoneHud();
	//this._phone.opacity = 0;
	this.addWindow(this._phone);
};
Scene_Phone.prototype.update= function(){
	Scene_Base.prototype.update.call(this);
	if(this._index[2]>=8){
		this.refresh();
		this._index[2] == 0;
	} else {
		this._index[2] ++;
	};
};
Scene_Phone.prototype.refresh= function(){
	this._phone.refresh();
	if(this._phone._index[0]<0){
		this.popScene.bind(this);
	};
};
//	WINDOWS PHONE
function GS_phoneHud(){
    this.initialize.apply(this, arguments);
};
GS_phoneHud.prototype = Object.create(Window_Base.prototype);
GS_phoneHud.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 510, 7, 340, 650);
	this._index = [0,0,0,0];
	this.refresh();
};
GS_phoneHud.prototype.refresh = function() {
	Window_Base.prototype.update.call(this);
	if(this._index[3]<=0){
		if($gameSwitches.value(13)){
			//this.contents.clear();
			this.visible = $gameSwitches.value(13);
			this.contents.fontSize = 14;
			this.padding = 0;
			//this.opacity = 0;
			this.refreshHud();
		}else{
			this.contents.clear();
			this._index = [0,0,0,0];
		};
		this._index[3] = 3;
	}else{
		this._index[3]--;
	};
	this.process_Input();
};
GS_phoneHud.prototype.refreshHud = function() {
	this.drawGSLayer("phone");
	this.drawTime();
	this.drawContenu();	
};
GS_phoneHud.prototype.process_Input = function() {
    if (this._index[2]>24) {
        var lastIndex = this._index[1];
		this.cursorDown(Input.keyPressed(98));//2num
		this.cursorLeft(Input.keyPressed(100));//4num
		this.cursorRight(Input.keyPressed(102));//6num
		this.cursorUp(Input.keyPressed(104));//8num
		this.processCancel(Input.keyPressed(96));//0num
		this.processOk(Input.keyPressed(13));//home
        if (this._index[1] !== lastIndex) {
            SoundManager.playCursor();
        };
		this.refreshHud();
		this._index[2]=0;
    }else{
		this._index[2]++;
	}
	
};
GS_phoneHud.prototype.processWheel = function() {
    if (this.isOpenAndActive()) {
        var threshold = 20;
        if (TouchInput.wheelY >= threshold) {
            this.cursorLeft(true);
        }
        if (TouchInput.wheelY <= -threshold) {
            this.cursorRight(true);
        }
    }
};
GS_phoneHud.prototype.drawTime = function() {
	this.contents.textColor = this.textColor(0);
	
	var _m = $gameVariables.value(182);
	var _h = $gameVariables.value(183);
	
	if(_h<10 && _m<10){
		_heure = "0"+_h+":0"+_m;
	}else if(_h>=10 && _m>=10){
		_heure = _h+":"+_m;
	}else if(_h>=10){
		_heure = _h+":0"+_m;
	}else{
		_heure = "0"+_h+":"+_m;
	};
	this.drawText(_heure, 36, 12, 60, 20, 'center');
};
GS_phoneHud.prototype.drawContenu = function() {
	
	//menus
	switch(this._index[0]){
		case 0:
			this.drawMainMenuTouches();
		break;
		case 1:
			this.drawMenu();
		break;	
		default:
		break;
	};
	$gameSwitches.setValue(14,true);

	
};
GS_phoneHud.prototype.drawMenu=function() {
	switch(this._index[1]){
		case 0:
			this.drawMessages();
		break;
		case 1:
			this.drawCarte();
		break;
		case 2:
			this.drawVie();
		break;
		case 3:
			this.drawNews();
		break;
		case 4:
			this.drawGestion();
		break;
		case 5:
			this.drawSauver();
		break;
		case 6:
			this.drawMusique();
		break;
		case 7:
			this.drawParametres();
		break;
		default:
		break;
	};
};
GS_phoneHud.prototype.drawMainMenuTouches=function() {
	var _x = 44;
	var _y =98;
	var bitmap = ImageManager.loadGSHud("phone_menu");
	this.contents.blt(bitmap, 0, 0, bitmap._canvas.width, bitmap._canvas.height, _x, _y);
	var _ligne=Math.floor(this._index[1]*0,48);
	var _colonne = this._index[1] - (_ligne * 2 );
	var _wBouton = bitmap._canvas.width/2;
	var _hBouton = bitmap._canvas.height/4;
	var _xBouton =_colonne*_wBouton;
	var _yBouton = _ligne*_hBouton;
	this.contents.blt(bitmap, _xBouton, _yBouton, _wBouton,_hBouton, _x, _y);
	
};
GS_phoneHud.prototype.cursorDown = function(valid) {
	if(valid){
		var index = this._index[1];
		if(index >=7){
			index -=6;
		}else{
			index+=2;
		};
	};
};
GS_phoneHud.prototype.cursorUp = function(valid) {
	if(valid){
		var index = this._index[1];
		if(this._index[1] <=1){
			this._index[1] +=6;
		}else{
			this._index[1]-=2;
		};
	};
};
GS_phoneHud.prototype.cursorLeft = function(valid) {
	if(valid){
		if(this._index[1] <=0){
			this._index[1] =7;
		}else{
			this._index[1]--;
		};
	};
};
GS_phoneHud.prototype.cursorRight = function(valid) {
	if(valid){
		if(this._index[1] >=7){
			this._index[1] =0;
		}else{
			this._index[1]++;
		};
	};
};
GS_phoneHud.prototype.processOk = function(valid) {
    if(valid){
		if(this._index[0] <2){
			this._index[1]=0;
			this._index[0]++;
			SoundManager.playOk();
		}else{
			SoundManager.playBuzzer();
		};
	};
};
GS_phoneHud.prototype.processCancel = function(valid) {
    if(valid){
		this._index[1]=0;
		this._index[0]--;
	};
};