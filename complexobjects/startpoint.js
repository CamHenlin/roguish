/**
 * [StartPoint description]
 * @param {number} x     x-position
 * @param {number} y     y-position
 * @param {number} startPointNumber 
 */
var StartPoint = function(x, y, startPointNumber) {
	this.x = x;
	this.y = y;
	this.startPointNumber = startPointNumber;
	this.spriteSheet = new createjs.SpriteSheet({  
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
	activeObjects.push(this);

	// add our animations to global gamestage:
	renderer.activeObjectsContainer.addChild(this.animations);

	startPoint = {'x': x, 'y': y};

	this.tickActions = function() {};
};

StartPoint.prototype = new ComplexObject;
StartPoint.prototype.constructor = StartPoint;

