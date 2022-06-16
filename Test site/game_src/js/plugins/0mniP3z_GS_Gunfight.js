
useStrict{
var GSFight = GSFight || {};

$dataArmes = $dataArmes || [
	{
		null,
		null,
		null,
		null,
		{
			"nom":"Pétoire";
			"chbrMax":1;
			"munitMax":30;
			"tpsRech":15
		},
		{
			"nom":"Revolver";
			"chbrMax":6;
			"munitMax":6;
			"tpsRech":48
		},
		{
			"nom":"Pistolet";
			"chbrMax":1;
			"munitMax":12;
			"tpsRech":80
		},
		{
			"nom":"Pistolet Automatique";
			"chbrMax":1;
			"munitMax":18;
			"tpsRech":40
		}
	}
];

GSFight.Rech = function(){
	var _arme = $gameVariable.value(101);
	var _chbrMax = $dataArmes[_arme].chbrMax;
	var _munitMax = $dataArmes[_arme].munitMax;
	var _tpsRech = $dataArmes[_arme].tpsRech;
	var _chbr = $gameVariables.value(102);
	var _munit = $gameVariables.value(103);
	var _pack = $gameVariables.value(104);
	if(_chbr == 0){
		if(_munit >0){
			for(var i=0; i<_chrMax; i++){
				_munit--;
				_chbr++;
				$gameVariables.setValue(102,_chbr);
				$gameVariables.setValue(103,_munit);
				//this.attd(_tpsRech);
				if(_munit<=0)i=_chbrMax;
			}
		}/*else if(_pack>0){
			_pack-=1;
			_munit = _munitMax;
			this.recharge();
		}else{
			SoundManager.playOutOfAmmo();
		};
		var _counter= 0;
		for(var i=0; i< _tpsRech; i++){
			_counter++;
		};*/
	};
	
};

SoundManager.playRech=function(se){
	var _SE = {};
	_SE.name = se;
	_SE.volume= 90;
    _SE.pitch= 0;
    _SE.pan = 0;
	AudioManager.playSE(_SE);
};