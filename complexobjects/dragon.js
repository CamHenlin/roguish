/**
 * Class that defines the attributes of a dragon Enemy
 * @param {number} x     Initial x position
 * @param {number} y     Initial y position
 * @param {number} level Initial level
 * @constructor
 */
var Dragon = function(x, y, level) {
	Enemy.call(this, x, y, level); // Call super constructor

	this.vision = 4;
	this.attackSpeed = 1;
	this.movementSpeed = 50 * level; // set attributes unique to a dragon
	this.moveLength = 4;
	this.magic = level + 30;
	this.defense = level * 2;
	this.hp = 1*level;
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

	this.animations.addChild(this.sprite, this.healthBar);

	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * Updates the dragon's animation based on what direction it is moving
	 * @param  {number} deltax Dragon's movement on the x-axis
	 * @param  {number} deltay Dragon's movement on the y-axis
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
	 * Function that is called when the dragon is done moving
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
	};
};

Dragon.prototype = new Enemy;
Dragon.prototype.constructor = Dragon;