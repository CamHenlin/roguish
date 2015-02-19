/**
 * @name advanceTurn
 */

/**
 * [advanceTurn function used in default game engine for determining next player turn]
 * @return {[void]} [description]
 */
function advanceTurn() {
	document.getElementById("turnStatus").innerHTML = "";

	for (var i = 0; i < activeObjects.length; i++) {
		activeObjects[i].turnCounter += activeObjects[i].initiative;

		if (activeObjects[i].turnCounter > MAX_TURN_COUNTER) {
			// call turn dialog here normally
			activeObjects[i].turn();
		}

		document.getElementById("turnStatus").innerHTML = document.getElementById("turnStatus").innerHTML + "<br>" + activeObjects[i].turnCounter + " / " + MAX_TURN_COUNTER;
	}

	// for testing to show that turn counter is working:
}