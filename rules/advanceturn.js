/**
 * @name advanceTurn
 */

/**
 * Function used in default game engine for determining next player turn
 */
function advanceTurn() {
	var turnFlag = false;
	for (var i = 0; i < activeObjects.length; i++) {
		if ((activeObjects.isWithinMaxDistance && activeObjects.isWithinMaxDistance()) || activeObjects[i].constructor === Player) {
			activeObjects[i].turnCounter += activeObjects[i].initiative;
		}

		if (activeObjects[i].turnCounter > MAX_TURN_COUNTER && !turnFlag) {
			activeObjects[i].turn();
			turnFlag = true;
			if (activeObjects[i].constructor === Player) {
				activePlayer = activeObjects[i];
			}
		}
	}
}