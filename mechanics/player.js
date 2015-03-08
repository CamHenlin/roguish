
/**
 * Player class
 * @param {number} x initial coordinate
 * @param {number} y initial coordinate
 * @constructor
 */
var Player = function(x, y, initiative) {
	this.x = x; // now im thinking that maybe we should instead change these to map grid coordinates
	this.y = y; // now im thinking that maybe we should instead change these to map grid coordinates
	this.initiative = initiative; // this is a statistic used for determining player turn in default advanceturn.js
	this.moveSpeed = 4; // sort of useless stat, how fast they move on the map (px/frame).
	this.turnCounter = 0;
	this.xp = 1;
	this.totalTurns = 0; // counts how many turns this player has taken.
	this.spriteSheet =  new createjs.SpriteSheet({
		"images": [loader.getResult("player")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 16
		},
		"animations": {
			"stand-front": {
				"frames": [0],
				"next": "stand-front",
				"speed": 1
			},
			"stand-left": {
				"frames": [4],
				"next": "stand-left",
				"speed": 1
			},
			"stand-right": {
				"frames": [8],
				"next": "stand-right",
				"speed": 1
			},
			"stand-back": {
				"frames": [12],
				"next": "stand-back",
				"speed": 1
			},
			"spin-left": {
				"frames": [0, 8, 12, 4],
				"next": "spin",
				"speed": 1
			},
			"spin-right": {
				"frames": [0, 4, 12, 8],
				"next": "spin",
				"speed": 1
			},
			"walk-front": {
				"frames": [1, 2, 3, 2],
				"next": "walk-front",
				"speed": 1
			},
			"walk-left": {
				"frames": [5, 6, 7, 6],
				"next": "walk-left",
				"speed": 1
			},
			"walk-right": {
				"frames": [9, 10, 11, 10],
				"next": "walk-right",
				"speed": 1
			},
			"walk-back": {
				"frames": [13, 14, 15, 14],
				"next": "walk-back",
				"speed": 1
			},
			"run-front": {
				"frames": [1, 3],
				"next": "run-front",
				"speed": 1
			},
			"run-left": {
				"frames": [5, 6, 7, 6],
				"next": "run-left",
				"speed": 3
			},
			"run-right": {
				"frames": [9, 10, 11, 10],
				"next": "run-right",
				"speed": 3
			},
			"run-back": {
				"frames": [13, 15],
				"next": "run-back",
				"speed": 1
			}
		}
	});

	this.animations = new createjs.Sprite(this.spriteSheet, "stand-front"); // change the second string to an animation from the spritesheet
	this.animations.x = this.x + this.animations.spriteSheet._frameWidth / 3;
	this.animations.y = this.y + this.animations.spriteSheet._frameHeight / 2;
	this.watchedElements = [];

	var slashSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("slash")],
		"frames": {
			"width": 3, "height": 3, "count": 4
		},
		"animations": {
			"slash": {
				"frames" : [0,1,2,3],
				"next" : "slash",
				"speed" : .5
			}
		}
	});

	this.attackAnimation = new createjs.Sprite(slashSpriteSheet, "slash");
	//this.attackAnimation.scaleX = .5;
	//this.attackAnimation.scaleY = .5;

	var playerName = "Player"; // The name of the player, right now is only used when declaring the winner.

	// add our animations to global gamestage:
	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * Run on each frame rendering in main loop
	 */
	this.tickActions = function() {

	};

	/**
	 * This returns damage amount for Player's attack, used in calculateDamage()
	 * @return {number} the amount in hp
	 */
	this.attack = 2;

	/**
	 * Click handler for attack
	 * @return {MouseEvent} event
	 */
	var attackClickHandler = function(event) {
		var x = event.pageX / gamezoom;
		var y = event.pageY / gamezoom;

		var collisionCoordinate = collisionSystem.getCollisionCoordinateFromCell(x, y);
		if (isSelectionInSelectableBounds(this, x, y) && collisionSystem.checkCellValidForObject(collisionCoordinate)) {
			var clickEventSpriteSheet = new createjs.SpriteSheet({
				"images": [loader.getResult("player")], // who cares, it's already preloaded
				"frames": {
					"width": 1, "height": 1, "count": 1
				},
				"animations": {
					"exist": {
						"frames" : [0],
						"next" : "exist"
					}
				}
			});
			var clickSprite = new createjs.Sprite(clickEventSpriteSheet, "exist");

			// hack
			clickSprite.x = x;
			clickSprite.y = y;
			console.log(clickSprite);

			var clickedEnemy = null;

			for (var i = 0; i < activeObjects.length; i++) {

				// because enemies are in containers
				var obj2 = activeObjects[i].animations;
				if(obj2 instanceof createjs.Container) obj2 = obj2.children[0];
				if (collisionSystem.simpleCollision(clickSprite, obj2)) {
					if(activeObjects[i] instanceof Enemy) clickedEnemy = activeObjects[i];
					break;
				}
			}

			renderer.moveObjectTo(this, x, y, true);
			document.getElementById("gamecanvas").removeEventListener('click', attackClickHandler, false);
			removeSelectableArea();

			if (!clickedEnemy) {
				return;
			}

			calculateDamage(this, clickedEnemy);

		}
	}
	attackClickHandler = attackClickHandler.bind(this);

	/**
	 * Click handler for move
	 * @param  {MouseEvent} event
	 */
	var moveClickHandler = function(event) {
		var x = event.pageX / gamezoom;
		var y = event.pageY / gamezoom;

		var collisionCoordinate = collisionSystem.getCollisionCoordinateFromCell(x, y);
		if (isSelectionInSelectableBounds(this, x, y) && collisionSystem.checkCellValidForObject(collisionCoordinate)) {
			renderer.moveObjectTo(this, x, y, true);
			removeSelectableArea();
			renderer.activeObjectsContainer.removeChild(this.mouseMoveSprite);
			document.getElementById("gamecanvas").removeEventListener('click', moveClickHandler, false);
		}
	};
	moveClickHandler = moveClickHandler.bind(this);

	/**
	 * [mouseMoveHandler description
	 * @param  {MouseEvent} event
	 */
	var mouseMoveHandler = function(event) {
		if (this !== activePlayer) {
			$("body").unbind("mousemove");
			renderer.activeObjectsContainer.removeChild(this.mouseMoveSprite);
			return;
		}

		var x = (event.pageX / gamezoom) - ((event.pageX / gamezoom) % 16);
		var y = (event.pageY / gamezoom) - ((event.pageY / gamezoom) % 16);

		if (!this.mouseMoveSprite) {
			var mouseMoveEventSpriteSheet = new createjs.SpriteSheet({
				"images": [loader.getResult("validtile")], // who cares, it's already preloaded
				"frames": {
					"width": 16, "height": 16, "count": 2
				},
				"animations": {
					"valid": {
						"frames" : [0],
						"next" : "valid"
					},
					"invalid": {
						"frames" : [1],
						"next" : "invalid"
					}
				}
			});
			this.mouseMoveSprite = new createjs.Sprite(mouseMoveEventSpriteSheet, "exist");

			renderer.activeObjectsContainer.addChild(this.mouseMoveSprite);
		}

		var collisionCoordinate = collisionSystem.getCollisionCoordinateFromCell(x, y);
		if (isSelectionInSelectableBounds(this, x, y) && collisionSystem.checkCellValidForObject(collisionCoordinate)) {
			this.mouseMoveSprite.gotoAndPlay("valid");
		} else {
			this.mouseMoveSprite.gotoAndPlay("invalid");
		}

		this.mouseMoveSprite.x = x;
		this.mouseMoveSprite.y = y;
	};
	mouseMoveHandler = mouseMoveHandler.bind(this);

	/**
	 * Code that gets called when it's the players turn. should probably initialize a menu or something
	 */
	this.turn = function() {
		this.currentDirection = "";
		this.lastFrameDirection = "";

		playerTurn = true;
		this.totalTurns++;
		console.log(this.getName() + '\'s turn called');
		renderer.centerMapOnObject(this, function() {
			var actionMenu = new Form((this.animations.x + this.animations.spriteSheet._frameWidth + 8 - renderer.gamestage.x) * gamezoom, (this.animations.y + renderer.gamestage.y) * gamezoom, [{
					text: 'Move',
					type: 'button',
					callback: function() {
						document.getElementById("gamecanvas").addEventListener('click', moveClickHandler, false);
						if (this.mouseMoveSprite) {
							renderer.activeObjectsContainer.addChild(this.mouseMoveSprite);
						}
						$("body").mousemove(mouseMoveHandler);
						actionMenu.destroy();
					}.bind(this) // binding this because i want to be able to access the this.mouseMoveSprite variable
				}, {
					text: 'Attack',
					type: 'button',
					callback: function() {
						document.getElementById("gamecanvas").addEventListener('click', attackClickHandler, false);
						if (this.mouseMoveSprite) {
							renderer.activeObjectsContainer.addChild(this.mouseMoveSprite);
						}
						$("body").mousemove(mouseMoveHandler);
						actionMenu.destroy();
					}.bind(this) // binding this because i want to be able to access the this.mouseMoveSprite variable
				}], {cssClass:'playerActions'});
			actionMenu.render();
			showSelectableArea(this);
		}.bind(this));
	};

	/**
	 * Resets animation position and turn counter
	 */
	this.cleanUpMovement = function() {
		this.animations.gotoAndPlay("stand-front");
		this.turnCounter = 0;
	};

	/**
	 * Sets the name of the player
	 * @param {string} name The name to be set
	 */
	this.setName = function(name) {
		playerName = name;
	};

	/**
	 * Gets the name of the player
	 * @return {string} The name of the player
	 */
	this.getName = function() {
		return playerName;
	};

	/**
	 * [getScore Calculates and returns the player's current score.]
	 * @return {[type]} [The player's current score]
	 */
	this.getScore = function() {
		var turnScore = 100 - this.totalTurns;

		if (turnScore < 1)
			turnScore = 1;

		return this.xp * turnScore;
	};
};

Player.prototype = new Person;
Player.prototype.constructor = Player;
