/**
 * [updateFogOfWar updates the fog of war around a player]
 * @param  {[type]} playerObject [description]
 * @return {[type]}              [description]
 */
function updateFogOfWar(playerObject) {
	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.x + playerObject.animations.spriteSheet._frameWidth / 2, playerObject.y + playerObject.animations.spriteSheet._frameHeight);
	var distance = playerObject.scout;
	for (var i = Math.floor(coordinates.x - distance); i < coordinates.x + distance; i++) {
		for (var j = Math.floor(coordinates.y - distance); j < coordinates.y + distance; j++) {
			var deltax = Math.pow(Math.abs(coordinates.x - i), 2);
			var deltay = Math.pow(Math.abs(coordinates.y - j), 2);

			if (Math.sqrt(deltax + deltay) < distance) {
				if (renderer.fogOfWarGrid[j]) {
					renderer.fogOfWarContainer.removeChild(renderer.fogOfWarGrid[j][i]);
				}
			}
		}
	}
}