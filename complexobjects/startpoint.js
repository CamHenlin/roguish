/**
 * @name  StartPoint
 * @class
 */

/**
 * StartPoint
 * @constructor
 */
var StartPoint = function(x, y) {
	this.x = x;
	this.y = y;
	this.spriteSheet = new createjs.SpriteSheet({  // set sprite for the dragon
		"images": [loader.getResult("starttile")],
		"frames": {
			"width": 16,
			"height": 24,
			"count": 1
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 0
			}
		}
	});


	this.animations = new createjs.Sprite(this.spriteSheet, "still"); // change the second string to an animation from the spritesheet
	this.animations.x = this.x;
	this.animations.y = this.y - 8;

	// add our animations to global gamestage:
	renderer.activeObjectsContainer.addChild(this.animations);

	startPoint = {'x': x, 'y': y};
};

StartPoint.prototype = new ComplexObject;
StartPoint.prototype.constructor = StartPoint;

