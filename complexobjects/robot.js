/**
 * [Robot description]
 * @param {[type]} x     [description]
 * @param {[type]} y     [description]
 * @param {[type]} level [description]
 */
var Robot = function(x, y, level) {
	Enemy.call(this, x, y, level); // Call super constructor

	this.attackSpeed = level * 2;
	this.movementSpeed = 50;
	this.attack = level + 15;
	this.defense = level - 15;

	if (this.defense < 1)
		this.defense = 1;

	this.spriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("robot")],
		"frames": {
			"width": 28,
			"height": 30,
			"count": 5
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 1
			},

			"attack": {
				"frames": [0, 1, 2, 3, 4],
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
	 * [getNearestPlayer description]
	 * @return {[type]} [description]
	 */
	this.getNearestPlayer = function() {
		var leastDistance = -1;
		var nearestPlayer;

		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				var dx = Math.abs(activeObjects[i].x - this.x);
				var dy = Math.abs(activeObjects[i].y - this.y);
				var distance = dy + dx;

				if (leastDistance == -1 || leastDistance > distance) {
					leastDistance = distance;
					nearestPlayer = activeObjects[i];
				}
			}
		}

		return nearestPlayer;
	};

	/**
	 * [moveUpOrDown decides whether robot should move up or down based on nearest player location]
	 * @private
	 * @param {[type]} [dy] [difference between nearest player's y position and this robot's y position]
	 * @return [true if move succeeded, false otherwise]
	 */
	function moveUpOrDown(dy) {
		if (dy >= 0) {
			return renderer.moveObjectTo(this, x, y + this.movementSpeed); // Move down
		}

		return renderer.moveObjectTo(this, x, y - this.movementSpeed); // Move up
	};

	/**
	 * [moveRightOrLeft decides whether robot should move right or left based on nearest player location]
	 * @private
	 * @param {[type]} [dx] [difference between nearest player's x position and this robot's x position]
	 * @return [true if move succeeded, false otherwise]
	 */
	function moveRightOrLeft(dx) {
		if (dx >= 0) {
			return renderer.moveObjectTo(this, x + this.movementSpeed, y); // move right
		}

		return renderer.moveObjectTo(this, x - this.movementSpeed, y); // move left
	};

	/**
	 * [doMovement description]
	 * @return {[type]} [description]
	 */
	this.doMovement = function() {
		this.animations.gotoAndPlay("attack");

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
	 * [updateMovementAnimation description]
	 * @param  {[type]} deltax [description]
	 * @param  {[type]} deltay [description]
	 * @return {[type]}        [description]
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

	this.cleanUpMovement = function() {
		this.turnCounter = 0;
		this.animations.gotoAndPlay("still");
	};
};

Robot.prototype = new Enemy;
Robot.prototype.constructor = Robot;