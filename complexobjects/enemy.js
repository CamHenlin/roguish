/**
 * @name Enemy
 * @class
 */

/**
 * Enemy simple example of an enemy
 * @constructor
 */
var Enemy = function(x, y, level) {
	this.x = x;  // x position on canvas
	this.y = y;  // y position on canvas
	this.level = level;
	this.hp = 10 * level;
	this.xp = 100 * level;
	this.movementSpeed = level * 25;
	this.attackSpeed = level;
	this.attack = level;
	this.defense = level;
	this.scout = level * 25;
	this.magic = level;
	this.initiative = 10;
	this.turnCounter = 0;

	this.watchedElements = [];
	this.counter = 0;
	this.moveSpeed = 4;

	this.doMovement = function() {
	};

	/**
	 * [turn code that gets called when it's the enemy's turn]
	 * @return {[type]} [description]
	 */
	this.turn = function() {
		this.doMovement();
	};

	this.die = function() {
		gamestage.removeChild(this.animations);
		var index = activeObjects.indexOf(this);

		if (index > -1) {
			activeObjects.splice(index, 1);
		}

		console.log("enemy has died");
	};

	this.tickActions = function() {
		for (var i = 0; i < this.watchedElements.length; i++) {
			this.watchedElements[i].tickActions(); // tick watched elements
		}

		this.counter++;

		if (this.hp <= 0) {
			this.die();
		}
	};

	this.cleanUpMovement = function() {
		this.turnCounter = 0;
	};
};

Enemy.prototype = new ComplexObject;
Enemy.prototype.constructor = Enemy;