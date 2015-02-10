/**
 * [Player class]
 * @param {[type]} x [description]
 * @param {[type]} y [description]
 */
var Player = function(x, y) {
	this.x = x; // maybe we don't bother with this and simply use animation x,y instead
	this.y = y; // maybe we don't bother with this and simply use animation x,y instead
	this.spriteSheet =  new createjs.SpriteSheet({
		"images": [loader.getResult("player")],
		"frames": {
			"width": 32,
			"height": 32,
			"count": 1
		},
		"animations": {
			"stand": {
				"frames": [0],
				"next": "stand",
				"speed": 1
			}
		}
	});
	this.animations = new createjs.Sprite(this.spriteSheet, "stand"); // change the second string to an animation from the spritesheet
	this.animations.x = this.x;
	this.animations.y = this.y;
	this.watchedElements = [];

	// private counter variable
	var counter = 0;

	// add our animations to global gamestage:
	gamestage.addChild(this.animations);

	/**
	 * [tickActions run on each frame rendering in main loop]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {
		// check and make sure any children of the player get ticked
		for (var i = 0; i < this.watchedElements.length; i++) {
			this.watchedElements[i].tickActions();
		}

		// just a player movement demo:
		counter++;
		this.animations.x += Math.sin((counter % 60) / 60 - 1/2);
	};
};