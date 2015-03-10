
/**
 * Base class for complex objects. Objects which move on the map such as enemies will inherit this class.
 * @constructor
 */
var ComplexObject = function() {
	
	this.animations;
	this.currentDirection = "";
	this.lastFrameDirection = "";

	/**
	 * abstract method for updating movement animation
	 * @param  {number} deltax 
	 * @param  {number} deltay
	 * @abstract
	 */
	this.updateMovementAnimation = function(deltax, deltay) {
	};
};