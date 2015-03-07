/**
 * @name  MapLink
 * @class
 */

/**
 * [MapLink description]
 * @param {[type]} x                [description]
 * @param {[type]} y                [description]
 * @param {[type]} graphic          [description]
 * @param {[type]} link             [description]
 * @param {[type]} startPointNumber [description]
 */
var MapLink = function(x, y, graphic, link, startPointNumber) {
	this.x = x;
	this.y = y;
	this.spriteSheet = new createjs.SpriteSheet({  // set sprite for the dragon
		"images": [loader.getResult(graphic)],
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
	this.animations.y = this.y;
	activeObjects.push(this);

	// add our animations to global gamestage:
	renderer.activeObjectsContainer.addChild(this.animations);

	this.tickActions = function() {};
};

MapLink.prototype = new ComplexObject;
MapLink.prototype.constructor = MapLink;

