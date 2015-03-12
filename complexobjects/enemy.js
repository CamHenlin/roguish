

/**
 * Base class of an enemy. All enemies will extend this class
 * @param {number} x     Initial x position of enemy
 * @param {number} y     Initial y position of enemy
 * @param {number} level Initial level of enemy
 * @constructor
 */
var Enemy = function(x, y, level) {
	this.x = x;  // x position on canvas
	this.y = y;  // y position on canvas
	this.level = level;
	this.hp = 10 * level;
	this.xp = 100 * level;
	this.movementSpeed = level * 25;
	this.attackSpeed = 1;
	this.attack = level;
	this.defense = level;
	this.scout = level * 1.25;
	this.magic = level;
	this.initiative = 10;
	this.vision = 1; //How far the enemy can see, way of approximating how far an enemy can move in a turn.
	this.turnCounter = 0;  // Determines when the enemy should perform its turn
	this.watchedElements = [];
	this.counter = 0;
	this.moveSpeed = 4;         // How fast the enemy moves on the screen.
								// moveSpeed is different from movementSpeed as movementSpeed determines how far
								// the enemy moves per turn.

	var maxHp = this.hp; // never changes once initialized

	this.healthBarMaxWidth = 18;
	this.healthBar = new createjs.Bitmap("../graphics/health_bar.png");
	this.healthBar.scaleX = this.healthBarMaxWidth / this.healthBar.image.width;
	this.healthBar.x = this.x;
	this.healthBar.y = this.y - 5;

	/**
	 * Enemy moves towards the nearest player, and then attacks
	 */
	this.doTurn = function() {

		//First the enemy moves near the player
		this.sprite.gotoAndPlay("move");

		var nearestPlayer = this.getNearestPlayer();
		if (!nearestPlayer) {
			return;
		}

		renderer.moveObjectTo(this,nearestPlayer.animations.x-1,nearestPlayer.animations.y-1);

		//Then the enemy attacks the player
		calculateDamage(this,nearestPlayer);

	};

	/**
	 * Finds the player on the gamestage that is closest to this enemy
	 * @return {Player} The nearest player to this enemy
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
	 * turn code that gets called when it's the enemy's turn
	 */
	this.turn = function() {
		if (!this.isWithinMaxDistance()) {
			this.turnCounter = 0;
			return;
		}
		this.doTurn();
		this.turnCounter = 0;
	};

	/**
	 * Checks whether or not the enemy is within the max distance from a player
	 * @return {Boolean}
	 */
	this.isWithinMaxDistance = function() {
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				var dx = Math.abs(activeObjects[i].x - this.x);
				var dy = Math.abs(activeObjects[i].y - this.y);
				var distance = Math.sqrt(dy + dx);
				if (distance < Math.max(MAX_ENEMY_DISTANCE-activeObjects[i].scout+this.vision,MIN_ENEMY_DISTANCE)) {
					return true;
				}
			}
		}
		return false;
	};

	/**
	 * Reduces this enemy's hp by the amount of damage received and updates health bar
 	 * @param  {Object} attackingObject
	 */
	this.receiveDamage = function(attackingObject) {
		this.hp -= attackingObject.attack;

		if (this.hp <= 0) {
			attackingObject.gainXP(this.xp);
			this.die();
			return;
		}

		var newHealthBarWidth = this.healthBarMaxWidth * (this.hp / maxHp);

		if (this.hp / maxHp < 0.2) { // less than 20% hp, make the health bar red
			this.animations.removeChild(this.healthBar);
			this.healthBar = new createjs.Bitmap("../graphics/health_bar_red.png");
			this.healthBar.x = this.x;
			this.healthBar.y = this.y - 5;
			this.animations.addChild(this.healthBar);
		}

		if (newHealthBarWidth === 0) {
			newHealthBarWidth = 1;
		}

		this.healthBar.scaleX = newHealthBarWidth / this.healthBar.image.width;
	};

	/**
	 * Kills this enemy, removing the enemy from activeObjects and the gamestage
	 */
	this.die = function() {
		renderer.activeObjectsContainer.removeChild(this.animations);
		var index = activeObjects.indexOf(this);

		if (index > -1) {
			activeObjects.splice(index, 1);
		}
	};

	/**
	 * Keeps track of watchedElements and what the enemy should be doing
	 */
	this.tickActions = function() {
		for (var i = 0; i < this.watchedElements.length; i++) {
			this.watchedElements[i].tickActions(); // tick watched elements
		}

		this.counter++;
	};

	/**
	 * Gets called after enemy has finished moving
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
	};
};

Enemy.prototype = new ComplexObject;
Enemy.prototype.constructor = Enemy;