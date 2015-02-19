var Robot = function(x, y, level) {
	Enemy.call(this, x, y, level); // Call super constructor

	this.attackSpeed = level * 2;
	this.movementSpeed = 50;
	this.attack = level + 15;
	this.defense = level - 15;

	if (this.defense < 1)
		this.defense = 1;

	this.spriteSheet =  new createjs.SpriteSheet({
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
	}

	this.doMovement = function() {
		var nearestPlayer = this.getNearestPlayer();

		var dx = nearestPlayer.x - this.x;
		var dy = nearestPlayer.y - this.y;

		if (Math.abs(dx) > Math.abs(dy)) { // Move right or left
			if (dx >= 0) {  // move right
				renderer.moveObjectTo(this, x + this.movementSpeed, y);
			} else {        // move left
				renderer.moveObjectTo(this, x - this.movementSpeed, y);
			}
		} else {  // Move up or down
			if (dy >= 0) {  // Move down
				renderer.moveObjectTo(this, x, y + this.movementSpeed);
			} else {    // Move up
				renderer.moveObjectTo(this, x, y - this.movementSpeed);
			}
		}
	};

	this.updateMovementAnimation = function(deltax, deltay) {
		if (deltax > 0 && this.lastFrameDirection !== "walk-right") {
			this.animations.scaleX = 1;
			this.lastFrameDirection = "walk-right";
		} else if (deltax < 0 && this.lastFrameDirection !== "walk-left") {
			this.animations.scaleX = -1;
			this.lastFrameDirection = "walk-left";
		}
	};
};

Robot.prototype = new Enemy;
Robot.prototype.constructor = Robot;