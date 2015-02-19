/**
 * @name Renderer
 * @class
 */

/**
 * Renderer handles rendering a map file to the canvas
 * @param {[EaselJS stage]} gamestage [EaselJS stage]
 * @constructor
 */
function Renderer(gamestage) {
	this.backgroundContainer = new createjs.Container();
	this.complexObjects = [];
	this.container = new createjs.Container();
	this.container.x = 0;
	this.container.y = 0;
	this.doneRendering = false;
	this.foregroundContainer = new createjs.Container();
	this.gamestage = gamestage; // this is a link to the parent gamestage
	this.mapcounter = 0;
	this.mapData = undefined; // this will be our tiled JSON data
	this.imageData = undefined; // this will be the tileset graphic
	this.simpleObjects = [];
	this.tileset = new Image();

	// new tickaction code:
	this.moving = false;
	this.moveToX = 0;
	this.moveToY = 0;
	this.movingObject = {};
	this.movingToCellTarget = {};
	this.movingToCellStart = {};
	this.movementGraph = {};
	this.movementSearchResult = [];
	this.centered = true;


	/**
	 * [completeRenderer run at the end of our map rendering process]
	 * @private
	 * @return {[type]} [none]
	 */
	function completeRenderer() {
		console.log();
		this.gamestage.removeAllChildren(); // clear the gamestage since we are ready to render.
		this.doneRendering = true;
		this.gamestage.addChild(this.backgroundContainer);
		this.gamestage.addChild(this.container);
		this.gamestage.addChild(this.foregroundContainer);
	};

	/**
	 * [initLayers initialize all of the layers in the map]
	 * @private
	 * @return {[type]} [none]
	 */
	function initLayers() {
		var w = this.mapData.tilesets[0].tilewidth;
		var h = this.mapData.tilesets[0].tileheight;
		this.simpleobjects = [];
		this.complexObjects = [];

		var imageData = {
			images : [ this.imageData ],
			frames : {
				width : w,
				height : h
			}
		};

		this.container = new createjs.Container();

		// create spritesheet
		var tilesetSheet = new createjs.SpriteSheet(imageData);

		// loading each layer one at a time
		for (var i = 0; i < this.mapData.layers.length; i++) {
			var layer = this.mapData.layers[i];
			// console.log(layer);
			if (layer.type === 'tilelayer') { // one of these for each tile layer we add in tiled
				if (i === 0) { // background 2
					this.backgroundContainer.addChild(initDrawableLayer.call(this, layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				} else if (i === 1) { // background 1
					this.backgroundContainer.addChild(initDrawableLayer.call(this, layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				} else if (i === 2) { // simpleobjects
					this.simpleobjects = initSimpleObjects.call(this, layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight);
				} else if (i === 3) { // collision
					this.container.addChild(initDrawableLayerWithCollisionArray.call(this, layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				} else if (i === 4) { // foreground
					this.foregroundContainer.addChild(initDrawableLayer.call(this, layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				}
			}

			if (layer.type === 'objectgroup') { // this is the list of tiled objects, if any
				for (var j = 0; j < layer.objects.length; j++) {
					// this is where we will handle cases for object files
				}
			}
		}
	}

	/**
	 * [initSimpleObjects initialization method for simple objects]
	 * @private
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @return {[type]}              [description]
	 */
	function initSimpleObjects(layerData, tilesetSheet, tilewidth, tileheight) {
		var enemyArray = [];
		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// layer data has single dimension array
				var idx = x + y * layerData.width;

				if (layerData.data[idx] !== 0) {
					// each different simple object will have an idx entry here
				}
			}
		}

		return enemyArray;
	}

	/**
	 * [initDrawableLayer draws a single visible layer to a container]
	 * @private
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @return {[type]}              [EaselJS container]
	 */
	function initDrawableLayer(layerData, tilesetSheet, tilewidth, tileheight) {
		var container = new createjs.Container();

		for (var y = 0; y < layerData.height; y++) {
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell

				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					cellBitmap.x = x * tilewidth;
					cellBitmap.y = y * tileheight;
					// add bitmap to gamestage
					container.addChild(cellBitmap);
					// internalgamestage.addChild(cellBitmap);
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;

		return container;
	}

	/**
	 * [initLayerWithCollisionArray Same as initDrawableLayer, but also builds the renderer's collision array]
	 * @private
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @return {[type]}              [EaselJS container]
	 */
	function initDrawableLayerWithCollisionArray(layerData, tilesetSheet, tilewidth, tileheight) {
		var container = new createjs.Container();

		collisionSystem.collisionArray = new Array(layerData.height);
		for (var y = 0; y < layerData.height; y++) {
			collisionSystem.collisionArray[y] = new Array(layerData.width);
			for (var x = 0; x < layerData.width; x++) {
				// create a new Bitmap for each cell
				// layer data has single dimension array
				var idx = x + y * layerData.width;
				if (layerData.data[idx] !== 0) {
					var cellBitmap = null;
					cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					cellBitmap.x = x * tilewidth;
					cellBitmap.y = y * tileheight;
					container.addChild(cellBitmap);

					collisionSystem.collisionArray[y][x] = 0;
				} else {
					collisionSystem.collisionArray[y][x] = 1;
				}
			}
		}

		this.movementGraph = new Graph(collisionSystem.collisionArray);

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};

	/**
	 * [cleanUpMovement cleans up movement fields after a player's turn is done]
	 * @private
	 * @return [description]
	 */
	function cleanUpMovement() {
		this.moving = false;
		this.movingObject.cleanUpMovement();
		this.movingObject = {};
		this.moveToX = 0;
		this.moveToY = 0;
		this.movingToCellTarget = {};
		this.movementSearchResult = [];
		playerTurn = false;
	}

	/**
	 * [shiftMap shifts the entire map except for the active player]
	 * @private
	 * @param  {[type]} xamount [description]
	 * @param  {[type]} yamount [description]
	 * @return {[type]}         [description]
	 */
	function shiftMap(xamount, yamount) {
		// right here we will actually have to iterate over other players and watched objects not contained by the renderer and move them in the opposite direction as well
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] !== this.movingObject) {
				activeObjects[i].animations.x -= xamount;
				activeObjects[i].animations.y -= yamount;
			}
		}

		this.backgroundContainer.x -= xamount;
		this.backgroundContainer.y -= yamount;
		this.container.x -= xamount;
		this.container.y -= yamount;
		this.foregroundContainer.x -= xamount;
		this.foregroundContainer.y -= yamount;
	}

	/**
	 * [shiftMap shifts the entire map without regard for active or inactive players]
	 * @private
	 * @param  {[type]} xamount [description]
	 * @param  {[type]} yamount [description]
	 * @return {[type]}         [description]
	 */
	function shiftEntireMap(xamount, yamount) {
		// right here we will actually have to iterate over other players and watched objects not contained by the renderer and move them in the opposite direction as well

		for (var i = 0; i < activeObjects.length; i++) {
			activeObjects[i].animations.x -= xamount;
			activeObjects[i].animations.y -= yamount;
		}

		this.backgroundContainer.x -= xamount;
		this.backgroundContainer.y -= yamount;
		this.container.x -= xamount;
		this.container.y -= yamount;
		this.foregroundContainer.x -= xamount;
		this.foregroundContainer.y -= yamount;
	}


	/**
	 * [initMap initializes the renderer, gets it ready to render a new map]
	 * @public
	 * @return {[type]} [none]
	 */
	this.initMap = function () {
		// getting imagefile from first tileset
		if (this.mapData.tilesets[0].image.indexOf("..\/") > -1) {
			this.mapData.tilesets[0].image = this.mapData.tilesets[0].image.replace("..\/", "");
		}

		this.tileset.src = this.mapData.tilesets[0].image;

		initLayers.call(this);
		completeRenderer.call(this);
		this.doneRendering = true;
	};

	/**
	 * [prepareRenderer basically reinitialize all of our variables here, gets us ready to draw a new map]
	 * @param  {[type]} mapData [new map JSON]
	 * @return {[type]}         [none]
	 */
	this.prepareRenderer = function(mapData) {
		this.backgroundContainer = new createjs.Container();
		this.complexObjects = [];
		this.container = new createjs.Container();
		this.container.x = 0;
		this.container.y = 0;
		this.doneRendering = false;
		this.foregroundContainer = new createjs.Container();
		this.mapcounter = 0;
		this.mapData = mapData; // this is our tiled JSON data
		this.simpleObjects = [];
		this.tileset = new Image();
	};

	/**
	 * [moveObjectTo shifts the map in a certain way]
	 * @param  {[type]} trackedObject [description]
	 * @param  {[type]} targetx       [description]
	 * @param  {[type]} targety       [description]
	 * @return {[type]}               [description]
	 */
	this.moveObjectTo = function(trackedObject, targetx, targety) {
		this.movingObject = trackedObject;

		targetx -= this.container.x - trackedObject.animations.spriteSheet._frameWidth / 2;
		targety -= this.container.y + trackedObject.animations.spriteSheet._frameHeight / 2;
		if (!collisionSystem.checkCellValid(targetx, targety) ||
			(collisionSystem.getCollisionCoordinateFromCell(trackedObject.x + trackedObject.animations.spriteSheet._frameWidth / 2, trackedObject.y - trackedObject.animations.spriteSheet._frameHeight / 2).x === collisionSystem.getCollisionCoordinateFromCell(targetx, targety).x &&
			 collisionSystem.getCollisionCoordinateFromCell(trackedObject.x + trackedObject.animations.spriteSheet._frameWidth / 2, trackedObject.y - trackedObject.animations.spriteSheet._frameHeight / 2).y === collisionSystem.getCollisionCoordinateFromCell(targetx, targety).y)) {
			cleanUpMovement.call(this);

			return false;
		}

		this.moveToX = targetx;
		this.moveToY = targety;
		this.movingToCellTarget = collisionSystem.getCollisionCoordinateFromCell(this.moveToX, this.moveToY);
		this.movingToCellStart = collisionSystem.getCollisionCoordinateFromCell(this.movingObject.x, this.movingObject.y);
		this.moving = true;
	};

	/**
	 * [getCanvasWidth gets the canvas width in pixels]
	 * @return {[type]} [description]
	 */
	this.getCanvasWidth = function() {
		return gamestage.canvas.width;
	};

	/**
	 * [getCanvasWidth gets the canvas height in pixels]
	 * @return {[type]} [description]
	 */
	this.getCanvasHeight = function() {
		return gamestage.canvas.height;
	};

	/**
	 * [centerMapOnObject tells the renderer to attempt to center on an object]
	 * @public
	 * @param  {[type]} centeredObject [description]
	 * @return {[void]}                [description]
	 */
	this.centerMapOnObject = function(centeredObject, centeringCallback) {
		this.centeredObject = centeredObject;
		this.centeringCallback = centeringCallback;
		this.centered = false;
	};

	/**
	 * [centerMapOnObjectTick attempts to center the map on an object. returns true once the map is either centered
	 * or the map has reached an edge when trying to center]
	 * @public
	 * @return {[boolean]}                [true if centered false if not]
	 */
	this.centerMapOnObjectTick = function() {
		if (tryCentering.call(this, this.centeredObject, MAP_MOVE_SPEED) === false) {
			console.log('done centering!');
			this.centeringCallback();
			this.centered = true;
		}
	};

	/**
	 * [tryCentering attempts to center the screen, should get closer every frame]
	 * @param  {[type]} obj   [description]
	 * @param  {[type]} speed [description]
	 * @return {[type]}       [false if the screen can't get more centered]
	 */
	function tryCentering(obj, speed) {
		var distanceX = distanceFromCenteredX.call(this, obj);
		var distanceY = distanceFromCenteredY.call(this, obj);

		if (Math.abs(distanceX) < speed) {
			distanceX = 0;
		}

		if (Math.abs(distanceY) < speed) {
			distanceY = 0;
		}

		var mapShiftX = 0;
		var mapShiftY = 0;

		if (distanceX > 0) { // we need to shift map right
			mapShiftX = speed;

			if (!canShiftMapRight.call(this, speed)) {
				mapShiftX = 0;
			}
		} else if (distanceX < 0) { // we need to shfit map left
			mapShiftX = -speed;

			if (!canShiftMapLeft.call(this, speed)) {
				mapShiftX = 0;
			}
		}

		if (distanceY > 0) { // we need to shift map down
			mapShiftY = speed;

			if (!canShiftMapUp.call(this, speed)) {
				mapShiftY = 0;
			}
		} else if (distanceY < 0) { // we need to shift map up
			mapShiftY = -speed;

			if (!canShiftMapDown.call(this, speed)) {
				mapShiftY = 0;
			}
		}

		if (mapShiftX === 0 && mapShiftY === 0) {
			return false;
		}

		shiftEntireMap.call(this, mapShiftX, mapShiftY);
	}

	/**
	 * [distanceFromCenteredX returns distance from the center of the screen]
	 * positive means needs containers need to shift right by half returned number of pixels to be centered
	 * positive means needs object need to shift left by half returned number of pixels to be centered
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	function distanceFromCenteredX(obj) {
		return ((obj.animations.x + obj.animations.spriteSheet._frameWidth / 2) + renderer.container.x - (gamestage.canvas.width / 2)) / gamezoom;
	}

	/**
	 * [canShiftMapLeft returns true if the map can shift left, false if not]
	 * @param  {[type]} speed [description]
	 * @return {[type]}       [description]
	 */
	function canShiftMapLeft(speed) {
		return renderer.container.x + (speed / 2) < 0;
	}

	/**
	 * [canShiftMapRight returns true if the map can shift right, false if not]
	 * @param  {[type]} speed [description]
	 * @return {[type]}       [description]
	 */
	function canShiftMapRight(speed) {
		return renderer.container.x + renderer.getMapWidth() - (speed / 2) > gamestage.canvas.width;
	}

	/**
	 * [distanceFromCenteredY returns distance from the center of the screen]
	 * positive means containers needs to go up by half returned number of pixels to be centered
	 * positive means object needs to go down by half returned number of pixels to be centered
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	function distanceFromCenteredY(obj) {
		return ((obj.animations.y + obj.animations.spriteSheet._frameHeight / 2) - renderer.container.y - (gamestage.canvas.height / 2)) / gamezoom;
	}

	/**
	 * [canShiftMapDown returns true if the map can shift down, false if not]
	 * @param  {[type]} speed [description]
	 * @return {[type]}       [description]
	 */
	function canShiftMapDown(speed) {
		return renderer.container.y + (speed / 2) < 0;
	}

	/**
	 * [canShiftMapUp returns true if the map can shift up, false if not]
	 * @param  {[type]} speed [description]
	 * @return {[type]}       [description]
	 */
	function canShiftMapUp(speed) {
		return renderer.container.y + renderer.getMapHeight() - (speed / 2) > gamestage.canvas.height;
	}

	/**
	 * [movementTickActions description]
	 * @public
	 * @return {[type]} [description]
	 */
	this.movementTickActions = function() {
		var startxy = collisionSystem.getCollisionCoordinateFromCell(this.movingObject.x + this.movingObject.animations.spriteSheet._frameWidth / 2, this.movingObject.y + this.movingObject.animations.spriteSheet._frameHeight);
		if (!this.movementSearchResult[0] || (startxy.x === this.movementSearchResult[0].x && startxy.y === this.movementSearchResult[0].y)) {
			var start = this.movementGraph.grid[startxy.x][startxy.y];
			var end = this.movementGraph.grid[this.movingToCellTarget.x][this.movingToCellTarget.y];
			this.movementSearchResult = astar.search(this.movementGraph, start, end);
		}

		if ((this.movingToCellTarget.y === startxy.y && this.movingToCellTarget.x === startxy.x) || !collisionSystem.checkCellValid(startxy.x, startxy.y) || !this.movementSearchResult || !this.movementSearchResult[0]) {
			cleanUpMovement.call(this);
			return;
		}

		var deltax = this.movementSearchResult[0].x - startxy.x;
		var deltay = this.movementSearchResult[0].y - startxy.y;

		this.movingObject.updateMovementAnimation(deltax, deltay);

		this.movingObject.animations.x += deltax * this.movingObject.moveSpeed;
		this.movingObject.animations.y += deltay * this.movingObject.moveSpeed;
		this.movingObject.x += deltax * this.movingObject.moveSpeed;
		this.movingObject.y += deltay * this.movingObject.moveSpeed;
		tryCentering.call(this, this.movingObject, this.movingObject.moveSpeed);
	};

	/**
	 * [getMapWidth returns map width]
	 * @public
	 * @return {[type]} [description]
	 */
	this.getMapWidth = function() {
		return this.mapData.tilewidth * (this.mapData.width);
	};

	/**
	 * [getMapHeight returns map width]
	 * @public
	 * @return {[type]} [description]
	 */
	this.getMapHeight = function() {
		return this.mapData.tileheight * (this.mapData.height);
	};

	this.setImage = function(image){
		this.imageData = image;
	}
}

