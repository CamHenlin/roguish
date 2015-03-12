/**
 * @name Main
 * @description [Code that initializes and starts the game.]
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
	{id: "chest", src: "graphics/chest.png"},
	{id: "starttile", src: "graphics/starttile.png"},
	{id: "stairsdown", src: "graphics/stairsdown.png"},
	{id: "slash", src: "graphics/slash.png"},
	{id: "black", src: "graphics/black.png"},
	{id: "stairsup", src: "graphics/stairsup.png"}
]);

/**
 * [handleComplete Handler for preload complete]
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
var isDemo = true;
var startPoint = {};

/**
 * [fixViewport Fixes the viewport on a window resize event]
 */
function fixViewport() {
	gamestage.canvas.width = window.innerWidth / gamezoom;
	gamestage.canvas.height = window.innerHeight / gamezoom;
	gamestage.update(); // note that I'm sort of breaking the rules here calling an update without the game loop, but this will force a redraw, otherwise the screen will flash black
}

/**
 * [init Call everything needed to start a game, initially. might be different from initvars later. called by loader handlecomplete handler]
 */
function init() {
	console.log('initializing');
	initVars();

	window.onresize = fixViewport;
}


/**
 * [initVars Initialize all variables needed for a new game to start]
 */
function initVars() {
	console.log('initializing vars');
	gamestage = new createjs.Stage("gamecanvas");
	gamestage.canvas.width = window.innerWidth / gamezoom;
	gamestage.canvas.height = window.innerHeight / gamezoom;
	gamestage.clear();
	activeObjects.length = 0;
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


	// this initiates sort of a demo mode I guess?
	setTimeout(function() {
		var activeObjectsLength = activeObjects.length;
		var i = 0;
		var callNextActiveObject = function(i) {
			if (!isDemo) {
				return;
			}

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
 * [handleTick Our main game loop]
 * @param  {TickEvent} event
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

/**
 * handles keypress events in menus
 * @param  {keyEvent} event standard keydown event
 */
document.onkeydown = function(event) {
	if(activePlayer.actionMenu) {
		for (var i in activePlayer.actionMenu.fields) {
			if (activePlayer.actionMenu.fields[i].key.toLowerCase() === String.fromCharCode(event.keyCode).toLowerCase()) {
				activePlayer.actionMenu.fields[i].callback();
			}
		}
	}


	return;
};