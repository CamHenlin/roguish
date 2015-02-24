/**
 * @name Person
 * @class
 */

/**
 * Person mainly built to handle walking direction code, but I'm sure we can think of other things people share
 * or maybe rename and use to just handle walking code for all things that walk?
 * @constructor
 */
var Person = function() {
	this.animations;
	this.currentDirection = "";
	this.lastFrameDirection = "";
	this.sightDistance = DEFAULT_PERSON_SIGHT_DISTANCE;
	this.hp = DEFAULT_PERSON_HEALTH;
	this.attack = DEFAULT_PERSON_ATTACK;

	/**
	 * [updateMovementAnimation note that this currently makes assumptions about what animations are available
	 * and should be moved away from doing so]
	 * @param  {[type]} deltax [description]
	 * @param  {[type]} deltay [description]
	 * @return {[type]}        [description]
	 */
	this.updateMovementAnimation = function(deltax, deltay) {
		if (deltax > 0 && this.lastFrameDirection !== "walk-right") {
			this.animations.gotoAndPlay("walk-right");
			this.lastFrameDirection = "walk-right";
		} else if (deltax < 0 && this.lastFrameDirection !== "walk-left") {
			this.animations.gotoAndPlay("walk-left");
			this.lastFrameDirection = "walk-left";
		} else if (deltay > 0 && this.lastFrameDirection !== "walk-front") {
			this.animations.gotoAndPlay("walk-front");
			this.lastFrameDirection = "walk-front";
		} else if (deltay < 0 && this.lastFrameDirection !== "walk-back") {
			this.animations.gotoAndPlay("walk-back");
			this.lastFrameDirection = "walk-back";
		}
	};
};