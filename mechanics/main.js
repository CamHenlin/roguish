var loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", handleComplete);

loader.loadManifest([
	{id: "dungeon_tiles_0", src: "graphics/dungeon_tiles_0.png"},
]);

/**
 * [handleComplete handler for preload complete]
 * @return {[type]} [description]
 */
function handleComplete() {
	setTimeout(function() {
		init();
	}, 100);
}

var gamestage;
var renderer;

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
	gamestage.clear();
	gamestage.snapToPixelEnabled = true;
	renderer = new Renderer(gamestage);
	renderer.initMap();
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.useRAF = true
	createjs.Ticker.setFPS(60);
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

	gamestage.update();
	return;
}