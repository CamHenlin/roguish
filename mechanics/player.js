/**
 * @name Player
 * @class
 */

/**
 * Player class
 * @param {int} x [initial coordinate]
 * @param {int} y [initial coordinate]
 * @constructor
 */
var Player = function(x, y, initiative) {
	this.x = x; // now im thinking that maybe we should instead change these to map grid coordinates
	this.y = y; // now im thinking that maybe we should instead change these to map grid coordinates
	this.initiative = initiative; // this is a statistic used for determining player turn in default advanceturn.js
	this.moveSpeed = 4; // sort of useless stat, how fast they move on the map (px/frame).
	this.turnCounter = 0;
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

	// add our animations to global gamestage:
	gamestage.addChild(this.animations);

	/**
	 * [tickActions run on each frame rendering in main loop]
	 * @return {[type]} [description]
	 */
	this.tickActions = function() {

	};

	/**
	 * [attackClickHandler click handler for attack]
	 * @return {[type]} [description]
	 */
	var attackClickHandler = function(event) {
		var x = event.pageX / gamezoom;
		var y = event.pageY / gamezoom;

		if (isSelectionInSelectableBounds(this, x, y)) {
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

			clickSprite.x = x;
			clickSprite.y = y;
			console.log(clickSprite);

			var clickedEnemy = null;

			for (var i = 0; i < activeObjects.length; i++) {
				if (collisionSystem.simpleCollision(clickSprite, activeObjects[i])) {
					clickedEnemy = activeObjects[i];
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
	 * [moveClickHandler click handler for move]
	 * @param  {[type]} event [description]
	 * @return {[type]}       [description]
	 */
	var moveClickHandler = function(event) {
		var x = event.pageX / gamezoom;
		var y = event.pageY / gamezoom;

		if (isSelectionInSelectableBounds(this, x, y)) {
			renderer.moveObjectTo(this, x, y, true);
			removeSelectableArea();
			document.getElementById("gamecanvas").removeEventListener('click', moveClickHandler, false);
		}
	};
	moveClickHandler = moveClickHandler.bind(this);

	var mouseMoveHandler = function(event) {
		if (this !== activePlayer) {
			$("body").unbund("mousemove", mouseMoveHandler);
			renderer.gamestage.removeChild(this.mouseMoveSprite);
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

			renderer.gamestage.addChild(this.mouseMoveSprite);
		}

		if (isSelectionInSelectableBounds(this, x, y)) {
			this.mouseMoveSprite.gotoAndPlay("valid");
		} else {
			this.mouseMoveSprite.gotoAndPlay("invalid");
		}

		this.mouseMoveSprite.x = x;
		this.mouseMoveSprite.y = y;
	};
	mouseMoveHandler = mouseMoveHandler.bind(this);

	/**
	 * [turn code that gets called when it's the players turn. should probably initialize a menu or something]
	 * @return {[type]} [description]
	 */
	this.turn = function() {
		this.currentDirection = "";
		this.lastFrameDirection = "";

		playerTurn = true;
		console.log('player turn called');
		renderer.centerMapOnObject(this, function() {
			var actionMenu = new Form((this.animations.x + this.animations.spriteSheet._frameWidth + 8 - renderer.gamestage.x) * gamezoom, (this.animations.y + renderer.gamestage.y) * gamezoom, [{
					text: 'Move',
					type: 'button',
					callback: function() {
						document.getElementById("gamecanvas").addEventListener('click', moveClickHandler, false);
						actionMenu.destroy();
					}
				}, {
					text: 'Attack',
					type: 'button',
					callback: function() {
						document.getElementById("gamecanvas").addEventListener('click', attackClickHandler, false);
						actionMenu.destroy();
					}
				}]);
			actionMenu.render();
			showSelectableArea(this);
			$("body").mousemove(mouseMoveHandler);
		}.bind(this));
	};

	this.cleanUpMovement = function() {
		this.animations.gotoAndPlay("stand-front");
		this.turnCounter = 0;
	};
};

Player.prototype = new Person;
Player.prototype.constructor = Player;
