/**
 * @name Main
 */

var loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", handleComplete);

loader.loadManifest([
	{id: "player", src: "graphics/player.png"},
	{id: "robot", src: "graphics/treadbot1sheet.png"},
	{id: "fogofwar", src: "graphics/fogofwar.png"},
	{id: "selectablearea", src: "graphics/selectablearea.png"},
	{id: "validtile", src: "graphics/validtile.png"},
	{id: "dragon", src: "graphics/dragon.png"}
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
var maploader;
var collisionSystem = new CollisionSystem();
var activeObjects = [];
var gamezoom = 2; // Cameron: my suggestion is that 2 = 100% game zoom. 1 is really small and would make the game feel more like an RTS I feel like
var playerTurn = false; // note that this is turned off by the renderer at the end of a move and turned on by advanceturn, blocks other players and objects from getting their "tick"
var activePlayer = {}; // this is set to the currently active player by the advance turn function
var selectableAreas = []; // global container for selectablearea blocks

/**
 * [fixViewport fixes the viewport on a window resize event]
 * @return {[type]} [description]
 */
function fixViewport() {
	gamestage.canvas.width = window.innerWidth / gamezoom;
	gamestage.canvas.height = window.innerHeight / gamezoom;
	gamestage.update(); // note that I'm sort of breaking the rules here calling an update without the game loop, but this will force a redraw, otherwise the screen will flash black
}

/**
 * [init call everything needed to start a game, initially. might be different from initvars later. called by loader handlecomplete handler.]
 * @return {[type]} [description]
 */
function init() {
	console.log('initializing');
	initVars();

	window.onresize = fixViewport;
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
	maploader = new MapLoader(loader);
	maploader.loadMap('map1.json'); //change this to the name of the map you want to load. the map must be in maps to work
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);

	initActiveObjects(NUM_PLAYERS, NUM_ENEMIES);
}

/**
 * [initActiveObjects reset activeObjects array and initialize it]
 * @param  {[type]} playerCount [description]
 * @param  {[type]} enemyCount  [description]
 * @return {[type]}             [description]
 */
function initActiveObjects(playerCount, enemyCount) {
	activeObjects = [];
	var i = 0;
	for (i = 0; i < playerCount; i++) {
		activeObjects.push(new Player(i * 32 + 96, i * 32 + 96, 10));
		updateFogOfWar(activeObjects[i]);
	}

	var random = 0;
	for (i = 0; i < enemyCount; i++) {
		random = Math.random();

		if (random < 0.55)
			activeObjects.push(new Robot(i * 32 + 32 + 180, i * 32 + 180, 1));
		else
			activeObjects.push(new Dragon(i * 32 + 32 + 180, i * 32 + 180, 1));
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
	} else if (!renderer.centered) {
		renderer.centerMapOnObjectTick();
	} else if (!playerTurn) {
		for (var i = 0; i < activeObjects.length; i++) {
			activeObjects[i].tickActions();
		}

		advanceTurn();
	}


	// this should be the only time the gamestage is updated anywhere in our code. Ensures that we only attempt to render 60 times per second.
	gamestage.update();

	return;
}