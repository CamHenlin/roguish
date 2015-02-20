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

QUnit.test("collision test", function(assert) {
	var async = assert.async();

	var collisionTests = function() {
		if (!playerTurn) {
			setTimeout(collisionTests, 60);		
		} else {
			assert.equal(collisionSystem.checkCellValid(150, 295), false); // not valid
			assert.equal(collisionSystem.checkCellValid(45, 45), true); // valid
			async();
		}
	};
	
	collisionTests();
});

QUnit.test("enemy tests", function(assert) {
	var enemy = new Robot(50, 60, 1);
	var farPlayer = new Player(1000, 1000, 1);
	var nearPlayer = new Player(60, 60, 1);

	activeObjects.push(enemy);
	activeObjects.push(farPlayer);
	activeObjects.push(nearPlayer);

	var nearestPlayer = enemy.getNearestPlayer(); // Check to see if function returns the correct player.
	assert.equal(nearestPlayer, nearPlayer, "test getNearestPlayer() is correct");

	enemy.turn();
	assert.ok(playerTurn, "enemy turn verified");   // Key part in enemy movement

	// Ensure that all of the robot's stats are correct based on its passed level (1)
	assert.equal(enemy.x, 50, "enemy x position"); 
	assert.equal(enemy.y, 60, "enemy y position"); 
	assert.equal(enemy.level, 1, "enemy level"); 
	assert.equal(enemy.hp, 10, "enemy hp"); 
	assert.equal(enemy.xp, 100, "enemy xp"); 
	assert.equal(enemy.movementSpeed, 50, "enemy movement speed"); 
	assert.equal(enemy.attackSpeed, 2, "enemy attack speed"); 
	assert.equal(enemy.attack, 16, "enemy attack");
	assert.equal(enemy.defense, 1, "enemy defense");
	assert.equal(enemy.scout, 25, "enemy scout");
	assert.equal(enemy.magic, 1, "enemy magic");
	assert.equal(enemy.initiative, 10, "enemy initiative");	
	

	enemy.die();
	assert.equal(activeObjects.indexOf(enemy), -1, "enemy death");  // When enemies die, they should no longer be active
});