var AI = function(being) {
	this._being = being;
	this._being._ai = this;

	this._needs = {
		survival: 1,
		health: 1,
		satiation: 1,
		revenge: 1
	};
	this._priorities = ["survival", "satiation", "revenge", "health"];
	this._enemy = null;
	
	this._hook("act");
	this._hook("damage");
	this._hook("eat");
	this._hook("heal");
}

AI.prototype.act = function() {
	if (BEINGS.indexOf(this._being) == -1) { return; } /* already dead :-( */

	/* observe values changed during the being.act */
	if (this._being._hunger > 2) { this._needs.satiation = 0; }
	if (this._enemy && BEINGS.indexOf(this._enemy) == -1) { 
		this._enemy = null;
		this._needs.revenge = 1;
	}
	
	/* act, based on current needs */
	for (var i=0;i<this._priorities.length;i++) {
		var need = this._priorities[i];
		if (this._needs[need]) { continue; } /* already satisfied */
		if (this._satisfy(need)) { return; } /* managed to satisfy */
	}
	
	this._being.log("AI has nothing to do");
	
}

AI.prototype.eat = function() {
	this._needs.satiation = 1;
}

AI.prototype.heal = function() {
	this._needs.health = 1;
	this._needs.survival = 1;
}

AI.prototype.damage = function(attacker) {
	this._enemy = attacker;
	this._needs.revenge = 0;
	this._needs.health = 0;
	if (this._being._hp < 3) { this._needs.survival = 0; }
}

AI.prototype._hook = function(func) {
	var original = this._being[func];
	var ai = this;
	this._being[func] = function() {
		var result = original.apply(this, arguments);
		ai[func].apply(ai, arguments);
		return result;
	}
}

AI.prototype._satisfy = function(need) {
	this._being.log("trying to satisfy " + need);
	
	switch (need) {
		case "survival":
			this._being.heal();
		break;

		case "health":
			this._being.heal();
		break;
		
		case "satiation":
			this._being.eat();
		break;

		case "revenge":
			this._enemy.damage(this._being);
		break;
	}
	
	return true;
}
