/*

*/

/*

 // for programmatically doing stuff
function simulateCanvasClick(x,y, callback) {
	var evt = new MouseEvent("click", {
			clientX:x,
			clientY:y
	});


	var testCanvas = document.getElementById("gamecanvas");

	function doStuff() {
		testCanvas.removeEventListener("click", doStuff);
		if(callback) callback();
	}

	testCanvas.addEventListener("click", doStuff);
	testCanvas.dispatchEvent(evt);
}

function simulateMenuClick(placeholder, callback) {

	var evt = new MouseEvent("click");

	var but = $("button").filter(function(){
		return $(this).attr("placeholder") == placeholder;
	})[0];
	if(but){

		function doStuff() {
			but.removeEventListener("click", doStuff);
			if(callback) callback();
		}

		but.addEventListener("click", doStuff);
		but.dispatchEvent(evt);
	}
	// just keep trying
	else setTimeout(function(){
			simulateMenuClick(placeholder, callback);
		}, 100);
}

function simulateMove(x,y, callback) {
	var evt = new MouseEvent("click");

		but = $("button").filter(function(){
		return $(this).attr("placeholder") === "Move";
	})[0];
	if(but && isSelectionInSelectableBounds(activePlayer, x, y)) {
			function doStuff() {
				but.removeEventListener("click", doStuff);
				simulateCanvasClick(x,y, callback);
			}

			but.addEventListener("click", doStuff);
			but.dispatchEvent(evt);
		}
	else {
		setTimeout(function(){
			simulateMove(x,y, callback);
		}, 100);
	}
}

function simulateAttack(x,y, callback) {

	var evt = new MouseEvent("click");

		but = $("button").filter(function(){
		return $(this).attr("placeholder") === "Attack";
	})[0];
	if(but && isSelectionInSelectableBounds(activePlayer, x, y)) {
			function doStuff() {
				but.removeEventListener("click", doStuff);
				simulateCanvasClick(x,y, callback);
			}

			but.addEventListener("click", doStuff);
			but.dispatchEvent(evt);
		}
	else {
		setTimeout(function(){
			simulateAttack(x,y, callback);
		}, 100);
	}
	
}

function startNewGame(callback) {
		// new game
	simulateMenuClick("New Game", function() {
		simulateMenuClick("next", function() {
			simulateMenuClick("Start Game", callback);
		});
	});
}

QUnit.module("gameplay module");

QUnit.test("Start game", function(assert) {
	var done = assert.async();
	
	function doStuff() {
		if(gamestage) {
			startNewGame(function() {
				assert.ok(true, "not really a test but game started")
				done();
			});
		}
		else setTimeout(doStuff, 100);
	}
	doStuff();
});

QUnit.test("Player can move", function(assert) {
	var done = assert.async();

	function doStuff() {

		if(gamestage) {
			var testPlayer = new Player(0,0);
			var moveX = testPlayer.x + 32;
			var moveY = testPlayer.y + 32;
			simulateMove(moveX, moveY, function() {
				assert.equal((testPlayer.x == moveX) && (testPlayer.y == moveY), DEFAULT_PERSON_HEALTH - 2, "He moved");
				done();
			});
			
		}
		else setTimeout(doStuff, 100);
	}
	startNewGame(doStuff);
});

QUnit.test("Player can hit self", function(assert) {
	var done = assert.async();

	function doStuff() {
		if(gamestage) {
			var testPlayer = new Player(0,0);
			simulateAttack(testPlayer.x, testPlayer.y, function() {
				assert.equal(testPlayer.hp, DEFAULT_PERSON_HEALTH - 2, "He hit himself");
				done();
			});
			
		}
		else setTimeout(doStuff, 100);
	}
	startNewGame(doStuff);
	
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
*/
QUnit.module("collision tests");
var testCollision = new CollisionSystem();


QUnit.test("checkCellValid by pixel", function(assert) {
	testCollision.collisionArray = [
		[0,1],
		[1,0]
	];
	for(var i = 0; i < 32; i++){
		for(var j = 0; j < 32; j++){
			var x = Math.floor(j/16);
			var y = Math.floor(i/16);
			if((x+y) % 2 == 0) assert.equal(testCollision.checkCellValid(j,i), false, "invalid cell");
			else assert.equal(testCollision.checkCellValid(j,i), true, "valid cell");
		}
	}
	testCollision.collisionArray = [
		[0]
	];
	for(var i = 0; i < 16; i++){
		for(var j = 0; j < 16; j++){
			assert.equal(testCollision.checkCellValid(j,i), false, "invalid cell");
		}
	}
	testCollision.collisionArray = [
		[1]
	];
	for(var i = 0; i < 16; i++){
		for(var j = 0; j < 16; j++){
			assert.equal(testCollision.checkCellValid(j,i), true, "valid cell");
		}
	}
	testCollision.collisionArray = [
		[1,0,1],
		[1,1,0],
		[0,1,1]
	];
	for(var i = 0; i < 3*16; i++){
		for(var j = 0; j < 3*16; j++){
			if(((j>=16 && j<32) && (i>=0 && i<16)) || ((j>=32 && j<48) && (i>=16 && i<32)) || ((j>=0 && j<16) && (i>=32 && i<48))) {
				assert.equal(testCollision.checkCellValid(j,i), false, "invalid cell");
			}
			else {
				assert.equal(testCollision.checkCellValid(j,i), true, "valid cell");
			}
		}
	}
});


QUnit.test("basic checkCollisionCellValid", function(assert) {
	testCollision.collisionArray = [
		[0]
	];
	for(var i = 0; i < testCollision.collisionArray.length; i++){
		for(var j = 0; j < testCollision.collisionArray[i].length; j++){
			assert.equal(testCollision.checkCollisionCellValid(j,i), false, "invalid cell");
		}
	}
	testCollision.collisionArray = [
		[1]
	];
	for(var i = 0; i < testCollision.collisionArray.length; i++){
		for(var j = 0; j < testCollision.collisionArray[i].length; j++){
			assert.equal(testCollision.checkCollisionCellValid(j,i), true, "valid cell");
		}
	}
	testCollision.collisionArray = [
		[1,0,1],
		[1,1,0],
		[0,1,1]
	];
	for(var i = 0; i < testCollision.collisionArray.length; i++){
		for(var j = 0; j < testCollision.collisionArray[i].length; j++){
			if((j==1 && i==0) || (j==2 && i==1) || (j==0 && i==2)) {
				assert.equal(testCollision.checkCollisionCellValid(j,i), false, "invalid cell");
			}
			else {
				assert.equal(testCollision.checkCollisionCellValid(j,i), true, "valid cell");
			}
		}
	}
});


var testPlayer = null;
var testDragon = null;
var testRobot = null;

QUnit.test("basic checkCellValidForObject tests", function(assert) {

	testCollision.collisionArray = [
		[1,0,1],
		[1,1,1],
		[1,1,0]
	];

	var done = assert.async();

	function doStuff() {
		if(gamestage) {
			testPlayer = new Player(0,0);
			testDragon = new Dragon(16,16);
			testRobot = new Robot(32,32);

			assert.equal(testCollision.checkCellValidForObject(testPlayer), false, "player on invalid cell");
			assert.equal(testCollision.checkCellValidForObject(testDragon), true, "dragon on invalid cell");
			assert.equal(testCollision.checkCellValidForObject(testRobot), true, "robot on invalid cell");

			done();
		}
		else {
			setTimeout(doStuff,100);
		}
	}
	doStuff();
});

QUnit.test("basic getCollisionCoordinateFromCell tests", function(assert) {
	var testX;
	var testY;
	var testObj;

	testCollision.collisionArray = [
		[1,1],
		[1,1]
	];

	for(var i = 0; i < 32; i++) {
		for(var j = 0; j < 32; j++) {
			if(j < 16) testX = 0;
			else if(j < 32) testX = 1;
			if(i < 16) testY = 0;
			else if(i < 32) testY = 1;

			testObj = testCollision.getCollisionCoordinateFromCell(j,i);
			console.log(testObj);
			assert.ok((testObj.x === testX) && (testObj.y === testY));
		}
	}
});

QUnit.test("basic simpleCollision tests", function(assert) {
	var done = assert.async();
	var simpleCollision = function() {
		if(renderer) {
			var testRobot = new Robot(5,5,1);
			var testPlayer = new Player(10,10,1);
			assert.ok(testCollision.simpleCollision(testRobot, testPlayer), "they are colliding");
			done();
		}
		else {
			setTimeout(simpleCollision, 60);
		}
	}
	simpleCollision();
});
/*
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
*/
QUnit.module("renderer tests");


QUnit.module("player tests");
QUnit.test("player tests", function(assert) {
	var done = assert.async();
	var playerTests = function() {
		if(renderer) {

			var testPlayer = new Player(40,40, 1);
			testPlayer.setName("Player");
			activeObjects.push(testPlayer);

			assert.equal(testPlayer.x, 40, "player x");
			assert.equal(testPlayer.y, 40, "player y");
			assert.equal(testPlayer.initiative, 1, "player initiative");
			assert.equal(testPlayer.getName(), "Player", "player name");
			assert.equal(testPlayer.hp, 100, "player hp");
			assert.equal(testPlayer.xp, 0, "player xp");

			testPlayer.die();
			setTimeout(function() {
				assert.ok(!renderer.activeObjectsContainer.contains(testPlayer.animations), "player.animations is removed from renderer.activeObjectsContainer");
				assert.ok(activeObjects.indexOf(testPlayer) === -1, "player is removed from activeObjects");
				done();
			}, 1000);
		}
		
		else {
			setTimeout(playerTests, 60);
		}
	};
	playerTests();
});

QUnit.module("enemy tests");
QUnit.test("enemy tests", function(assert) {
	var done = assert.async();
	var enemyTests = function() {
		if(renderer) {
			var enemy = new Robot(50, 60, 1);
			var farPlayer = new Player(1000, 1000, 1);
			var nearPlayer = new Player(60, 60, 1);

			activeObjects.push(enemy);
			activeObjects.push(farPlayer);
			activeObjects.push(nearPlayer);

			var nearestPlayer = enemy.getNearestPlayer(); // Check to see if function returns the correct player.
			assert.equal(nearestPlayer, nearPlayer, "test getNearestPlayer() is correct");

			enemy.turn();
			assert.ok(!playerTurn, "enemy turn verified");   // Key part in enemy movement

			// Ensure that all of the robot's stats are correct based on its passed level (1)
			assert.equal(enemy.x, 50, "enemy x position");
			assert.equal(enemy.y, 60, "enemy y position");
			assert.equal(enemy.level, 1, "enemy level");
			assert.equal(enemy.hp, 1, "enemy hp");
			assert.equal(enemy.xp, 100, "enemy xp");
			assert.equal(enemy.movementSpeed, 10, "enemy movement speed");
			assert.equal(enemy.attackSpeed, 2, "enemy attack speed");
			assert.equal(enemy.attack, 6, "enemy attack");
			assert.equal(enemy.defense, 1, "enemy defense");
			assert.equal(enemy.scout, 1.25, "enemy scout");
			assert.equal(enemy.magic, 1, "enemy magic");
			assert.equal(enemy.initiative, 10, "enemy initiative");

			enemy.die();
			assert.equal(activeObjects.indexOf(enemy), -1, "enemy death");  // When enemies die, they should no longer be active
			done();
		}
		else {
			setTimeout(enemyTests, 60);
		}
	}
	enemyTests();
});