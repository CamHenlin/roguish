var Enemy = function(x, y) {
	this.x = x;  // x position on canvas
	this.y = y;  // y position on canvas

	this.spriteSheet =  new createjs.SpriteSheet({
		"images": [loader.getResult("enemy")],
		"frames": {
			"width": 28,
			"height": 30,
			"count": 5
		},
		"animations": {
			"move": {
				"frames": [0, 1, 2, 3, 4],
				"next": "move",
				"speed": 1
			}
		}
	});	

	this.animation = new createjs.Sprite(this.spriteSheet, "move");	
	this.animation.x = this.x;
	this.animation.y = this.y;
	this.animation.regX = 14;   // The middle of each frame on the x-axis in pixels, used for flipping the image.

	this.watchedElements = [];

	var counter = 0;	
	gamestage.addChild(this.animation);

	var dy = 0; // change in y and x respectively, used for movement.
	var dx = 0;
	var SPEED = 1; // constants, I don't know where else I should be declaring these.
	var TURN_RATE = 60;

	/**
	 * Picks a random direction to move every TURN_RATE ticks and updates the current position.
	 */
	this.doMovement = function() {
		if (counter % TURN_RATE == 0) { // pick a new random direction to move in every TURN_RATE ticks
			dx = dy = 0;
			var randomNumber = Math.floor(Math.random() * 4); // Random integer in range [0-3]

			if (randomNumber == 0) {        // Move up
				dy = -SPEED;
			} else if (randomNumber == 1) { // Move down
				dy = SPEED;
			} else if (randomNumber == 2) { // Move right
				dx = SPEED;
				this.animation.scaleX = 1;			
			} else { 						// Move left
				dx = -SPEED;
				this.animation.scaleX = -1;
			}
		}

		this.animation.x += dx;
		this.animation.y += dy;	
	}



	this.tickActions = function() {
		for (var i = 0; i < this.watchedElements.length; i++) {
			this.watchedElements[i].tickActions(); // tick watched elements
		}

		this.doMovement();
		counter++;
	};
};