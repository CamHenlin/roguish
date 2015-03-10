
/**
 * Base class for all simple objects.
 * @constructor
 */
var SimpleObject = function(x, y) {
	this.x = x;  // x position
	this.y = y;  // y position
	this.spriteSheet; // Sprite sheet for this simple object
	this.animations; // animations loaded from the sprite sheet for drawing
};
