/**
 * @name advanceTurn
 */

/**
 * [advanceTurn function used in default game engine for determining next player turn]
 * @return {[void]} [description]
 */
function advanceTurn() {
	for (var i = 0; i < players.length; i++) {
		players[i].turnCounter += players[i].initiative;

		if (players[i].turnCounter > MAX_TURN_COUNTER) {
			// call turn dialog here normally
			players[i].turn();
			playerTurn = true;
		}
	}

	// for testing to show that turn counter is working:
	document.getElementById("turnStatus").innerHTML = players[0].turnCounter + " / " + MAX_TURN_COUNTER;
}