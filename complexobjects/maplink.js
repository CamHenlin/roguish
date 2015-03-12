
/**
 * [MapLink description]
 * @param {number} x                x-coordinate
 * @param {number} y                y-coordinate
 * @param {string} graphic          manifest ID for graphic
 * @param {string} link             name of JSON file containing link data
 * @param {number} startPointNumber
 */
var MapLink = function(x, y, graphic, link, startPointNumber) {
	this.x = x;
	this.y = y;
	this.link = link;
	this.startPointNumber = startPointNumber;

	this.spriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult(graphic)],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 1
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 0
			}
		}
	});

	this.animations = new createjs.Sprite(this.spriteSheet, "still"); // change the second string to an animation from the spritesheet
	this.animations.x = this.x;
	this.animations.y = this.y;
	activeObjects.push(this);

	// add our animations to global gamestage:
	renderer.activeObjectsContainer.addChild(this.animations);

	/**
	 * Run on each frame rendering in main loop
	 */
	this.tickActions = function() {
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				var player = activeObjects[i];

				if (player.x + player.animations.spriteSheet._frameWidth > this.x && player.x < this.x + this.animations.spriteSheet._frameWidth) {        // Check player collision
					if (player.y + player.animations.spriteSheet._frameHeight > this.y && player.y < this.y + this.animations.spriteSheet._frameHeight) {
						// gather all the players before we empty the active objects
						var players = [];
						for (var j = 0; j < activeObjects.length; j++) {
							if (activeObjects[j] instanceof Player) {
								players.push(activeObjects[j]);
							}
						}

						console.log('resetting activeObjects');
						activeObjects = [];
						renderer.centered = true;

						// load the linked map
						maploader.loadMap(this.link + '.json', function() {
							// find the correct start point for the link
							var linkedStartPoint = {};
							for (j = 0; j < activeObjects.length; j++) {
								if (activeObjects[j] instanceof StartPoint) {
									if (activeObjects[j].startPointNumber === this.startPointNumber) {
										linkedStartPoint = activeObjects[j];
									}
								}
							}

							// add the players near the start point
							for (j = 0; j < players.length; j++) {
								players[j].x = parseInt(startPoint.x) + j * 16;
								players[j].animations.x = parseInt(startPoint.x) - parseInt(startPoint.x) % 16 + j * 16;
								players[j].y = parseInt(startPoint.y) + j * 16;
								players[j].animations.y = parseInt(startPoint.y) - parseInt(startPoint.x) % 16 + j * 16 + 16;

								activeObjects.push(players[j]);
								renderer.activeObjectsContainer.addChild(players[j].animations);
								updateFogOfWar(players[j]);
							}
						}.bind(this));
					}
				}
			}
		}
	};
};

MapLink.prototype = new ComplexObject;
MapLink.prototype.constructor = MapLink;

