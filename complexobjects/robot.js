/**
 * Class that defines the attributes of a robot Enemy
 * @param {number} x     Initial x position
 * @param {number} y     Initial y position
 * @param {number} level Initial level
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

	this.animations = new createjs.Container();

	this.sprite = new createjs.Sprite(this.spriteSheet, "still");
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.regX = 14;   // The middle of each frame on the x-axis in pixels, used for flipping the image.

	this.animations.addChild(this.sprite, this.healthBar);
	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * Decides whether robot should move up or down based on nearest player location
	 * @private
	 * @param {number} dy difference between nearest player's y position and this robot's y position
	 * @return {boolean} true if move succeeded, false otherwise
	 */
	function moveUpOrDown(dy) {
		if (dy >= 0) {
			return renderer.moveObjectTo(this, x, y + this.movementSpeed, false); // Move down
		}

		return renderer.moveObjectTo(this, x, y - this.movementSpeed, false); // Move up
	};

	/**
	 * Decides whether robot should move right or left based on nearest player location
	 * @private
	 * @param {number} dx difference between nearest player's x position and this robot's x position
	 * @return {boolean} true if move succeeded, false otherwise
	 */
	function moveRightOrLeft(dx) {
		if (dx >= 0) {
			return renderer.moveObjectTo(this, x + this.movementSpeed, y, false); // move right
		}

		return renderer.moveObjectTo(this, x - this.movementSpeed, y, false); // move left
	};

	/**
	 * Robots move towards the nearest player
	 */
	this.doMovement = function() {
		this.animations.gotoAndPlay("move");

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
	 * Updates the robot's animation based on what direction it is moving
	 * @param  {number} deltax Robot's movement on the x-axis
	 * @param  {number} deltay Robot's movement on the y-axis
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
	 * Function that is called when the robot is done moving
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
		this.animations.gotoAndPlay("still");
	};
};

Robot.prototype = new Enemy;
Robot.prototype.constructor = Robot;