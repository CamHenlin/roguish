//QUnit.module("collision detection");
QUnit.test("QUnit Example", function(assert) {
	assert.ok(2+2 == 4, "2+2 equals 4");
});

QUnit.test("Player can move 0, 0 tile on default map", function(assert) {
	var done = assert.async();
	var assertionFunction = function() {
		if (!playerTurn) {
			setTimeout(assertionFunction, 60); // try again in ~10 frames
		} else {
			if (renderer.moveObjectTo(activePlayer, 8, 8) !== false) {
				removeSelectableArea();
				assert.ok("player can move to top left");
				done();
			} else {
				assert.ok(false, "player cannot move to top left");
				done();
			}
		}
	};
	assertionFunction();
});

