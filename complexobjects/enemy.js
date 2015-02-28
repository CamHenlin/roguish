

/**
 * [Enemy Base class of an enemy. All enemies will extend this class]
 * @param {[type]} x     [Initial x position of enemy]
 * @param {[type]} y     [Initial y position of enemy]
 * @param {[type]} level [Initial level of enemy]
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
	this.scout = level * 1.25;
	this.magic = level;
	this.initiative = 10;
	this.turnCounter = 0;  // Determines when the enemy should perform its turn
	this.watchedElements = [];
	this.counter = 0;
	this.moveSpeed = 4;         // How fast the enemy moves on the screen.
								// moveSpeed is different from movementSpeed as movementSpeed determines how far
								// the enemy moves per turn.

	/**
	 * [doMovement This function will be inherited by child classes that handle how the enemy moves]
	 */
	this.doMovement = function() {
	};

	/**
	 * [getNearestPlayer Finds the player on the gamestage that is closest to this enemy]
	 * @return {[Player]} [The nearest player to this enemy]
	 */
	this.getNearestPlayer = function() {
		var leastDistance = -1;
		var nearestPlayer;

		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				var dx = Math.abs(activeObjects[i].x - this.x);
				var dy = Math.abs(activeObjects[i].y - this.y);
				var distance = dy + dx;

				if (leastDistance === -1 || leastDistance > distance) {
					leastDistance = distance;
					nearestPlayer = activeObjects[i];
				}
			}
		}

		return nearestPlayer;
	};

	/**
	 * [turn code that gets called when it's the enemy's turn]
	 * @return {[type]} [description]
	 */
	this.turn = function() {
		if (!this.isWithinMaxDistance()) {
			return;
		}

		this.doMovement();
	};

	/**
	 * [isWithinMaxDistance checks whether or not the enemy is within the max distance from a player]
	 * @return {Boolean} [description]
	 */
	this.isWithinMaxDistance = function() {
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i].constructor === Player) {
				var dx = Math.abs(activeObjects[i].x - this.x);
				var dy = Math.abs(activeObjects[i].y - this.y);
				var distance = Math.sqrt(dy + dx);

				if (distance < MAX_ENEMY_DISTANCE) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * [die Kills this enemy, removing the enemy from activeObjects and the gamestage]
	 */
	this.die = function() {
		renderer.activeObjectsContainer.removeChild(this.animations);
		var index = activeObjects.indexOf(this);

		if (index > -1) {
			activeObjects.splice(index, 1);
		}

		console.log("enemy has died");
	};

	/**
	 * [tickActions Keeps track of watchedElements and what the enemy should be doing]
	 */
	this.tickActions = function() {
		for (var i = 0; i < this.watchedElements.length; i++) {
			this.watchedElements[i].tickActions(); // tick watched elements
		}

		this.counter++;

		if (this.hp <= 0) {
			this.die();
		}
	};

	/**
	 * [cleanUpMovement Gets called after enemy has finished moving]
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
	};
};

Enemy.prototype = new ComplexObject;
Enemy.prototype.constructor = Enemy;