/**
 * [updateFogOfWar updates the fog of war around a player]
 * @param  {[type]} playerObject [description]
 * @return {[type]}              [description]
 */
function showSelectableArea(playerObject) {
	var coordinates = collisionSystem.getCollisionCoordinateFromCell(playerObject.x + playerObject.animations.spriteSheet._frameWidth / 2, playerObject.y + playerObject.animations.spriteSheet._frameHeight);
	var distance = playerObject.sightDistance;
	//console.log(renderer.fogOfWarGrid);

	for (var i = coordinates.x - distance; i < coordinates.x + distance; i++) {
		for (var j = coordinates.y - distance; j < coordinates.y + distance; j++) {
			renderer.fogOfWarContainer.removeChild(renderer.fogOfWarGrid[j][i]);
		}
	}
}