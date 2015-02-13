/**
 * @name  ExampleComplexObject
 * @class
 */

/**
 * ExampleComplexObject
 * @constructor
 */
var ExampleComplexObject = function() {
	// I have all the properties of a complex object here
};

ExampleComplexObject.prototype = new ComplexObject;
ExampleComplexObject.prototype.constructor = ExampleComplexObject

