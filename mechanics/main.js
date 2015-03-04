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
	{id: "dragon", src: "graphics/dragon.png"},
	{id: "chest", src: "graphics/chest.png"}
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
var gamezoom = 3; // Cameron: my suggestion is that 2 = 100% game zoom. 1 is really small and would make the game feel more like an RTS I feel like
var playerTurn = false; // note that this is turned off by the renderer at the end of a move and turned on by advanceturn, blocks other players and objects from getting their "tick"
var activePlayer = {}; // this is set to the currently active player by the advance turn function
var selectableAreas = []; // global container for selectablearea blocks
var gameOver = false;  // gets set to true when the end game goal has been collided with, prevents objects from being updated
var fpsLabel = {};

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
	maploader.loadMap('dungeon.json'); //change this to the name of the map you want to load. the map must be in maps to work
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	gameOver = false;

	if (LOG_FPS) {
		fpsLabel = new createjs.Text("", "14px 'Helvetica'", "#FFF");

		fpsLabel.x = gamestage.canvas.width - 64;
		fpsLabel.y = gamestage.canvas.height - 64;
	}

	initActiveObjects(NUM_PLAYERS, NUM_ENEMIES);

	// this initiates sort of a demo mode I guess?
	setTimeout(function() {
		var activeObjectsLength = activeObjects.length;
		var i = 0;
		var callNextActiveObject = function(i) {
			if (i < activeObjectsLength) {
				renderer.centerMapOnObject(activeObjects[i], function() {
					renderer.fogOfWarContainer.uncache();
					updateFogOfWar(activeObjects[i]);
					renderer.beginCaching(renderer.fogOfWarContainer);
					setTimeout(function() {
						callNextActiveObject(i+1);
					}, 120);
					return;
				});
			}
		}
		callNextActiveObject(i);
	}, 1000);
}

/**
 * [initActiveObjects reset activeObjects array and initialize it]
 * @param  {[type]} playerCount [description]
 * @param  {[type]} enemyCount  [description]
 * @return {[type]}             [description]
 */
function initActiveObjects(playerCount, enemyCount) {

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
	} else if (!playerTurn && !gameOver) {
		for (var i = 0; i < activeObjects.length; i++) {
			activeObjects[i].tickActions();
		}

		for (var i = 0; i < renderer.simpleobjects.length; i++) {
			renderer.simpleobjects[i].tickActions();
		}

		advanceTurn();
	}

	if (LOG_FPS) {
		fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " / " + Math.round(createjs.Ticker.getFPS());
	}

	// this should be the only time the gamestage is updated anywhere in our code. Ensures that we only attempt to render 60 times per second.
	gamestage.update();

	return;
}