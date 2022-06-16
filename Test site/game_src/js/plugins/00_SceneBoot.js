



Galv.Mstyle.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
Scene_Boot.loadSystemImages = function() {
	Galv.Mstyle.Scene_Boot_loadSystemImages.call(this);
	ImageManager.loadSystem("Window_0");
	ImageManager.loadSystem("Window_1");
	ImageManager.loadSystem("Window_2");
	ImageManager.loadSystem("Window_3");
	ImageManager.loadSystem("WindowArr_0");
	ImageManager.loadSystem("WindowArr_1");
	ImageManager.loadSystem("WindowArr_2");
};