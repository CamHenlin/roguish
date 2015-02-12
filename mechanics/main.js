var loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", handleComplete);

loader.loadManifest([
	{id: "dungeon_tiles_0", src: "graphics/dungeon_tiles_0.png"},
	{id: "player", src: "graphics/player.png"},
	{id: "enemy", src: "graphics/treadbot1sheet.png"},
]);

/**
 * [handleComplete handler for preload complete]
 * @return {[type]} [description]
 */
function handleComplete() {
	init();
}

var gamestage; // this is the global canvas object that everything canvas-related in the game will attach to
var renderer;
var collisionSystem = new CollisionSystem();
var players = []; // list of active players
var enemies = []; // list of enemies
var gamezoom = 2; // Cameron: my suggestion is that 2 = 100% game zoom. 1 is really small and would make the game feel more like an RTS I feel like

/**
 * [init call everything needed to start a game, initially. might be different from initvars later. called by loader handlecomplete handler.]
 * @return {[type]} [description]
 */
function init() {
	console.log('initializing');
	initVars();
}

/**
 * [initVars initialize all variables needed for a new game to start]
 * @return {[type]} [description]
 */
function initVars() {
	console.log('initializing vars');
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.canvas.width = window.innerWidth / gamezoom;
	gamestage.canvas.height = window.innerHeight / gamezoom;
	gamestage.clear();
	gamestage.snapToPixelEnabled = true;
	renderer = new Renderer(gamestage);
	renderer.initMap();
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true
	createjs.Ticker.setFPS(60);

	// make ten player
	initPlayers(1);
	initEnemies(2);
}

/**
 * [initPlayers reset players array and initialize it]
 * @param  {[type]} playerCount [description]
 * @return {[type]}             [description]
 */
function initPlayers(playerCount) {
	players = [];
	for (var i = 0; i < playerCount; i++) {
		players.push(new Player(i * 32 + 96, i * 32 + 96));
	}
}


function initEnemies(enemyCount) {
	enemies = [];
	for (var i = 0; i < enemyCount; i++) {
		enemies.push(new Enemy(i * 32 + 32 + 180, i * 32 + 180));
	}
}

/**
 * [handleTick our main game loop]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function handleTick(event) {
	if (!renderer.doneRendering) {
		console.log('not done rendering');
		return;
	}

	if (renderer.moving) {
		renderer.movementTickActions();
	} else {
		var i = 0; // going to need to use i multiple times here, might as well only declare it once

		// iterate players and allow each player to get its tickAction
		for (i = 0; i < players.length; i++) {
			players[i].tickActions();
		}

		playerTurn();
	}

	for (i = 0; i < enemies.length; i++) {
		enemies[i].tickActions();
	}

	// this should be the only time the gamestage is updated anywhere in our code. Ensures that we only attempt to render 60 times per second.
	gamestage.update();

	return;
}