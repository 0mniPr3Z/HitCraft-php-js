LootManager.._maxLootItemsChoice = 6;
LootManager._maxLootableLength = LootManager._maxLootItemsChoice;

LootManager.getTotalItemLootRate		= function(itemId, actor, lootBoxRate){
	var baseRate = this.getLootBaseRate(actor, lootBoxRate);
	var itemRate = this.getItemLootRate(itemId);
	
	return Math.round((baseRate + itemRate)/2) - Math.round(Math.random() * 100);
};
LootManager.getLootBaseRate				= function(lootBoxRate, actor){
	var _actor			= actor			|| $scActors[$gameParty.leader().actorId()];
	var _lootBoxrate	= lootBoxrate	|| 50;
	var rate			= this.getPlayerLootRate(_actor);
	
	return Math.round((rate + lootBoxRate) / 2);
};
LootManager.getItemLootRate				= function(itemId){
	var rate = this.getItemLootChance(itemId);
	rate += this.getItemLootChance(itemId) + this.getItemTypeLootPerk(itemId);
	return rate;
};
LootManager.getItemLootChance			= function(itemId){
	return 10 - $scItems[itemId].rarity;							// 0:foisonnant 1-2:banal 3-4:ordinaire 5:commun 6-7:insolite 8:rare 9:epique 10:legendaire(unique)
};
LootManager.getPlayerLootRate			= function(actor){
	var rate		= this.getSpecialLootRate(actor) + this.getPerkedLootRate(actor);
	
	return Math.round(rate/2);
};
LootManager.getSpecialLootRate			= function(actor){
	var perception		= actor._specialStats[2];
	var luck			= actor._specialStats[6];
	
	return Math.round((luck * 10 + perception * 10) / 2);
};
LootManager.getPerkedLootRate			= function(actor){
	var rate = 0;
	
	if(actor._perks.contains("recuperateur_3"))
		rate += 50;
	else if(actor._perks.contains("recuperateur_2"))
		rate += 20;
	else if(actor._perks.contains("recuperateur_1"))
		rate += 10;
	if(actor._perks.contains("recycleur_3"))
		rate += 10;
	return rate;
};
LootManager.getLootBoxTypeItemsList		= function(lootBoxType){
	return $scLoot[lootBoxType].items;
};
LootManager.getItemType					= function(itemId){
	return $scItems[itemId].type;									//arme tenue nourriture boisson soin/medicaments drogue/alcool ingredient bricAbrac materiaux munitions holos/notes divers 
};
LootManager.getItemCat					= function(itemId){			// 0-MP 1-bricAbrac 2-Ingredient 3-alim 4-prewarfood 5-plat cuisiné 6-Boissons 7-Alcool 8-Drogue 9-Medic
	return $scItems[itemId].category;								//  10-armCaC 11-armBallist 12-armNRJ 13-armLourd  14-vetement 15-amure 16-armure_assisté 17-Munitions 18-Explosifs
};																	// 11-Bricotool 12-cuisinetool 13-chimimedictool 14-constructool 15-sporttool 16-musictool 17-docs/book 18-holobande 19-collection 20-capsules
LootManager.getItemTypeLootPerk			= function(type, actor){
	var rate = 0;
	
	switch(type){
		case 0://capsule
			rate += this.getCapsuleTypePerk(actor);
		break;
		default:break;
	}
	return rate;
};
LootManager.getCapsuleTypePerk			= function(actor){
	var rate = 0;
	
	if(actor._perks.contains("cherche_tresor_4"))
		rate += 100;
	else if(actor._perks.contains("cherche_tresor_3"))
		rate += 50;
	else if(actor._perks.contains("cherche_tresor_2"))
		rate += 20;
	else if(actor._perks.contains("cherche_tresor_1"))
		rate += 10;
	if(actor._perks.contains("fana_capsule_3"))
		rate += 10;
	return rate;
};
LootManager.getLootQuantity				= function(rate, maxNbr){
	return Math.ceil(rate * maxNbr / 100);
};



LootManager.generateLootBoxContent			= function(lootboxType, lootBoxRate, actor){
	var itemsList = this.getLootBoxTypeItemsList(lootboxType);
	var _lootBoxrate	= lootBoxrate	|| 100;
	var generateList = [];
	var item = {};
	
	for(var i = 0; i < itemsList.length; i++){
		item.itemId = itemsList[i].itemId;
		item.rate = this.getTotalItemLootRate(item.itemId, actor, lootBoxRate);
		item.quantity = this.getLootQuantity(item.rate, itemsList[i].maxNbr);
		generateList.push(item);
	}
	return this.generateListSorted(generateList actor);
};
LootManager.generateListSorted			= function(list, actor){
	var generateList = this.sortLootListByRate(list);
	var itemNbr = this.getLootQuantity(this.getPlayerLootRate(actor), this._maxLootableLength);
	
	return generateList.splice(itemNbr, generateList.length - itemNbr);
};
LootManager.sortLootListByRate			= function(list){
	return list.sort(function(a, b){
		return a.rate - b.rate;
	});
};

LootManager.getItemsInLootBox			= function(lootboxId, lootboxType, lootBoxRate, actorId){
	var _actor = $scActors[actorId] || $scActors[$gameParty.leader().actorId()];
	var lootBoxData = $scLootBox[lootboxId];
	if(!$scLootBox[lootboxId]._opened){
		$scLootBox[lootboxId]._items = this.generateLootBoxContent(lootboxType,, lootBoxRate, _actor);
		$scLootBox[lootboxId]._opened = true;
	}
	return $scLootBox[lootboxId]._items;
};

LootManager.getLootBox				= function(lootboxId, lootboxType, lootBoxRate, actorId){
	var _actorId = actorId || $gameParty.leader().actorId();
	if(lootBoxId < 0)
		var _lotBoxId = $scLootBox[lootboxId].length;
	lootBoxRate = lootBoxRate || 100;
	var contents = this.getItemsInLootBox(lootboxId, lootboxType, lootBoxRate, actorId);
	var textChoice = "";
	if(contents.length > 0)
		for(var i = 0; i <= this._maxLootItemsChoice; i++){
			item = contents[i];
			itemId = contents[i].itemId;
			
			textChoice = "x" + item.quantity.padZero(2) + " \i[" + $scItems[itemId].iconIndex + "] " + itemsList[i].name + textManager.scVocab("founded");
			$gameMessages.choice_text(i + 1, textChoice, true);
			if(this.getStockCapacity($scActors[actorId].stock) > $scItems[itemId].weight){
				$gameMessages.hide_choice(i + 1, contents.length >= i);
			}else{
				$gameMessages.choice_text(i + 1, textChoice + " " + textManager.scVocab("maxCapStock"), true);
				$gameMessages.disable_choice(i + 1, true );
			}
		}
	}else{
		textChoice = textManager.scVocab("blankLoot");
		gameMessages.choice_text(i + 1, textChoice, true);
	}
};





LootManager.keepLootBoxItem			= function(lootBoxId, index, quantity, actorId){
	if($scLootBox[lootBoxId][index]){
		var rangedQuantity = Math.max(Math.min(quantity, item.quantity), 0);
		var stockCap = 1;
		var item = $scLootBox[lootBoxId][index];
		
		for(var i = 1; i < rangedQuantity; i++){
			if(this.getStockCapacity($scActors[actorId].stock) > $scItems[item.itemId].weight * i)
				stockCap = i;
		}
		
		
		$gameParty.gainItem(item.itemId, stockCap);
		item.quantity -= stockCap;
		if(item.quantity <= 0)
			$scLootBox[lootBoxId].splice(index, 1);
		AudioManager.playSe($scItems[item.itemId].collectFx.se);
		$gameParty.leader().requestAnimation($scItems[item.itemId].collectFx.anim);
	}else{
		SoundManager.playBuzzer();
	}
};
/*
"// Swap the locations of the player and map event 7
$gamePlayer.swap($gameMap.event(7));"
"// Show picture 1, pic.png, at 100% scale centred on (50, 50)
$gameScreen.showPicture(1, ""pic"", 1, 0, 0, 25, 25, 255, 0);"
*/


