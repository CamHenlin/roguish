/**
 * [EndGame Simple object that ends the game and declares the player that collides with it the winner.]
 * @param {[type]} x [x position on canvas]
 * @param {[type]} y [y position on canvas]
 * @constructor
 */
var EndGame = function(x, y) {
	SimpleObject.call(this, x, y);

	this.spriteSheet = new createjs.SpriteSheet({  // treasure chest sprite sheet
		"images": [loader.getResult("chest")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 2
		},
		"animations": {
			"open": {
				"frames": [0],
				"next": "open",
				"speed": 1
			},

			"closed": {
				"frames": [1],
				"next": "closed",
				"speed": 1
			}
		}
	});

	this.animations = new createjs.Sprite(this.spriteSheet, "closed");

	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * [endGame Ends the game by displaying a dialog notifying who won and a button to click to play again]
	 * @param  {[type]} winner [Reference to a Player object, the player who won.]
	 */
	this.endGame = function(winner) {
		this.animations.gotoAndPlay("open");

		var endMenu = new Form(gamestage.canvas.width / 2, gamestage.canvas.height / 2, [{  // build menu
			text: winner.getName() + " has won the game!",
			type: "basic-text",
			callback: function() {
			}
		}, {
			text: "Play Again!",
			type: "button",
			callback: function() {
				endMenu.destroy();
				init();
			}
		}]);

		endMenu.render();
		gameOver = true;
	};

	/**
	 * [tickActions Updates the state of this object, checking to see if a player has collided with it.]
	 */
	this.tickActions = function() {
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				var player = activeObjects[i];

				if (player.x + player.animations.spriteSheet._frameWidth > this.x && player.x < this.x + this.animations.spriteSheet._frameWidth) {        // Check player collision
					if (player.y + player.animations.spriteSheet._frameHeight > this.y && player.y < this.y + this.animations.spriteSheet._frameHeight) {
						this.endGame(player);
					}
				}
			}
		}
	};
};

EndGame.prototype = new SimpleObject;   // Extends SimpleObject
EndGame.prototype.constructor = EndGame;