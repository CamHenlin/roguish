/**
 * [Robot Class that defines the attributes of a robot Enemy]
 * @param {[type]} x     [Initial x position]
 * @param {[type]} y     [Initial y position]
 * @param {[type]} level [Initial level]
 * @constructor
 */
var Robot = function(x, y, level) {
	Enemy.call(this, x, y, level); // Call super constructor

	this.attackSpeed = level * 2;
	this.movementSpeed = 100;
	this.attack = level + 15;
	this.defense = level - 15;
	this.health = 5;

	if (this.defense < 1) {
		this.defense = 1;
	}

	this.spriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("robot")],
		"frames": {
			"width": 14,
			"height": 16,
			"count": 5
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 1
			},
			"move": {
				"frames": [0, 1, 2],
				"next": "move",
				"speed": 1
			},

			"attack": {
				"frames": [3, 4],
				"next": "attack",
				"speed": 1
			}
		}
	});

	this.animations = new createjs.Sprite(this.spriteSheet, "still");
	this.animations.x = this.x;
	this.animations.y = this.y;
	this.animations.regX = 14;   // The middle of each frame on the x-axis in pixels, used for flipping the image.

	gamestage.addChild(this.animations);

	/**
	 * [moveUpOrDown decides whether robot should move up or down based on nearest player location]
	 * @private
	 * @param {[type]} [dy] [difference between nearest player's y position and this robot's y position]
	 * @return [true if move succeeded, false otherwise]
	 */
	function moveUpOrDown(dy) {
		if (dy >= 0) {
			return renderer.moveObjectTo(this, x, y + this.movementSpeed, false); // Move down
		}

		return renderer.moveObjectTo(this, x, y - this.movementSpeed, false); // Move up
	};

	/**
	 * [moveRightOrLeft decides whether robot should move right or left based on nearest player location]
	 * @private
	 * @param {[type]} [dx] [difference between nearest player's x position and this robot's x position]
	 * @return [true if move succeeded, false otherwise]
	 */
	function moveRightOrLeft(dx) {
		if (dx >= 0) {
			return renderer.moveObjectTo(this, x + this.movementSpeed, y, false); // move right
		}

		return renderer.moveObjectTo(this, x - this.movementSpeed, y, false); // move left
	};

	/**
	 * [doMovement Robots move towards the nearest player]
	 */
	this.doMovement = function() {
		this.animations.gotoAndPlay("move");

		var nearestPlayer = this.getNearestPlayer();

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
	 * [updateMovementAnimation Updates the robot's animation based on what direction it is moving]
	 * @param  {[type]} deltax [Robot's movement on the x-axis]
	 * @param  {[type]} deltay [Robot's movement on the y-axis]
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
	 * [cleanUpMovement Function that is called when the robot is done moving]
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
		this.animations.gotoAndPlay("still");
	};
};

Robot.prototype = new Enemy;
Robot.prototype.constructor = Robot;