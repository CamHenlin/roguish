/**
 * @name advanceTurn
 * @description [Code that handles everything needed when a turn is advanced.]
 */

/**
 * [advanceTurn Function used in default game engine for determining next player turn]
 */
function advanceTurn() {
	var turnFlag = false;
	for (var i = 0; i < activeObjects.length; i++) {
		if ((activeObjects[i] instanceof Enemy) || activeObjects[i].constructor === Player) {
			activeObjects[i].turnCounter += activeObjects[i].initiative;
		}

		if (activeObjects[i].turnCounter >= MAX_TURN_COUNTER && !turnFlag) {
			activeObjects[i].turn();
			turnFlag = true;
			if (activeObjects[i].constructor === Player) {
				activePlayer = activeObjects[i];
			}
		}
	}
}