
/**
 * Class with behavior and attributes for players
 * @param {number} x initial x-coordinate
 * @param {number} y initial y-coordinate
 * @param {number} initiative
 * @constructor
 */
var Player = function(x, y, initiative) {
	this.x = x; // now im thinking that maybe we should instead change these to map grid coordinates
	this.y = y; // now im thinking that maybe we should instead change these to map grid coordinates
	this.initiative = initiative; // this is a skill used for determining player turn in default advanceturn.js
	this.moveSpeed = 4; // sort of useless stat, how fast they move on the map (px/frame)
	this.attackSpeed = 1; // skill that determines how many attacks you can make in a single turn
	//Scout is skill affecting how hard it is for enemies to detect player, and how far player can see/move
	this.turnCounter = 0;
	this.level = 1;
	this.xp = 0;
	this.hp = 100 * this.level;
	this.maxHP = this.hp;
	this.skillPoints = 1;
	this.attack = 2;
	this.actionMenu = {};
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
				"next": "spin-left",
				"speed": .1
			},
			"spin-right": {
				"frames": [0, 4, 12, 8],
				"next": "spin-right",
				"speed": .1
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
	this.animations.x = this.x;
	this.animations.y = this.y;
	this.watchedElements = [];

	var slashSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("slash")],
		"frames": {
			"width": 3, "height": 3, "count": 4
		},
		"animations": {
			"slash": {
				"frames" : [0, 1, 2, 3],
				"next" : "slash",
				"speed" : 0.5
			}
		}
	});

	this.attackAnimation = new createjs.Sprite(slashSpriteSheet, "slash");
	this.attackAnimation.scaleX = 2;
	this.attackAnimation.scaleY = 2;

	var playerName = "Player"; // The name of the player, right now is only used when declaring the winner.

	// add our animations to global gamestage:
	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * Run on each frame rendering in main loop
	 */
	this.tickActions = function() {

	};

	//
	var attackTarget = null;

	/**
	 * Removes the player from the map, gives a gameover screen if no players are left alive
	 */
	this.die = function() {
		this.animations.gotoAndPlay("spin-right");
		setTimeout(function() {
			renderer.activeObjectsContainer.removeChild(this.animations);
		}.bind(this), 1000);

		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] === this) {
				activeObjects.splice(i, 1);
				return;
			}
		}
	};

	/**
	 * Reduces Player's HP by the amount of damage received. If player's hp is reduced to 0, they die.
	 * If no players are left alive, then the game is over.
 	 * @param  {Object} attackingObject
	 */
	this.receiveDamage = function(attackingObject) {
		this.hp -= attackingObject.attack;

		if (this.hp <= 0){
			this.die();
		}

		alivePlayers = 0;
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				alivePlayers++;
			}
		}

		if (alivePlayers == 0){
			customAlert(function(){
				location.reload();
			},"you lost");
		}

	};

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
			clickSprite.x = x - renderer.container.x;
			clickSprite.y = y - renderer.container.y;

			var clickedEnemy = null;

			for (var i = 0; i < activeObjects.length; i++) {
				if (activeObjects[i] instanceof Player) {
					continue;
				}

				if (collisionSystem.simpleCollision(clickSprite, activeObjects[i])) {
					clickedEnemy = activeObjects[i];

					// reference for attack sprite
					attackTarget = activeObjects[i];
					break;
				}
			}

			renderer.moveObjectTo(this, x, y - 16, true);
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
	 * Menu that displays player stats and lets the player use skill points
	 * to increase the three main stats, Initiative, Attack Speed, and Scout.
	 */
	this.createStatsForm = function() {
		var fields = [{
				text: '+Initiative: '+this.initiative,
				type: 'button',
				callback: function() {
					if (this.skillPoints > 0){
						this.skillPoints -= 1;
						this.initiative += 1;
						statsMenu.destroy();
						this.createStatsForm();
					}
				}.bind(this)
			},
			{
				text: '+Attack Speed: '+this.attackSpeed,
				type: 'button',
				callback: function() {
					if (this.skillPoints > 0){
						this.skillPoints -= 1;
						this.attackSpeed += 1;
						statsMenu.destroy();
						this.createStatsForm();
					}
				}.bind(this)
			},
			{
				text: '+Scout: '+this.scout,
				type: 'button',
				callback: function() {
					if (this.skillPoints > 0){
						this.skillPoints -= 1;
						this.scout += 1;
						statsMenu.destroy();
						this.createStatsForm();
					}
				}.bind(this)
			},{
				text: 'close',
				type: 'button',
				callback: function() {
					statsMenu.destroy();
				}
			}
			];
		var options = {
				message:this.getName()+' has '+this.skillPoints+' Skill Points to spend.\nHP: '
				      +this.hp+'   Attack: '+this.attack+'   Level: '+this.level+'   XP: '+this.xp+'   Next Level: '
				      +(this.levelUpThreshold()-this.xp)
		}
		var statsMenu = new Form(0,0,fields, options);
		statsMenu.render();
	};

	/**
	 * Click handler for move
	 * @param  {MouseEvent} event
	 */
	var moveClickHandler = function(event) {
		var x = event.pageX / gamezoom;
		var y = event.pageY / gamezoom;

		var collisionCoordinate = collisionSystem.getCollisionCoordinateFromCell(x, y);
		if (isSelectionInSelectableBounds(this, x, y) && collisionSystem.checkCellValidForObject(collisionCoordinate)) {
			renderer.moveObjectTo(this, x, y - 16, true);
			removeSelectableArea();
			// renderer.activeObjectsContainer.removeChild(this.mouseMoveSprite);
			document.getElementById("gamecanvas").removeEventListener('click', moveClickHandler, false);
		}
	};
	moveClickHandler = moveClickHandler.bind(this);

	/**
	 * Clickhandler for mousemove
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
			// renderer.activeObjectsContainer.addChild(this.mouseMoveSprite);
		}

		var collisionCoordinate = collisionSystem.getCollisionCoordinateFromCell(x - renderer.container.x - renderer.container.x % 16, y - renderer.container.y - renderer.container.y % 16);
		if (isSelectionInSelectableBounds(this, x, y) && collisionSystem.checkCellValidForObject(collisionCoordinate)) {
			this.mouseMoveSprite.gotoAndPlay("valid");
		} else {
			this.mouseMoveSprite.gotoAndPlay("invalid");
		}

		this.mouseMoveSprite.x = x + renderer.container.x % 16;
		this.mouseMoveSprite.y = y + renderer.container.y % 16;
	};
	mouseMoveHandler = mouseMoveHandler.bind(this);

	/**
	 * [updatePlayerUI Updates the UI that displays the current player's name and health.]
	 */
	this.updatePlayerUI = function() {
		$('#currentPlayer').html(this.getName() + '\'s Turn!');
		var percentHealth = this.hp / this.maxHP;
		$('#health').val(percentHealth * 100);
		$('#currentScore').html('Score: ' + this.getScore());
	};

	/**
	 * Code that gets called when it's the players turn. Initializes the player's action menu
	 */
	this.turn = function() {
		this.updatePlayerUI();
		this.currentDirection = "";
		this.lastFrameDirection = "";

		playerTurn = true;
		this.totalTurns++;
		renderer.centerMapOnObject(this, function() {
			this.actionMenu = new Form((this.animations.x + this.animations.spriteSheet._frameWidth + 8 - renderer.gamestage.x) * gamezoom, (this.animations.y + renderer.gamestage.y) * gamezoom, [{
					text: 'Move',
					key: "m",
					type: 'button',
					callback: function() {
						document.getElementById("gamecanvas").addEventListener('click', moveClickHandler, false);
						if (this.mouseMoveSprite) {
							// renderer.activeObjectsContainer.addChild(this.mouseMoveSprite);
						}
						$("body").mousemove(mouseMoveHandler);
						this.actionMenu.destroy();
					}.bind(this) // binding this because i want to be able to access the this.mouseMoveSprite variable
				}, {
					text: 'Attack',
					key: "a",
					type: 'button',
					callback: function() {
						document.getElementById("gamecanvas").addEventListener('click', attackClickHandler, false);
						if (this.mouseMoveSprite) {
							// renderer.activeObjectsContainer.addChild(this.mouseMoveSprite);
						}
						$("body").mousemove(mouseMoveHandler);
						this.actionMenu.destroy();
					}.bind(this) // binding this because i want to be able to access the this.mouseMoveSprite variable
				}, {
					text: 'Skills',
					key: "s",
					type: 'button',
					callback: function() {
						this.createStatsForm();

					}.bind(this)
				}

				], {cssClass:'playerActions'});
			this.actionMenu.render();
			showSelectableArea(this);
		}.bind(this));
	};



	var removeAttackAnimation = function() {
		renderer.activeObjectsContainer.removeChild(this.attackAnimation);

	}.bind(this);


	/**
	 * Resets animation position and turn counter
	 */
	this.cleanUpMovement = function() {
		if(attackTarget) {
			renderer.activeObjectsContainer.addChild(this.attackAnimation);
			this.attackAnimation.x = attackTarget.x + attackTarget.animations.x;
			this.attackAnimation.y = attackTarget.y + attackTarget.animations.y;
			attackTarget = null;
			setTimeout(removeAttackAnimation, 1000);
		}

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
	 * Calculates and returns the player's current score.
	 * @return {number} The player's current score
	 */
	this.getScore = function() {
		var turnScore = 100 - this.totalTurns;

		if (turnScore < 1)
			turnScore = 1;

		return this.xp * turnScore;
	}

	/*
	 * Determines how much XP the player needs to level up
	 * @return {integer} amount of xp needed to level up
	 */
	this.levelUpThreshold = function() {
		return 500*((this.level*this.level)/2);
	};

	/**
	 * Gives the player amount of xp, and then levels them up if they have passed a certain threshold
	 * @param {int} amount How much XP the player gets
	 */
	this.gainXP = function(amount) {
		this.xp += amount;
		if (this.xp >= this.levelUpThreshold()) {
			this.level += 1;
			this.skillPoints += 2;
			this.hp = 100 + (5 * this.level / 2); //Players automatically get reset back to full hp plus a little bit
			this.attack += 1; //Players start to hit harder as they level up
		};
	};
};

Player.prototype = new Person;
Player.prototype.constructor = Player;
