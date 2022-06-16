// * Settings
var _aliasSTC										= _aliasSTC || {};
_aliasSTC.title_sprite 								= false;
_aliasSTC.title_x 									= 0;
_aliasSTC.title_y 									= 0;
_aliasSTC.title_cursorVisible 						= true;
_aliasSTC.title_cursorSlide							= true;
_aliasSTC.title_cursorX 							= 232 - 64;
_aliasSTC.title_cursorY 							= 33 - 64;	
_aliasSTC.title_com_pos 							= [];
_aliasSTC.title_com_pos[0] 							= "222, 583";
_aliasSTC.title_com_pos[1] 							= "528, 584";
_aliasSTC.title_com_pos[2] 							= "810, 583";
_aliasSTC.title_com_pos[3] 							= "1140, 655";
for(i = 4; i < 10; i++){
	_aliasSTC.title_com_pos[i] 						= null;
}

_aliasSTC._winTitl_updatPlace 						= Scene_Title.prototype.updatePlacement
_aliasSTC._scenTitl_creat 							= Scene_Title.prototype.create;
_aliasSTC._scenTitl_updat							= Scene_Title.prototype.update;
_aliasSTC._scenMenuBase_updat						= Scene_MenuBase.prototype.update;

document.addEventListener('mousemove', getMousePosition);
function getMousePosition(e){
	_aliasSTC.xMouse = Graphics.pageToCanvasX(e.pageX);;
	_aliasSTC.yMouse = Graphics.pageToCanvasX(e.pageY);;
}
// WINDOW TITLE COMMAND ==============================================================================================
Window_TitleCommand.prototype.updatePlacement = function() {
   this.x = -Graphics.boxWidth;
   this.y = -Graphics.boxheight;
   this.visible = false;
};

/*Window_TitleCommand.prototype.cursorLeft = function(wrap) {
    this.cursorUp(wrap);
};
Window_TitleCommand.prototype.cursorRight = function(wrap) {
    this.cursorDown(wrap);
};*/

// WINDOW GAME INFOS =================================================================================================
function Window_TitleGameInfos() {
    this.initialize.apply(this, arguments);
}
Window_TitleGameInfos.prototype = Object.create(Window_Base.prototype);
Window_TitleGameInfos.prototype.constructor = Window_TitleGameInfos;
Window_TitleGameInfos.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = 72;
    Window_Base.prototype.initialize.call(this, 0, 664, width, height);
    this._text = '';
	this.refresh();
};
Window_TitleGameInfos.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};
Window_TitleGameInfos.prototype.clear = function() {
    this.setText('');
};
Window_TitleGameInfos.prototype.refresh = function() {
    this.contents.clear();
	this.updateTextGameInfos();
	this.changeTextColor(this.gaugeBackColor());
	this.contents.padding = 1;
	this.opacity = 0;
	this.contents.paintOpacity = 200;
	this.contents.outlineWidth = 0;
	this.contents.fontSize = 14;
	
    this.drawText(this._text, 0, 6);
};
Window_TitleGameInfos.prototype.textPadding = function(){
	return 0;
};
Window_TitleGameInfos.prototype.updateTextGameInfos = function() {
	var _rmVer = Utils.RPGMAKER_VERSION;
	var _title = $dataSystem.gameTitle;
	var _local = $dataSystem.locale;
	var _gameVer = $dataSystem.versionId;
	this.setText(_title + " ver."+ _local.substr(0,2).toUpperCase() + ".1." + _gameVer + " RMMV Ver." + _rmVer);
};

// SCENE TITLE =======================================================================================================
// Getters
Scene_Title.prototype.comSprite								= function() {
    return this._com_sprites[this._commandWindow._index];
};
Scene_Title.prototype.isAtPictureCom						= function(index) {
	 if (TouchInput.x < this._com_pictures_data[index][0]) { return false};
	 if (TouchInput.x > this._com_pictures_data[index][0] + this._com_pictures_data[index][1]) { return false};
	 if (TouchInput.y < this._com_pictures_data[index][2]) { return false};
	 if (TouchInput.y > this._com_pictures_data[index][2] + this._com_pictures_data[index][3]) { return false};
	 return true;	 
};
Scene_Title.prototype.isOnPictureCom						= function(index) {
	 if (_aliasSTC.xMouse < this._com_pictures_data[index][0])
		return false;
	if (_aliasSTC.xMouse > this._com_pictures_data[index][0] + this._com_pictures_data[index][1])
		return false;
	 if (_aliasSTC.yMouse < this._com_pictures_data[index][2])
		 return false;
	 if (_aliasSTC.yMouse > this._com_pictures_data[index][2] + this._com_pictures_data[index][3])
		 return false;
	 return true;	 
};
// Setters
Scene_Title.prototype.set_tcp								= function(value) {
	if (!value) {return null};
	var s = value.split(',');
	if (!s[0] || !s[1]) {return null};
	return  [Number(s[0]),Number(s[1])];
};
// * Create
Scene_Title.prototype.create								= function() {
    _aliasSTC._scenTitl_creat.call(this);
	this.createTitleGameInfosWindows();
	this.create_picture_commands();
	this.createCursorCommand();
	this._comSave = this._commandWindow.isContinueEnabled();
};
Scene_Title.prototype.createTitleGameInfosWindows			= function() {
	this._gameInfosWindow = new Window_TitleGameInfos();
    this.addChild(this._gameInfosWindow);
};
Scene_Title.prototype.createCursorCommand					= function() {
	this._cursorSlide = [0,0,0,false];
	this._cursorSlide[3] = true;
    this._cursor = new Sprite(ImageManager.loadTitle2("Cursor"));
	this._cursor.anchor.x = 0.5;
	this._cursor.anchor.y = 0.5;
	this._cursor.opacity = 0;
	this.addChild(this._cursor);
};
Scene_Title.prototype.create_picture_commands				= function() {
	this._com_position = [];
	for (var i = 0; i < 10; i++) {
	    this._com_position[i] = this.set_tcp(_aliasSTC.title_com_pos[i]);
    };	
	var _com_index_old = -2;
	this._csel = false;
	this._com_pictures = [];
	this._com_sprites = [];	
	this._com_pictures_data = [];
	for (i = 0; i < this._commandWindow._list.length; i++){
    	this._com_pictures.push(ImageManager.loadTitle2("Command_" + i));
		this._com_sprites.push(new Sprite(this._com_pictures[i]));
	    this.addChild(this._com_sprites[i]);	
	};
};
// * Update
Scene_Title.prototype.update = function() {
    _aliasSTC._scenTitl_updat.call(this);
	this.update_picture_commands();
	this._gameInfosWindow.refresh();
};
Scene_Title.prototype.updateCursor = function() {
	this.updateCursorSlide();
	this._cursor.opacity += 10;
	var nx = this.comSprite().x - (this._cursor.width / 2) + _aliasSTC.title_cursorX + this._cursorSlide[0];
	var ny = this.comSprite().y + (this._cursor.height / 2) + _aliasSTC.title_cursorY;
	this._cursor.x = this.cursorMoveto(this._cursor.x, nx, 20);
	this._cursor.y = this.cursorMoveto(this._cursor.y, ny, 20);
};
Scene_Title.prototype.update_picture_commands = function() {
	if (this._com_index_old != this._commandWindow._index) { this.refresh_picture_command()};
	if (TouchInput.isTriggered()) {
		for (i = 0; i < this._com_sprites.length; i++){
			if (this.isAtPictureCom(i) && !this._csel ) {				
				this._commandWindow._index = i;	 this._commandWindow.processOk();
	            if (this._commandWindow.isCommandEnabled(i)) {this._csel = true};
		   };		
		};
	}
	for (i = 0; i < this._com_sprites.length; i++){
		if (!this._csel && this.isOnPictureCom(i)) {				
			this._commandWindow._index = i;
		}		
	};
	this._commandWindow.processCursorMove();
	if (this._cursor) {this.updateCursor()};
};
Scene_Title.prototype.updateCursorSlide = function() {
     this._cursorSlide[1] ++
	 if (this._cursorSlide[1] < 3) {return};
	 this._cursorSlide[1] = 0
	 this._cursorSlide[2] ++
	 if (this._cursorSlide[2] < 15) {
		 this._cursorSlide[0] ++;
	 } else if (this._cursorSlide[2] < 30) {
		 this._cursorSlide[0] --;
	 } else {
		 this._cursorSlide[0] = 0;
		 this._cursorSlide[2] = 0;
	 };
};
// * Sprite Move To
Scene_Title.prototype.cursorMoveto = function(value,real_value,speed) {
	if (value == real_value) {return value};
	var dnspeed = 5 + (Math.abs(value - real_value) / speed);
	if (value > real_value) {value -= dnspeed;
	    if (value < real_value) {value = real_value};}
    else if (value < real_value) {value  += dnspeed;
    	if (value  > real_value) {value  = real_value};		
    };
	return Math.floor(value);
};
// * Refresh
Scene_Title.prototype.refresh_picture_command = function() {
	this._com_index_old = this._commandWindow._index;
	for (i = 0; i < this._com_sprites.length; i++){
		if (this._commandWindow._index != i) {
        var ch = this._com_pictures[i].height / 2;
		}
		else {
		var ch = 0;
      	}
		this.cpsx = [this._com_position[i][0],this._com_position[i][1]];
		if (this._commandWindow._list[i].symbol === 'continue' && !this._comSave) {this._com_sprites[i].opacity = 160};
		this._com_sprites[i].setFrame(0, ch, this._com_pictures[i].width, this._com_pictures[i].height / 2);
		this._com_sprites[i].x = this.cpsx[0];
		this._com_sprites[i].y = this.cpsx[1];
		this._com_pictures_data[i] = [this._com_sprites[i].x,this._com_pictures[i].width ,this._com_sprites[i].y,this._com_pictures[i].height / 2 ];
	}; 
};
// * Create Foreground
var _mog_titlecom_createForeground = Scene_Title.prototype.createForeground;
Scene_Title.prototype.createForeground = function() {
	_mog_titlecom_createForeground.call(this);
	this.createTitleSprite();
};
// * Create Title Sprite
Scene_Title.prototype.createTitleSprite = function() {
    let bitmap = ImageManager.loadTitle2("logo");
	this._gameTitleSprite = new Sprite(bitmap);
	this._gameTitleSprite.x = Graphics.width / 2;
    this._gameTitleSprite.y = Math.floor(Graphics.height / 4);
	this._gameTitleSprite.anchor.x = 0.5;
    this.addChild(this._gameTitleSprite);
};
// * Create Command Window
Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
	this._commandWindow.setHandler('credits',  this.commandCredits.bind(this));
    this.addWindow(this._commandWindow);
};
Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.options,   'options');
	this.addCommand(TextManager.options,   'credits');
};
// * Create Command Window
Scene_Title.prototype.commandNewGameZombie = function() {
	DataManager.loadGame(0);
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};
Scene_Title.prototype.commandCredits = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Credits);
};

// SCENE MENU BASE  ======================================================================================================
Scene_MenuBase.prototype.create_mparticles = function() {	
    this._self_par = false;
	SceneManager._mpart = true;
   	this._sprite_particles = [];
	this._sprite_particles_data = [];
	
	this._nw = [0,0];
	this._nw[1] = Math.abs(this._nw[0]);
	
    for (i = 0; i < 10; i++) {
	
		this._sprite_particles.push(
			new Sprite(
				ImageManager.loadTitle2(
					this.set_particle_img()
				)
			)
		);
		
		this.addChild(this._sprite_particles[i]);
		
		
		this._sprite_particles_data[i] = [];
		this.reset_particles(i);
		this._sprite_particles[i].x = Math.randomInt(Graphics.boxWidth);
		this._sprite_particles[i].y = Math.randomInt(Graphics.boxHeight);
		this._sprite_particles[i].opacity = 0;
		this._sprite_particles[i].blendMode = 1;
    };	
};

Scene_MenuBase.prototype.reset_particles = function(i) {	
	this._sprite_particles_data[i][0] = ((Math.random() * 2) + 0.4) * _aliasSTC.mpart_ox
	this._sprite_particles_data[i][1] = ((Math.random() * 2) + 0.4) * _aliasSTC.mpart_oy
	this._sprite_particles_data[i][2] = ((Math.random() * 1)) * 0.01;
	this._sprite_particles[i].opacity = 0;
	this._sprite_particles[i].x = this._nw[0] + Math.randomInt(Graphics.boxWidth);
	var pz = ((Math.random() * 0.5) * 1);
	this._sprite_particles[i].scale = new PIXI.Point(0.5 + Number(pz), 0.5 + Number(pz));
	this._sprite_particles[i].y = Graphics.boxHeight + this._sprite_particles[i].height * 3;
	if (this._sprite_particles_data[i][0] == 0 && this._sprite_particles_data[i][1] == 0)
       this._sprite_particles[i].x = -Graphics.width;
};
Scene_MenuBase.prototype.set_particle_img = function() {
	if (this._self_par && SceneManager._scene) {return SceneManager._scene.constructor.name + "_par"}
	return "particle";
};
Scene_MenuBase.prototype.update_particles = function() {
   for (var i = 0; i < this._sprite_particles.length; i++) {
	   this._sprite_particles[i].x += this._sprite_particles_data[i][0];
		this._sprite_particles[i].y += this._sprite_particles_data[i][1];
		this._sprite_particles[i].opacity += 4;
		this._sprite_particles[i].rotation += this._sprite_particles_data[i][2];
    	if (this.need_reset_particles(i)) { this.reset_particles(i);};
	};
};
Scene_MenuBase.prototype.need_reset_particles = function(i) {
	if (this._sprite_particles[i].x < -this._nw[1] - this._sprite_particles[i].width * 3)
		return true;
	if (this._sprite_particles[i].x > this._nw[1] + Graphics.boxWidth + this._sprite_particles[i].width * 3)
		return true;
	if (this._sprite_particles[i].y < - this._sprite_particles[i].height * 3)
		return true;
	if (this._sprite_particles[i].y > Graphics.boxHeight + this._sprite_particles[i].height * 3)
		return true;
	return false;
};
Scene_MenuBase.prototype.update = function() {
	_aliasSTC._scenMenuBase_updat.call(this);
	this.update_particles();	
};

// SCENE CREDITS ======================================================================================================
function Scene_Credits() {
    this.initialize.apply(this, arguments);
}
Scene_Credits.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Credits.prototype.constructor = Scene_Credits;
// * initialize
Scene_Credits.prototype.initialize = function() {
	this._creditsSpeed = 10;
    Scene_MenuBase.prototype.initialize.call(this);
};
// * Create Mbackground
Scene_Credits.prototype.create_mbackground = function() {
};
// * create
Scene_Credits.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createPictureCredit();
};
Scene_Credits.prototype.createPictureCredit = function() {
	
	this._creditsSpeed = Math.min(Math.max(_aliasSTC.credits_scrollSpeed,0.5),10);
    this.pictureCredit = [];
	this.pictureCredit[0] = new Sprite(ImageManager.loadSystem("CreditsA"));
	this.addChild(this.pictureCredit[0]);
	
	this.create_mparticles();
	this.pictureCredit[1] = new Sprite(ImageManager.loadSystem("CreditsB"));
	this.pictureCredit[1].y = Graphics.boxHeight / 2;
	this.pictureCredit[1].opacity = 0;	
	this.addChild(this.pictureCredit[1]);
};
// * Press Any Key
Scene_Credits.prototype.pressAnyKey = function() {
    if (TouchInput.isTriggered()) {return true};
	if (TouchInput.isCancelled()) {return true};
	if (Input.isTriggered("ok")) {return true};
	if (Input.isTriggered("cancel")) {return true};
    return false;
};
// * Update
Scene_Credits.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.pictureCredit[1].opacity += 1;
	this.pictureCredit[1].y -= this._creditsSpeed;
	
	if (this.pressAnyKey()){
		SoundManager.playCursor();
		SceneManager.pop()
	};	 
	if (this.pictureCredit[1].y < -this.pictureCredit[1].height)
		SceneManager.pop();
	
	if (this._backgroundSprite)
		this._backgroundSprite.visible = false;
};