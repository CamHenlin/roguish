 /**
 * Updates the renderer's fog of war around a player's position
 * @param  {Player} playerObject
 */
function updateFogOfWar(playerObject) {
	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.x, playerObject.y + 16);
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