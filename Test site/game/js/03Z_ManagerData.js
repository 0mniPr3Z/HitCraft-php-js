//=============================================================================
// rpg_managers.js v1.4.0
//=============================================================================
//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.
function DataManager() {
	throw new Error('This is a static class');
}
DataManager._databaseFiles		= [
	{ name: '$dataActors',			src: 'Actors.php'}
];
DataManager._errorUrl       	= null;
DataManager.loadPlayerData		= function() {
	return false;
}
DataManager.loadDatabase		= function() {
	for (var i = 0; i < this._databaseFiles.length; i++) {
		var name = this._databaseFiles[i].name;
		var src = this._databaseFiles[i].src;
		this.loadDataFile(name, src);
	}
}
DataManager.loadDataFile		= function(name, src) {
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	xhr.open('GET', url);
	xhr.overrideMimeType('application/json');
	xhr.onload = function() {
		if (xhr.status < 400) {
			window[name] = JSON.parse(xhr.responseText);
			DataManager.onLoad(window[name]);
		}
	};
	xhr.onerror = function() {
		DataManager._errorUrl = DataManager._errorUrl || url;
	};
	window[name] = null;
	xhr.send();
}
DataManager.onLoad				= function(object) {
	var array;
	if(object === $dataMap){
		this.extractMetadata(object);
		array = object.events;
	}else
		array = object;
	if(Array.isArray(array)){
		for(var i = 0; i < array.length; i++){
			var data = array[i];
			if(data && data.note !== undefined)
				this.extractMetadata(data);
		}
	}
}
DataManager.extractMetadata = function(data) {
	var re = /<([^<>:]+)(:?)([^>]*)>/g;
	data.meta = {};
	for(;;){
		var match = re.exec(data.note);
		if(match){
			if(match[2] === ':')
				data.meta[match[1]] = match[3];
			else
				data.meta[match[1]] = true;
		}else
			break;
	}
}
DataManager.isDatabaseLoaded = function() {
	//this.checkError();
	for (var i = 0; i < this._databaseFiles.length; i++) {
		if (!window[this._databaseFiles[i].name]) {
			return false;
		}
	}
	return true;
}