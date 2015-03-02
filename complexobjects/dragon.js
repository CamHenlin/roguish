/**
 * [Dragon Class that defines the attributes of a dragon Enemy]
 * @param {[type]} x     [Initial x position]
 * @param {[type]} y     [Initial y position]
 * @param {[type]} level [Initial level]
 * @constructor
 */
var Dragon = function(x, y, level) {
	Enemy.call(this, x, y, level); // Call super constructor

	this.movementSpeed = 50 * level; // set attributes unique to a dragon
	this.magic = level + 30;
	this.defense = level * 2;
	this.health = 10;
	this.initiative = 20;
	this.healthBar.x = this.x - 23;

	if (this.defense < 1) {
		this.defense = 1;
	}

	this.spriteSheet = new createjs.SpriteSheet({  // set sprite for the dragon
		"images": [loader.getResult("dragon")],
		"frames": {
			"width": 34,
			"height": 20,
			"count": 3
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 3
			}
		}
	});

	this.animations = new createjs.Container();

	this.sprite = new createjs.Sprite(this.spriteSheet, "still");
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.regX = 33;   // The middle of each frame on the x-axis in pixels, used for flipping the image.

	this.animations.addChild(this.sprite, this.healthBar);

	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * [moveUpOrDown decides whether the dragon should move up or down based on nearest player location]
	 * @private
	 * @param {[type]} [dy] [difference between nearest player's y position and this dragon's y position]
	 * @return [true if move succeeded, false otherwise]
	 */
	function moveUpOrDown(dy) {
		if (dy >= 0) {
			return renderer.moveObjectTo(this, x, y + this.movementSpeed, false); // Move down
		}

		return renderer.moveObjectTo(this, x, y - this.movementSpeed, false); // Move up
	};

	/**
	 * [moveRightOrLeft decides whether the dragon should move right or left based on nearest player location]
	 * @private
	 * @param {[type]} [dx] [difference between nearest player's x position and this dragon's x position]
	 * @return [true if move succeeded, false otherwise]
	 */
	function moveRightOrLeft(dx) {
		if (dx >= 0) {
			return renderer.moveObjectTo(this, x + this.movementSpeed, y, false); // move right
		}

		return renderer.moveObjectTo(this, x - this.movementSpeed, y, false); // move left
	};

	/**
	 * [doMovement Dragons move towards the nearest player]
	 */
	this.doMovement = function() {
		var nearestPlayer = this.getNearestPlayer();
		if (!nearestPlayer) {
			return;
		}

		var dx = nearestPlayer.x - this.x;
		var dy = nearestPlayer.y - this.y;
		var success = false;

		if (Math.abs(dx) > Math.abs(dy)) { // Move right or left
			success = moveRightOrLeft.call(this, dx);

			if (!success) {
				moveUpOrDown.call(this, dy);
			}
		} else {  // Move up or down
			success = moveUpOrDown.call(this, dy);

			if (!success) {
				moveRightOrLeft.call(this, dx);
			}
		}
	};

	/**
	 * [updateMovementAnimation Updates the dragon's animation based on what direction it is moving]
	 * @param  {[type]} deltax [Dragon's movement on the x-axis]
	 * @param  {[type]} deltay [Dragon's movement on the y-axis]
	 */
	this.updateMovementAnimation = function(deltax, deltay) {
		if (deltax > 0 && this.lastFrameDirection !== "walk-right") {
			this.animations.scaleX = 1;
			this.lastFrameDirection = "walk-right";
		} else if (deltax < 0 && this.lastFrameDirection !== "walk-left") {
			this.animations.scaleX = -1;
			this.lastFrameDirection = "walk-left";
		}
	};

	/**
	 * [cleanUpMovement Function that is called when the dragon is done moving]
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
	};
};

Dragon.prototype = new Enemy;
Dragon.prototype.constructor = Dragon;