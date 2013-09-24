var BEINGS = [];

var Being = function(name) {
	this._name = name;
	this._hp = 5;
	this._hunger = 0;
	BEINGS.push(this);
}

Being.prototype.getName = function() {
	return this._name;
}

Being.prototype.act = function() {
	this.log("acts...");
	this._hunger++;
	if (this._hunger > 5) { this._die("starvation"); }
}

Being.prototype.eat = function() {
	this._hunger = 0;
	this.log("eats");
}

Being.prototype.damage = function(attacker) {
	this._hp--;
	attacker.log("attacks");
	this.log("takes damage");
	if (this._hp <= 0) { this._die("damage"); }
}

Being.prototype.heal = function() {
	this._hp = 5;
	this.log("heals");
}

Being.prototype.log = function(text) {
	var log = document.querySelector("#log");
	log.value += this._name + " (hp:" + this._hp + " hunger:" + this._hunger + ") " + text + "\n";
	log.scrollTop = log.scrollHeight;
}

Being.prototype._die = function(reason) {
	BEINGS.splice(BEINGS.indexOf(this), 1);
	this.log("dies from " + reason);
}

