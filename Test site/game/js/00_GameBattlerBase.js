function Game_BattlerBase() {
    this.initialize.apply(this, arguments);
}

Game_BattlerBase.TRAIT_ELEMENT_RATE   = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE    = 12;
Game_BattlerBase.TRAIT_STATE_RATE     = 13;
Game_BattlerBase.TRAIT_STATE_RESIST   = 14;
Game_BattlerBase.TRAIT_PARAM          = 21;
Game_BattlerBase.TRAIT_XPARAM         = 22;
Game_BattlerBase.TRAIT_SPARAM         = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE   = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED   = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES   = 34;
Game_BattlerBase.TRAIT_STYPE_ADD      = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL     = 42;
Game_BattlerBase.TRAIT_SKILL_ADD      = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL     = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE    = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE    = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK     = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL     = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE      = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS    = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG   = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE  = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY  = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE  = 0;
Game_BattlerBase.FLAG_ID_GUARD        = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE   = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP  = 3;
Game_BattlerBase.ICON_BUFF_START      = 32;
Game_BattlerBase.ICON_DEBUFF_START    = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
	// HEALTH =======================================================================
    // Hit Points
    hp: 		{ get: function() { return this._hp; }, 		configurable: true },
    // Stamina (Action Pts)
    stamina: 	{ get: function() { return this._stamina; }, 	configurable: true },
	// radiations
    rad: 	{ get: function() { return this._rad; }, 	configurable: true },


	// STATS =======================================================================
    // Strength
    str:		{ get: function() { return this.param(0); }, 	configurable: true },
    // Perception
    per:		{ get: function() { return this.param(1); },	configurable: true },
    // Endurance
    end:		{ get: function() { return this.param(2); },	configurable: true },
    // Charisma
    cha:		{ get: function() { return this.param(3); },	configurable: true },
    // Intelligency
    int:		{ get: function() { return this.param(4); },	configurable: true },
    // Agility
    agi:		{ get: function() { return this.param(5); },	configurable: true },
    // LUcK
    luk:		{ get: function() { return this.param(6); },	configurable: true },

	// BUFFS =======================================================================
    
	// HIT rate
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    // EVAsion rate
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    // CRItical rate
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    // Critical EVasion rate
    cev: { get: function() { return this.xparam(3); }, configurable: true },
	// Shot EVasion rate
    sev: { get: function() { return this.xparam(4); }, configurable: true },
    // CouNTer attack rate
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    // Hp ReGeneration rate
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    // Stamina ReGeneration rate
    srg: { get: function() { return this.xparam(8); }, configurable: true },

	
    // TarGet Rate
    tgr: { get: function() { return this.sparam(0); },	configurable: true },
    // GuaRD effect rate
    grd: { get: function() { return this.sparam(1); },	configurable: true },
    // RECovery effect rate
    rec: { get: function() { return this.sparam(2); },	configurable: true },
    // PHArmacology
    pha: { get: function() { return this.sparam(3); },	configurable: true },
    // Stamina Cost Rate
    mcr: { get: function() { return this.sparam(4); },	configurable: true },
    // Charisma Rate
    tcr: { get: function() { return this.sparam(5); },	configurable: true },
    // Physical Damage Rate
    pdr: { get: function() { return this.sparam(6); },	configurable: true },
    // Shot Damage Rate
    sdr: { get: function() { return this.sparam(7); },	configurable: true },
    // Floor Damage Rate
    fdr: { get: function() { return this.sparam(8); },	configurable: true },
    // EXperience Rate
    exr: { get: function() { return this.sparam(9); },	configurable: true },

	//PROGRESSION
	lvl: { get: function() { return this._level; },		configurable: true},
});


Game_BattlerBase.prototype.initialize = function(actorId) {
    this.initMembers();
	this.setup(actorId);
}
Game_BattlerBase.prototype.initMembers = function() {
    this._hp			= 1;
    this._stamina		= 0;
    this._hidden		= false;
	this._action		= 0;
    this._speed			= 0;
    this._damagePopup	= false;
    this._effectType	= null;
	this._selected		= false;

    this.clearParamPlus();
    this.clearStates();
    this.clearBuffs();
}
Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0,0,0,0,0,0,0];
}
Game_BattlerBase.prototype.clearStates = function() {
    this._states = [];
    this._stateTurns = {};
}
Game_BattlerBase.prototype.clearBuffs = function() {
    this._buffs = [0,0,0,0,0,0,0,0];
    this._buffTurns = [0,0,0,0,0,0,0,0];
}
Game_BattlerBase.prototype.setup = function(actor) {
    this._actorId		= actor.id;
    this._name			= actor.name;
    this._nickname		= actor.nickname;
    this._profile		= actor.profile;
    this._level			= actor.lvl;
	
    this.initEquips(actor.equips);
    this.initImages();
    this.initExp();
    this.recoverAll();
    this.refresh();
}
Game_BattlerBase.prototype.initEquips = function(equips) {
	this._equips	= [];	//body, cloth, armor, face, facial, hat, rHand, lHand, bags1, bags2
	this._bags		= [];	//{"id":0, "content":[]};
	this._accs		= [];	//accesories

	for(let i = 0; i < 10; i++){
		this._equips[i] = equips[i];
	}
}




Game_BattlerBase.prototype.initImages = function() {
    var actor = this.actor();
    this._characterName		= this.characterName();
    this._characterIndex	= this._action;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
}
Game_Player.prototype.characterName		= function(){
	var _armeId			= this.SC_getWeaponId()  || 1;
	var _tenueId		= this.SC_getArmorId() || 63;
	var _actionIndex	= this.SC_getActionIndex();
	
	if(_actionIndex < 8)
		return this.SC_getFullChar(this.SC_getCharName(), _tenueId, _armeId);
	else if(_actionIndex < 16)
		return this.SC_getFullChar(this.SC_getCharName() + "_B", _tenueId, _armeId);
	else
		return this.SC_getFullChar(this.SC_getCharName() + "_C", _tenueId, _armeId);
}










Game_Battler.prototype.initMembers = function() {
    Game_BattlerBase.prototype.initMembers.call(this);
    
    this._result = new Game_ActionResult();
    this._actionState = '';
    this._lastTargetIndex = 0;
    this._animations = [];
    this._motionType = null;
    this._weaponImageId = 0;
    this._motionRefresh = false;
    
};

Game_Battler.prototype.clearAnimations = function() {
    this._animations = [];
};

Game_Battler.prototype.clearDamagePopup = function() {
    this._damagePopup = false;
};

Game_Battler.prototype.clearWeaponAnimation = function() {
    this._weaponImageId = 0;
};

Game_Battler.prototype.clearEffect = function() {
    this._effectType = null;
};

Game_Battler.prototype.clearMotion = function() {
    this._motionType = null;
    this._motionRefresh = false;
};

Game_Battler.prototype.requestEffect = function(effectType) {
    this._effectType = effectType;
};

Game_Battler.prototype.requestMotion = function(motionType) {
    this._motionType = motionType;
};

Game_Battler.prototype.requestMotionRefresh = function() {
    this._motionRefresh = true;
};

Game_Battler.prototype.select = function() {
    this._selected = true;
};

Game_Battler.prototype.deselect = function() {
    this._selected = false;
};

Game_Battler.prototype.isAnimationRequested = function() {
    return this._animations.length > 0;
};

Game_Battler.prototype.isDamagePopupRequested = function() {
    return this._damagePopup;
};

Game_Battler.prototype.isEffectRequested = function() {
    return !!this._effectType;
};

Game_Battler.prototype.isMotionRequested = function() {
    return !!this._motionType;
};

Game_Battler.prototype.isWeaponAnimationRequested = function() {
    return this._weaponImageId > 0;
};

Game_Battler.prototype.isMotionRefreshRequested = function() {
    return this._motionRefresh;
};

Game_Battler.prototype.isSelected = function() {
    return this._selected;
};

Game_Battler.prototype.effectType = function() {
    return this._effectType;
};

Game_Battler.prototype.motionType = function() {
    return this._motionType;
};

Game_Battler.prototype.weaponImageId = function() {
    return this._weaponImageId;
};

Game_Battler.prototype.shiftAnimation = function() {
    return this._animations.shift();
};

Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
    var data = { animationId: animationId, mirror: mirror, delay: delay };
    this._animations.push(data);
};

Game_Battler.prototype.startDamagePopup = function() {
    this._damagePopup = true;
};

Game_Battler.prototype.startWeaponAnimation = function(weaponImageId) {
    this._weaponImageId = weaponImageId;
};

Game_Battler.prototype.action = function(index) {
    return this._actions[index];
};

Game_Battler.prototype.setAction = function(index, action) {
    this._actions[index] = action;
};

Game_Battler.prototype.numActions = function() {
    return this._actions.length;
};

Game_Battler.prototype.clearActions = function() {
    this._actions = [];
};

Game_Battler.prototype.result = function() {
    return this._result;
};

Game_Battler.prototype.clearResult = function() {
    this._result.clear();
};

Game_Battler.prototype.refresh = function() {
    Game_BattlerBase.prototype.refresh.call(this);
    if (this.hp === 0) {
        this.addState(this.deathStateId());
    } else {
        this.removeState(this.deathStateId());
    }
};

Game_Battler.prototype.addState = function(stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

Game_Battler.prototype.isStateAddable = function(stateId) {
    return (this.isAlive() && $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this._result.isStateRemoved(stateId) &&
            !this.isStateRestrict(stateId));
};

Game_Battler.prototype.isStateRestrict = function(stateId) {
    return $dataStates[stateId].removeByRestriction && this.isRestricted();
};

Game_Battler.prototype.onRestrict = function() {
    Game_BattlerBase.prototype.onRestrict.call(this);
    this.clearActions();
    this.states().forEach(function(state) {
        if (state.removeByRestriction) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
        if (stateId === this.deathStateId()) {
            this.revive();
        }
        this.eraseState(stateId);
        this.refresh();
        this._result.pushRemovedState(stateId);
    }
};

Game_Battler.prototype.escape = function() {
    if ($gameParty.inBattle()) {
        this.hide();
    }
    this.clearActions();
    this.clearStates();
    SoundManager.playEscape();
};

Game_Battler.prototype.addBuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.increaseBuff(paramId);
        if (this.isBuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.addDebuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.decreaseBuff(paramId);
        if (this.isDebuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedDebuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.removeBuff = function(paramId) {
    if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
        this.eraseBuff(paramId);
        this._result.pushRemovedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.removeBattleStates = function() {
    this.states().forEach(function(state) {
        if (state.removeAtBattleEnd) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeAllBuffs = function() {
    for (var i = 0; i < this.buffLength(); i++) {
        this.removeBuff(i);
    }
};

Game_Battler.prototype.removeStatesAuto = function(timing) {
    this.states().forEach(function(state) {
        if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeBuffsAuto = function() {
    for (var i = 0; i < this.buffLength(); i++) {
        if (this.isBuffExpired(i)) {
            this.removeBuff(i);
        }
    }
};

Game_Battler.prototype.removeStatesByDamage = function() {
    this.states().forEach(function(state) {
        if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.makeActionTimes = function() {
    return this.actionPlusSet().reduce(function(r, p) {
        return Math.random() < p ? r + 1 : r;
    }, 1);
};

Game_Battler.prototype.makeActions = function() {
    this.clearActions();
    if (this.canMove()) {
        var actionTimes = this.makeActionTimes();
        this._actions = [];
        for (var i = 0; i < actionTimes; i++) {
            this._actions.push(new Game_Action(this));
        }
    }
};

Game_Battler.prototype.speed = function() {
    return this._speed;
};

Game_Battler.prototype.makeSpeed = function() {
    this._speed = Math.min.apply(null, this._actions.map(function(action) {
        return action.speed();
    })) || 0;
};

Game_Battler.prototype.currentAction = function() {
    return this._actions[0];
};

Game_Battler.prototype.removeCurrentAction = function() {
    this._actions.shift();
};

Game_Battler.prototype.setLastTarget = function(target) {
    if (target) {
        this._lastTargetIndex = target.index();
    } else {
        this._lastTargetIndex = 0;
    }
};

Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    var action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    this._actions.push(action);
};

Game_Battler.prototype.useItem = function(item) {
    if (DataManager.isSkill(item)) {
        this.paySkillCost(item);
    } else if (DataManager.isItem(item)) {
        this.consumeItem(item);
    }
};

Game_Battler.prototype.consumeItem = function(item) {
    $gameParty.consumeItem(item);
};

Game_Battler.prototype.gainHp = function(value) {
    this._result.hpDamage = -value;
    this._result.hpAffected = true;
    this.setHp(this.hp + value);
};

Game_Battler.prototype.gainMp = function(value) {
    this._result.mpDamage = -value;
    this.setMp(this.mp + value);
};

Game_Battler.prototype.gainTp = function(value) {
    this._result.tpDamage = -value;
    this.setTp(this.tp + value);
};

Game_Battler.prototype.gainSilentTp = function(value) {
    this.setTp(this.tp + value);
};

Game_Battler.prototype.initTp = function() {
    this.setTp(Math.randomInt(25));
};

Game_Battler.prototype.clearTp = function() {
    this.setTp(0);
};

Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = Math.floor(50 * damageRate * this.tcr);
    this.gainSilentTp(value);
};

Game_Battler.prototype.regenerateHp = function() {
    var value = Math.floor(this.mhp * this.hrg);
    value = Math.max(value, -this.maxSlipDamage());
    if (value !== 0) {
        this.gainHp(value);
    }
};

Game_Battler.prototype.maxSlipDamage = function() {
    return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};

Game_Battler.prototype.regenerateMp = function() {
    var value = Math.floor(this.mmp * this.mrg);
    if (value !== 0) {
        this.gainMp(value);
    }
};

Game_Battler.prototype.regenerateTp = function() {
    var value = Math.floor(100 * this.trg);
    this.gainSilentTp(value);
};

Game_Battler.prototype.regenerateAll = function() {
    if (this.isAlive()) {
        this.regenerateHp();
        this.regenerateMp();
        this.regenerateTp();
    }
};

Game_Battler.prototype.onBattleStart = function() {
    this.setActionState('undecided');
    this.clearMotion();
    if (!this.isPreserveTp()) {
        this.initTp();
    }
};

Game_Battler.prototype.onAllActionsEnd = function() {
    this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
};

Game_Battler.prototype.onTurnEnd = function() {
    this.clearResult();
    this.regenerateAll();
    this.updateStateTurns();
    this.updateBuffTurns();
    this.removeStatesAuto(2);
};

Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp();
    }
    this.appear();
};

Game_Battler.prototype.onDamage = function(value) {
    this.removeStatesByDamage();
    this.chargeTpByDamage(value / this.mhp);
};

Game_Battler.prototype.setActionState = function(actionState) {
    this._actionState = actionState;
    this.requestMotionRefresh();
};

Game_Battler.prototype.isUndecided = function() {
    return this._actionState === 'undecided';
};

Game_Battler.prototype.isInputting = function() {
    return this._actionState === 'inputting';
};

Game_Battler.prototype.isWaiting = function() {
    return this._actionState === 'waiting';
};

Game_Battler.prototype.isActing = function() {
    return this._actionState === 'acting';
};

Game_Battler.prototype.isChanting = function() {
    if (this.isWaiting()) {
        return this._actions.some(function(action) {
            return action.isMagicSkill();
        });
    }
    return false;
};

Game_Battler.prototype.isGuardWaiting = function() {
    if (this.isWaiting()) {
        return this._actions.some(function(action) {
            return action.isGuard();
        });
    }
    return false;
};

Game_Battler.prototype.performActionStart = function(action) {
    if (!action.isGuard()) {
        this.setActionState('acting');
    }
};

Game_Battler.prototype.performAction = function(action) {
};

Game_Battler.prototype.performActionEnd = function() {
    this.setActionState('done');
};

Game_Battler.prototype.performDamage = function() {
};

Game_Battler.prototype.performMiss = function() {
    SoundManager.playMiss();
};

Game_Battler.prototype.performRecovery = function() {
    SoundManager.playRecovery();
};

Game_Battler.prototype.performEvasion = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performMagicEvasion = function() {
    SoundManager.playMagicEvasion();
};

Game_Battler.prototype.performCounter = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performReflection = function() {
    SoundManager.playReflection();
};

Game_Battler.prototype.performSubstitute = function(target) {
};

Game_Battler.prototype.performCollapse = function() {
};





Game_BattlerBase.prototype.eraseState = function(stateId) {
    var index = this._states.indexOf(stateId);
    if (index >= 0) {
        this._states.splice(index, 1);
    }
    delete this._stateTurns[stateId];
};

Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    return this._states.contains(stateId);
};

Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};

Game_BattlerBase.prototype.deathStateId = function() {
    return 1;
};

Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    var state = $dataStates[stateId];
    var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};

Game_BattlerBase.prototype.isStateExpired = function(stateId) {
    return this._stateTurns[stateId] === 0;
};

Game_BattlerBase.prototype.updateStateTurns = function() {
    this._states.forEach(function(stateId) {
        if (this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]--;
        }
    }, this);
};



Game_BattlerBase.prototype.eraseBuff = function(paramId) {
    this._buffs[paramId] = 0;
    this._buffTurns[paramId] = 0;
};

Game_BattlerBase.prototype.buffLength = function() {
    return this._buffs.length;
};

Game_BattlerBase.prototype.buff = function(paramId) {
    return this._buffs[paramId];
};

Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    return this._buffs[paramId] > 0;
};

Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    return this._buffs[paramId] < 0;
};

Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    return this._buffs[paramId] !== 0;
};

Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return this._buffs[paramId] === 2;
};

Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return this._buffs[paramId] === -2;
};

Game_BattlerBase.prototype.increaseBuff = function(paramId) {
    if (!this.isMaxBuffAffected(paramId)) {
        this._buffs[paramId]++;
    }
};

Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
    if (!this.isMaxDebuffAffected(paramId)) {
        this._buffs[paramId]--;
    }
};

Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
    if (this._buffTurns[paramId] < turns) {
        this._buffTurns[paramId] = turns;
    }
};

Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
    return this._buffTurns[paramId] === 0;
};

Game_BattlerBase.prototype.updateBuffTurns = function() {
    for (var i = 0; i < this._buffTurns.length; i++) {
        if (this._buffTurns[i] > 0) {
            this._buffTurns[i]--;
        }
    }
};

Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.clearBuffs();
}

Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};

Game_BattlerBase.prototype.states = function() {
    return this._states.map(function(id) {
        return $dataStates[id];
    });
};

Game_BattlerBase.prototype.stateIcons = function() {
    return this.states().map(function(state) {
        return state.iconIndex;
    }).filter(function(iconIndex) {
        return iconIndex > 0;
    });
};

Game_BattlerBase.prototype.buffIcons = function() {
    var icons = [];
    for (var i = 0; i < this._buffs.length; i++) {
        if (this._buffs[i] !== 0) {
            icons.push(this.buffIconIndex(this._buffs[i], i));
        }
    }
    return icons;
};

Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
        return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
    } else if (buffLevel < 0) {
        return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons().concat(this.buffIcons());
};

Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this.states();
};

Game_BattlerBase.prototype.allTraits = function() {
    return this.traitObjects().reduce(function(r, obj) {
        return r.concat(obj.traits);
    }, []);
};

Game_BattlerBase.prototype.traits = function(code) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code;
    });
};

Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code && trait.dataId === id;
    });
};

Game_BattlerBase.prototype.traitsPi = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r * trait.value;
    }, 1);
};

Game_BattlerBase.prototype.traitsSum = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};

Game_BattlerBase.prototype.traitsSumAll = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};

Game_BattlerBase.prototype.traitsSet = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r.concat(trait.dataId);
    }, []);
};

Game_BattlerBase.prototype.paramBase = function(paramId) {
    return 0;
};

Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};

Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 1) {
        return 0;   // MMP
    } else {
        return 1;
    }
};

Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 999999;  // MHP
    } else if (paramId === 1) {
        return 9999;    // MMP
    } else {
        return 999;
    }
};

Game_BattlerBase.prototype.paramRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};

Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * 0.25 + 1.0;
};

Game_BattlerBase.prototype.param = function(paramId) {
    var value = this.paramBase(paramId) + this.paramPlus(paramId);
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

Game_BattlerBase.prototype.debuffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};

Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

Game_BattlerBase.prototype.stateResistSet = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};

Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().contains(stateId);
};

Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

Game_BattlerBase.prototype.addedSkillTypes = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};

Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};

Game_BattlerBase.prototype.addedSkills = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};

Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};

Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};

Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};

Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};

Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};

Game_BattlerBase.prototype.slotType = function() {
    var set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};

Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};

Game_BattlerBase.prototype.actionPlusSet = function() {
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(trait) {
        return trait.value;
    });
};

Game_BattlerBase.prototype.specialFlag = function(flagId) {
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(trait) {
        return trait.dataId === flagId;
    });
};

Game_BattlerBase.prototype.collapseType = function() {
    var set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};

Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(trait) {
        return trait.dataId === abilityId;
    });
};

Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

Game_BattlerBase.prototype.isSubstitute = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};

Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};

Game_BattlerBase.prototype.setHp = function(hp) {
    this._hp = hp;
    this.refresh();
};

Game_BattlerBase.prototype.setMp = function(mp) {
    this._mp = mp;
    this.refresh();
};

Game_BattlerBase.prototype.setTp = function(tp) {
    this._tp = tp;
    this.refresh();
};

Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};

Game_BattlerBase.prototype.refresh = function() {
    this.stateResistSet().forEach(function(stateId) {
        this.eraseState(stateId);
    }, this);
    this._hp = this._hp.clamp(0, this.mhp);
    this._mp = this._mp.clamp(0, this.mmp);
    this._tp = this._tp.clamp(0, this.maxTp());
};

Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
};

Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};

Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};

Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};

Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};

Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};

Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};

Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isDying = function() {
    return this.isAlive() && this._hp < this.mhp / 4;
};

Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};

Game_BattlerBase.prototype.canInput = function() {
    return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};

Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};

Game_BattlerBase.prototype.isConfused = function() {
    return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};

Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};

Game_BattlerBase.prototype.isActor = function() {
    return false;
};

Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};

Game_BattlerBase.prototype.sortStates = function() {
    this._states.sort(function(a, b) {
        var p1 = $dataStates[a].priority;
        var p2 = $dataStates[b].priority;
        if (p1 !== p2) {
            return p2 - p1;
        }
        return a - b;
    });
};

Game_BattlerBase.prototype.restriction = function() {
    return Math.max.apply(null, this.states().map(function(state) {
        return state.restriction;
    }).concat(0));
};

Game_BattlerBase.prototype.addNewState = function(stateId) {
    if (stateId === this.deathStateId()) {
        this.die();
    }
    var restricted = this.isRestricted();
    this._states.push(stateId);
    this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

Game_BattlerBase.prototype.onRestrict = function() {
};

Game_BattlerBase.prototype.mostImportantStateText = function() {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        if (states[i].message3) {
            return states[i].message3;
        }
    }
    return '';
};

Game_BattlerBase.prototype.stateMotionIndex = function() {
    var states = this.states();
    if (states.length > 0) {
        return states[0].motion;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.stateOverlayIndex = function() {
    var states = this.states();
    if (states.length > 0) {
        return states[0].overlay;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.isSkillWtypeOk = function(skill) {
    return true;
};

Game_BattlerBase.prototype.skillMpCost = function(skill) {
    return Math.floor(skill.mpCost * this.mcr);
};

Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return skill.tpCost;
};

Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
};

Game_BattlerBase.prototype.paySkillCost = function(skill) {
    this._mp -= this.skillMpCost(skill);
    this._tp -= this.skillTpCost(skill);
};

Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};

Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};

Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
};

Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

Game_BattlerBase.prototype.canUse = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isSkill(item)) {
        return this.meetsSkillConditions(item);
    } else if (DataManager.isItem(item)) {
        return this.meetsItemConditions(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.canEquipWeapon(item);
    } else if (DataManager.isArmor(item)) {
        return this.canEquipArmor(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.attackSkillId = function() {
    return 1;
};

Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};

Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};

Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};

