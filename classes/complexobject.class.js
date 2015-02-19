/**
 * @name ComplexObject
 * @class
 */

/**
 * ComplexObject complex objects that all complex objects inherit from
 * @constructor
 */
var ComplexObject = function() {
	this.animations;
	this.currentDirection = "";
	this.lastFrameDirection = "";

	/**
	 * [updateMovementAnimation note that this currently makes assumptions about what animations are available
	 * and should be moved away from doing so]
	 * @param  {[type]} deltax [description]
	 * @param  {[type]} deltay [description]
	 * @return {[type]}        [description]
	 */
	this.updateMovementAnimation = function(deltax, deltay) {
	};
};