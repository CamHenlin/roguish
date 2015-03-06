
/**
 * ComplexObject complex objects that all complex objects inherit from
 * @constructor
 */
var ComplexObject = function() {
	this.animations;
	this.currentDirection = "";
	this.lastFrameDirection = "";

	/**
	 * Note that this currently makes assumptions about what animations are available
	 * and should be moved away from doing so
	 * @param  {number} deltax 
	 * @param  {number} deltay
	 */
	this.updateMovementAnimation = function(deltax, deltay) {
	};
};