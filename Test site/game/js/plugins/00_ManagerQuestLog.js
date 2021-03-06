
/*$gameScreen.showPicture(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode);
	$gameScreen.movePicture(pictureId, origin, x, y, scaleX, scaleY,opacity, blendMode, frames);
	
	var realPictureId = this.realPictureId(pictureId);
	$gameScreen._pictures[realPictureId]._name = "Image differente"
*/


$scQuests = [
	{	"name" : "QUETE DE TESTING",
		"isStart":false,
		"success":false,
		"terminate":false,
		"steps":[
			{	"name":"Quete Test 1",
				"imgId":1,
				"terminate":false,
				"fail":false,
				"success":false,
				"updated":false,
				"failCondition":"false",
				"successCondition":"false",
				"successSe":{"name":"Quest_Surprise_PopUp","pan":0,"pitch":120,"volume":90},
				"mandatory":"optionnal"
			},
			{	"name":"Quete Test 2",
				"imgId":2,
				"terminate":false,
				"fail":false,
				"success":false,
				"updated":false,
				"failCondition":"false",
				"successCondition":"false",
				"successSe":{"name":"Quest_Surprise_PopUp","pan":0,"pitch":120,"volume":90},
				"mandatory":"essential"
			},
			{	"name":"Quete Test 3",
				"imgId":3,
				"terminate":false,
				"fail":false,
				"success":false,
				"updated":false,
				"failCondition":"false",
				"successCondition":"false",
				"successSe":{"name":"Quest_Surprise_PopUp","pan":0,"pitch":120,"volume":90},
				"mandatory":"obligatory"
			}
		],
		"startSe":{"name":"Quest_Start","pan":0,"pitch":120,"volume":90},
		"updateSe":{"name":"Quest_Objective_Update","pan":0,"pitch":120,"volume":90},
		"successSe":{"name":"Quest_Dialogue_Choice","pan":0,"pitch":120,"volume":90},
		"failSe":{"name":"Quest_Dialogue_Event","pan":0,"pitch":120,"volume":90},
		"exp":250,
		"validate":false,
		
	},
	{	"name" : "QUETE DE TESTING 2",
		"isStart":false,
		"success":false,
		"terminate":false,
		"steps":[
			{	"name":"Quete Test 1",
				"imgId":1,
				"terminate":false,
				"fail":false,
				"success":false,
				"updated":false,
				"failCondition":"false",
				"successCondition":"$gameVariables.value(1) == 1",
				"successSe":{"name":"Quest_Surprise_PopUp","pan":0,"pitch":120,"volume":90},
				"mandatory":"essential"
			},
			{	"name":"Quete Test 2",
				"imgId":2,
				"terminate":false,
				"fail":false,
				"success":false,
				"updated":false,
				"failCondition":"false",
				"successCondition":"$gameVariables.value(2) == 1",
				"successSe":{"name":"Quest_Surprise_PopUp","pan":0,"pitch":120,"volume":90},
				"mandatory":"essential"
			},
			{	"name":"Quete Test 3",
				"imgId":3,
				"terminate":false,
				"fail":false,
				"success":false,
				"updated":false,
				"failCondition":"false",
				"successCondition":"$gameVariables.value(3) == 1",
				"successSe":{"name":"Quest_Surprise_PopUp","pan":0,"pitch":120,"volume":90},
				"mandatory":"essential"
			}
		],
		"startSe":{"name":"Quest_Start","pan":0,"pitch":120,"volume":90},
		"updateSe":{"name":"Quest_Objective_Update","pan":0,"pitch":120,"volume":90},
		"successSe":{"name":"Quest_Dialogue_Choice","pan":0,"pitch":120,"volume":90},
		"failSe":{"name":"Quest_Dialogue_Event","pan":0,"pitch":120,"volume":90},
		"exp":250,
		"validate":false,
		
	}
];


QuestManager = {};

QuestManager.addNewQuest			= function(questId, restart){
	$gameSystem.quests = $gameSystem.quests || [];
	if(!$gameSystem.quests[questId]) 
		$gameSystem.quests[questId] = $scQuests[questId];
	else if(restart){
		$gameSystem.quests[questId] = $scQuests[questId];
	}
};
QuestManager.displayQuest 			= function(id){
	if(!this.questWaitList().contains(id))
		this.questWaitList_add(id);
	if(this.questWaitList().length > 0 && !$gameSwitches.value(62)){
		$gameVariables.setValue(62, this.questWaitList()[0]);
		$gameTemp.reserveCommonEvent(11);
	}
};
QuestManager.questWaitList_add 		= function(id){
	this._questWaitList = this._questWaitList || [];
	this._questWaitList.push(id);
}
QuestManager.questWaitList 			= function(id){
	this._questWaitList = this._questWaitList || [];
	return this._questWaitList;
}
QuestManager.questWaitList_shift 	= function(id){
	this._questWaitList = this._questWaitList || [];
	return this._questWaitList.shift();
}

QuestManager.getQuestData 			= function(id){
	$gameSystem.quests = $gameSystem.quests || [];
	if(!$gameSystem.quests[id]) 
		$gameSystem.quests[id] = $scQuests[id];
	return $gameSystem.quests[id];
};
QuestManager.getAllQuestsData 		= function(id){
	$gameSystem.quests = $gameSystem.quests || [];
	return $gameSystem.quests;
};
QuestManager.getActorDataSC			= function(id){
	var _id = id || 1;
	$gameSystem.SCactors = $gameSystem.SCactors || [];
	if(!$gameSystem.SCactors[id]) 
		$gameSystem.SCactors[id] = $scActors[id];
	return $gameSystem.SCactors[id];
};

//PREPARE HUD
QuestManager.showQuest				= function(questId){
	this.showHud(questId);
	this.showSteps(questId);
	this.openHud(questId);
	this.openSteps(questId);
};
QuestManager.showHud				= function(questId){
	var x = 25;
	var y = 25;
	
	$gameScreen.showPicture(10, "Quest_Hud", 				0, x, y, 			100, 100, 0, 0);
	$gameScreen.showPicture(11, "Quest_Ico_" + questId,		1, x +100, y + 80,  50,  50, 0, 0);
	$gameScreen.showPicture(12, "Quest_Title_" + questId, 	0, x , y + 170, 	100, 100, 0, 0);
};
QuestManager.showSteps				= function(questId){
	var quest = QuestManager.getQuestData(questId);
	var y, nm;
	var imgI = 0;
	var stepData;
	
	for(var i = 0; i < quest.steps.length; i++){
	
		stepData = quest.steps[i];
		if(!stepData.terminate){
			nm = "Quest_Step_" + stepData.imgId;
			y = 240 + (imgI * 35);
			$gameScreen.showPicture(imgI + 13, nm, 0,- 100, y, 100, 100, 0, 0);
			imgI++;
		}
	}
};
QuestManager.showStepsStatus		= function(questId){
	var quest = QuestManager.getQuestData(questId);
	var x = 290;
	var imgI = 0;
	var stepData;
	
	for(var i = 0; i < quest.steps.length; i++){
		stepData = quest.steps[i];
		y = 255 + (imgI * 35);
		if(!stepData.terminate){
			if(eval(stepData.successCondition)){
				console.log("SHOW SUCESS");
				AudioManager.playSe(stepData.successSe);
				$gameScreen.showPicture(imgI + 17, "Quest_StepOk", 1, x, y, 50, 50, 0, 0);
				imgI++;
			}else if(eval(stepData.failCondition)){
				console.log("SHOW FAIL");
				$gameScreen.showPicture(imgI + 17, "Quest_StepFail", 1, x, y, 50, 50, 0, 0);
				imgI++;
			}
		}
	}
};

//OPEN HUD
QuestManager.openHud				= function(questId){
	var quest = QuestManager.getQuestData(questId);
	var questLog = this.getActorDataSC($gameParty.leader().actorId());
	var x = 25;
	var y = 25;
	
	if(!questLog.quests.contains(questId)){
		AudioManager.playSe(quest.startSe);
		questLog.quests.push(questId);
	}else
		AudioManager.playSe(quest.updateSe);;
	
	$gameScreen.movePicture(10, 0, x, y,				100, 100, 200, 0, 140);
	$gameScreen.movePicture(11, 1, x +100, y + 80,		120, 120, 200, 0, 180);
	$gameScreen.movePicture(12, 0, x, y + 170,	100,	100, 200, 0, 220);
};
QuestManager.openAllSteps			= function(questId){
	var quest = QuestManager.getQuestData(questId);
	
	var x = 25;
	var y = 25;
	var yTmp = 0;
	var imgIndex = 13;
	var stepData;
	
	for(var i = 0; i < quest.steps.length; i++){
		stepData = quest.steps[i];
		if(!stepData.terminate){
			yTmp = y + 200 + (i * 25);
			
			$gameScreen.movePicture(imgIndex, 0, x, yTmp, 100, 100, 200, 0, 100);
			imgIndex++;
		}
	}
};
QuestManager.openStep				= function(questId, stepId, imgI){
	var quest = $scQuests[questId];
	var stepData = quest.steps[stepId];
	var x = 25;
	var y = 240 + (imgI * 35);
	
	if(!stepData.terminate){
		$gameScreen.movePicture(imgI + 13, 0, x, y, 100, 100, 150, 0, 80);
		$gameVariables.setValue(65, imgI + 1);
	}
};
QuestManager.openStepStatus			= function(questId, stepId, imgI){
	var quest = $scQuests[questId];
	var stepData = quest.steps[stepId];
	var y = 255 + (imgI * 35);
	var x = 290;
	
	if(!stepData.terminate){
		if(eval(stepData.failCondition)){
			$gameScreen.movePicture(imgI + 17, 1, x, y, 100, 100, 100, 0, 60);
			$gameVariables.setValue(65, imgI + 1);
		}else if(eval(stepData.successCondition)){
			$gameScreen.movePicture(imgI + 17, 1, x, y, 100, 100, 100, 0, 60);
			$gameVariables.setValue(65, imgI + 1);
		}
	}
};

//UPDATE HUD
QuestManager.updateStepStatus		= function(questId, stepId, imgI){
	var quest = $scQuests[questId];
	var stepData = quest.steps[stepId];
	var y = 250 + (imgI * 35);
	var x = 140;
	
	if(!stepData.terminate){
		if(eval(stepData.failCondition) || eval(stepData.successCondition))
			$gameScreen.movePicture(imgI + 17, 1, x, y, 100, 100, 0, 80);
		$gameVariables.setValue(65, imgI + 1);
	}
	
};
QuestManager.updateStepClosing		= function(questId, stepId, imgI, shiftY){
	var quest = $scQuests[questId];
	var stepData = quest.steps[stepId];

	var xStatus = 290;
	var yStatus = 250 + (imgI * 35);

	var x = 25;
	var y = 240 + (imgI * 35);
	
	if(!stepData.terminate){
		if(eval(stepData.successCondition)){
			$gameScreen.movePicture(imgI + 17, 1, xStatus - 100, yStatus, 	100, 100, 0, 0, 60);
			$gameScreen.movePicture(imgI + 13, 0, x - 100, y, 			100, 100, 0, 0, 60);
			shiftY++;
			$gameVariables.setValue(66, shiftY);
			
				stepData.terminate = true;
		}else{
			$gameScreen.movePicture(imgI + 17, 1, xStatus, yStatus - shiftY * 35, 	100, 100, 100, 0, 60);
			$gameScreen.movePicture(imgI + 13, 0, x, y - shiftY * 35, 		100, 100, 100, 0, 60);
		}
		$gameVariables.setValue(65, imgI + 1);
	}
};
QuestManager.updateIconPlacement	= function(){
	var x = 25;
	var y = 25;
	
	$gameScreen.movePicture(11, 1, x +100, y + 80, 100, 100, 200, 0, 200);
}

//CLOSE
QuestManager.closeSteps				= function(questId){
	var quest = QuestManager.getQuestData(questId);
	var x = 290;
	var imgI = 0;
	var stepData;
	
	for(var i = 0; i < quest.steps.length; i++){
		stepData = quest.steps[i];
		y = 255 + (imgI * 35);
		if(!stepData.terminate){
			if(eval(stepData.successCondition)){
				AudioManager.playSe(stepData.successSe);
				$gameScreen.showPicture(imgI + 17, "Quest_StepOk", 1, x, y, 50, 50, 0, 0);
				imgI++;
			}else if(eval(stepData.failCondition)){
				$gameScreen.showPicture(imgI + 17, "Quest_StepFail", 1, x, y, 50, 50, 0, 0);
				imgI++;
			}
		}
	}
};
QuestManager.closeHud				= function(){
	for(var i = 10; i < 20; i++){
		if($gameScreen._pictures[i]){
			pct = $gameScreen._pictures[i];
			if(pct)
				$gameScreen.movePicture(i, pct._origin, pct._x, pct._y, pct._scaleX, pct._scaleY, 0, 0, 60);
		}
	}
}

//CHECK COMPLETION
QuestManager.checkQuestCompleted	= function(questId){
	var quest = QuestManager.getQuestData(questId);
	
	if(this.checkQuestFailed(questId)){
		return true;
	}else if(this.checkQuestSuccess(questId)){
		quest.success = true;
		return true;
	}
	return false;
}
QuestManager.checkQuestFailed		= function(questId){
	var quest = QuestManager.getQuestData(questId);
	var notCheck = 0;
	
	for(var i = 0; i < quest.steps.length; i++){
		stepData = quest.steps[i];
		if(eval(stepData.failCondition)){
			if(stepData.mandatory == "essential"){
				return true;
			}
		}else
			notCheck++;
	}
	
	return notCheck == 0;
};
QuestManager.checkQuestSuccess		= function(questId){
	var quest = QuestManager.getQuestData(questId);
	
	for(var i = 0; i < quest.steps.length; i++){
		stepData = quest.steps[i];
		if(!eval(stepData.successCondition) && stepData.mandatory == "essential")
				return false;
	}
	return true;
};

//UPDATE MAIN
QuestManager.checkAllQuests			= function(){
	var questsData = QuestManager.getAllQuestsData();
	for(var i = 0; i < questsData.length; i++){
		if(!this.questWaitList().contains(i))
			this.checkQuest(i);
	}
};
QuestManager.checkQuest				= function(id){
	var questData = QuestManager.getQuestData(id);
	if(!questData.terminate)
		if(this.checkQuestAllSteps(id))
			this.displayQuest(id);
}
QuestManager.checkQuestAllSteps		= function(id){
	var questData = QuestManager.getQuestData(id);
	var stepData;
	var isUpdated = false;
	
	for(var i = 0; i < questData.steps.length; i++){
		stepData = QuestManager.getQuestData(id).steps[i];
		if(this.checkQuestStep(id, i))
			isUpdated = true;
	}
	return isUpdated;
}
QuestManager.checkQuestStep			= function(questId, stepId){
	var questData = QuestManager.getQuestData(questId);
	var stepData = questData.steps[stepId];
	
	if(!stepData.terminate){
		if( !questData.isStart){
			questData.isStart = true;
			return true;
		}else if(this.stepNeedRefresh(questId, stepId))
			return true;
	}
	return false;
};

QuestManager.stepNeedRefresh			= function(questId, stepId){
	var questData = QuestManager.getQuestData(questId);
	var stepData = questData.steps[stepId];
	return eval(stepData.successCondition) != stepData.success || eval(stepData.failCondition) != stepData.fail
}









