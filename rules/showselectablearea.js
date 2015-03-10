/**
 * Updates the selectable area around a player
 * @param  {Player} playerObject
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

	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.x, playerObject.y + 16);
	var distance = playerObject.scout;
	renderer.fogOfWarContainer.uncache();

	for (var i = Math.floor(coordinates.x - distance); i < coordinates.x + distance; i++) {
		for (var j = Math.floor(coordinates.y - distance); j < coordinates.y + distance; j++) {
			var deltax = Math.pow(Math.abs(coordinates.x - i), 2);
			var deltay = Math.pow(Math.abs(coordinates.y - j), 2);

			if (Math.sqrt(deltax + deltay) < distance) {
				var selectableArea = new createjs.Sprite(fogOfWarSpriteSheet);
				selectableArea.x = i * renderer.mapData.tilewidth;
				selectableArea.y = j * renderer.mapData.tileheight;
				renderer.fogOfWarContainer.addChild(selectableArea);
				selectableAreas.push(selectableArea);
			}
		}
	}

	renderer.beginCaching(renderer.fogOfWarContainer);
}

/**
 * Removes selectable area
 */
function removeSelectableArea() {
	renderer.fogOfWarContainer.uncache();
	for (var i = 0; i < selectableAreas.length; i++) {
		renderer.fogOfWarContainer.removeChild(selectableAreas[i]);
	}
	selectableAreas = [];
	renderer.beginCaching(renderer.fogOfWarContainer);
}

/**
 * True if selection location is in selectable area bounds
 * @param  {Player} playerObject
 * @param  {number}  x
 * @param  {number}  y
 * @return {boolean}
 */
function isSelectionInSelectableBounds(playerObject, x, y) {
	var selectCoordinate = collisionSystem.getCollisionCoordinateFromCell(x - renderer.container.x, y - renderer.container.y - 16);
	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.x, playerObject.y);
	var deltax = Math.pow(Math.abs(coordinates.x - selectCoordinate.x), 2);
	var deltay = Math.pow(Math.abs(coordinates.y - selectCoordinate.y), 2);
	var distance = playerObject.scout;
	return distance > Math.sqrt(deltax + deltay);
}