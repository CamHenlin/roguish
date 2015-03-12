/**
 * Simple object that ends the game and declares the player that collides with it the winner
 * @param {number} x x position on canvas
 * @param {number} y y position on canvas
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

	this.animations = new createjs.Sprite(this.spriteSheet, "open");
	this.animations.x = x;
	this.animations.y = y;
	renderer.activeObjectsContainer.addChild(this.animations);

	this.doMovement = function () {};
	this.getNearestPlayer = function() {};
	this.isWithinMaxDistance = function() {};
	this.receiveDamage = function() {};
	this.die = function() {};
	this.cleanUpMovement = function() {};

	/**
	 * Ends the game by displaying a dialog notifying who won and a button to click to play again
	 * @param  {Player} winner reference to a Player object, the player who reached the treasure chest.
	 */
	this.endGame = function(winner) {
		this.animations.gotoAndPlay("open");

		var winnerScore = winner.getScore() + TREASURE_VALUE;
		var playerWithHighestScore = winner;
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				if (winnerScore < activeObjects[i].getScore()) {
					playerWithHighestScore = activeObjects[i];
					winnerScore = activeObjects[i].getScore();
				}
			}
		}

		var endMenu = new Form([
		{
			text: playerWithHighestScore.getName() + " has won the game with a score of " + winnerScore + "!",
			type: "basic-text",
			callback: function() {
			}
		},
		{
			text: "Play Again!",
			type: "button",
			callback: function() {
				endMenu.destroy();
				window.location.reload();
			}
		},
		{
			text: "Main Menu",
			type: "button",
			callback: function() {
				endMenu.destroy();
				window.location.reload();
			}
		}
		]);

		if (localStorage.highScore === undefined) {
			var hs = [];
			for (var i = 0; i < MAX_HIGH_SCORES; i++) {
				hs.push({name: "<None>", score: 0});
			}

			localStorage.highScore = JSON.stringify(hs);
		}

		var dict = {
			text: "Top 5 Scores:",
			type: "basic-text",
			callback: function() {
			}
		};

		endMenu.fields.splice(1, 0, dict);

		var highScores = JSON.parse(localStorage.highScore);

		for (var i = 0; i < highScores.length; i++) {
			if (winnerScore > highScores[i].score) {
				for (var k = i; k < highScores.length - 1; k++) {
					var swap = highScores[k + 1];
					highScores[k + 1] = highScores[i];
					highScores[i] = swap;
				}

				highScores[i] = {name: playerWithHighestScore.getName(), score: winnerScore};
				break;
			}
		}

		localStorage.highScore = JSON.stringify(highScores);

		for (var i = 0; i < highScores.length; i++) {
			if (highScores[i].name === "<None>") {
				continue;
			}

			var element = {
				text: (i + 1) + ". " + highScores[i].name + ": " + highScores[i].score,
				type: "basic-text",
				callback: function() {}
			};

			endMenu.fields.splice(i + 2, 0, element);
		}

		endMenu.render();
		gameOver = true;
	};

	/**
	 * Updates the state of this object, checking to see if a player has collided with it
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