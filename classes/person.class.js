
/**
 * Base class for players
 * @constructor
 */
var Person = function() {
	this.animations;
	this.currentDirection = "";
	this.lastFrameDirection = "";
	this.scout = DEFAULT_PERSON_SIGHT_DISTANCE;
	this.hp = DEFAULT_PERSON_HEALTH;
	this.attack = DEFAULT_PERSON_ATTACK;
	this.healthBar;

	/**
	 * Updates movement animation 
	 * @param  {number} deltax change in x
	 * @param  {number} deltay change in y
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