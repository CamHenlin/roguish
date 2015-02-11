/**
 * [Player class]
 * @param {[type]} x [description]
 * @param {[type]} y [description]
 */
var Player = function(x, y) {
	this.x = x; // now im thinking that maybe we should instead change these to map grid coordinates
	this.y = y; // now im thinking that maybe we should instead change these to map grid coordinates
	this.initiative = 1; // this is a statistic used for determining player turn in default playerturn.js
	this.moveSpeed = 4; // sort of useless stat, how fast they move on the map (px/frame).
	this.turnCounter = 0;
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
			},
			"walking": {
				"frames": [0],
				"next": "walking",
				"speed": 1
			}
		}
	});
	this.animations = new createjs.Sprite(this.spriteSheet, "stand"); // change the second string to an animation from the spritesheet
	this.animations.x = this.x;
	this.animations.y = this.y;
	this.watchedElements = [];

	// add our animations to global gamestage:
	gamestage.addChild(this.animations);

	/**
	 * [tickActions run on each frame rendering in main loop]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {

	};

	/**
	 * [turn code that gets called when it's the players turn. should probably initialize a menu or something]
	 * @return {[type]} [description]
	 */
	this.turn = function() {
		console.log('player turn called');
		renderer.moveTo(this, 600, 600);
	};
};