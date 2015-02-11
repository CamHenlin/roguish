/**
 * [playerTurn function used in default game engine for determining next player turn]
 * @return {[type]} [description]
 */
function playerTurn() {
	for (var i = 0; i < players.length; i++) {
		players[i].turnCounter += players[i].initiative;

		if (players[i].turnCounter > MAX_TURN_COUNTER) {
			// call turn dialog here normally
			players[i].turn();
		}
	}
}