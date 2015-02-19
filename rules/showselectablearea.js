/**
 * [updateFogOfWar updates the selectable area around a player]
 * @param  {[type]} playerObject [description]
 * @return {[type]}              [description]
 */
function showSelectableArea(playerObject) {
	var fogOfWarSpriteSheet = new createjs.SpriteSheet({
		"images": [loader.getResult("selectablearea")],
		"frames": {
			"width": 16,
			"height": 16,
			"count": 0
		},
		"animations": {
			"still": {
				"frames": [0],
				"next": "still",
				"speed": 1
			}
		}
	});

	removeSelectableArea();

	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.x + playerObject.animations.spriteSheet._frameWidth / 2, playerObject.y + playerObject.animations.spriteSheet._frameHeight);
	var distance = playerObject.sightDistance;
	//console.log(renderer.fogOfWarGrid);

	for (var i = coordinates.x - distance; i < coordinates.x + distance; i++) {
		for (var j = coordinates.y - distance; j < coordinates.y + distance; j++) {
			var selectableArea = new createjs.Sprite(fogOfWarSpriteSheet);
			selectableArea.x = i * renderer.mapData.tilewidth;
			selectableArea.y = j * renderer.mapData.tileheight;
			renderer.fogOfWarContainer.addChild(selectableArea);
			selectableAreas.push(selectableArea);
		}
	}
}

/**
 * [removeSelectableArea removes selectable area]
 * @return {[type]} [description]
 */
function removeSelectableArea() {
	for (var i = 0; i < selectableAreas.length; i++) {
		renderer.fogOfWarContainer.removeChild(selectableAreas[i]);
	}
	selectableAreas = [];
}