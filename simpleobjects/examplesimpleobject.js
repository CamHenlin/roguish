/**
 * ExampleSimpleObject
 * @constructor
 */
var ExampleSimpleObject = function() {
	// I have all the properties of a simple object here
};

ExampleSimpleObject.prototype = new SimpleObject;
ExampleSimpleObject.prototype.constructor = ExampleSimpleObject

