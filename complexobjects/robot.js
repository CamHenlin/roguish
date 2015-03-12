/**
 * Class that defines the attributes of a robot Enemy
 * @param {number} x     Initial x position
 * @param {number} y     Initial y position
 * @param {number} level Initial level
 * @constructor
 */
var Robot = function(x, y, level) {
	Enemy.call(this, x, y, level); // Call super constructor

	this.attackSpeed = 2;
	this.movementSpeed = 10;
	this.moveLength = 2;
	this.attack = level + 5;
	this.defense = level - 15;
	this.hp = 1*level;

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

	this.animations.addChild(this.sprite, this.healthBar);
	renderer.activeObjectsContainer.addChild(this.animations);


	/**
	 * Updates the robot's animation based on what direction it is moving
	 * @param  {number} deltax Robot's movement on the x-axis
	 * @param  {number} deltay Robot's movement on the y-axis
	 */
	this.updateMovementAnimation = function(deltax, deltay) {
		if (deltax > 0 && this.lastFrameDirection !== "walk-right") {
			this.lastFrameDirection = "walk-right";
		} else if (deltax < 0 && this.lastFrameDirection !== "walk-left") {
			this.lastFrameDirection = "walk-left";
		}
	};

	/**
	 * Function that is called when the robot is done moving
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
		this.sprite.gotoAndPlay("still");
	};
};

Robot.prototype = new Enemy;
Robot.prototype.constructor = Robot;