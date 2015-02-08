var ExampleComplexObject = function() {
	// I have all the properties of a simple object here
};

ExampleComplexObject.prototype = new SimpleObject;
ExampleComplexObject.prototype.constructor = ExampleComplexObject

