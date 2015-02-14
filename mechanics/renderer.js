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
	this.mapData = map1; // this is our tiled JSON data
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

	// getting imagefile from first tileset
	if (this.mapData.tilesets[0].image.indexOf("..\/") > -1) {
		this.mapData.tilesets[0].image = this.mapData.tilesets[0].image.replace("..\/", "");
	}

	this.tileset.src = this.mapData.tilesets[0].image;

	/**
	 * [completeRenderer run at the end of our map rendering process]
	 * @return {[type]} [none]
	 */
	function completeRenderer() {
		this.gamestage.removeAllChildren(); // clear the gamestage since we are ready to render.
		this.doneRendering = true;
		this.gamestage.addChild(this.backgroundContainer);
		this.gamestage.addChild(this.container);
		this.gamestage.addChild(this.foregroundContainer);9
	};

	/**
	 * [initLayers initialize all of the layers in the map]
	 * @return {[type]} [none]
	 */
	function initLayers() {
		var w = this.mapData.tilesets[0].tilewidth;
		var h = this.mapData.tilesets[0].tileheight;
		this.simpleobjects = [];
		this.complexObjects = [];

		if (this.mapData.tilesets[0].image.indexOf("..\/") > -1) {
			this.mapData.tilesets[0].image = this.mapData.tilesets[0].image.replace("..\/", "");
		}

		var imageData = {
			images : [ loader.getResult(this.mapData.tilesets[0].image.split("/")[1].split(".")[0]) ],
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
	 * @return [description]
	 */
	function cleanUpMovement() {
		this.moving = false;
		this.movingObject.animations.gotoAndPlay("stand-front");
		this.movingObject.turnCounter = 0;
		this.movingObject = {};
		this.moveToX = 0;
		this.moveToY = 0;
		this.movingToCellTarget = {};
		this.movementSearchResult = [];
		playerTurn = false;
	}

	/**
	 * [shiftMap description]
	 * @param  {[type]} xamount [description]
	 * @param  {[type]} yamount [description]
	 * @return {[type]}         [description]
	 */
	function shiftMap(xamount, yamount) {
		// right here we will actually have to iterate over other players and watched objects not contained by the renderer and move them in the opposite direction as well
		for (i = 0; i < enemies.length; i++) {
			enemies[i].animations.x -= xamount;
			enemies[i].animations.y -= yamount;
		}
		for (i = 0; i < players.length; i++) {
			if (!players[i] === this.movingObject) {
				enemies[i].animations.x -= xamount;
				enemies[i].animations.y -= yamount;
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
	 * [initMap initializes the renderer, gets it ready to render a new map]
	 * @return {[type]} [none]
	 */
	this.initMap = function () {
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
	 * @param  {[type]} targetx             [description]
	 * @param  {[type]} targety             [description]
	 * @return {[type]}               [description]
	 */
	this.moveObjectTo = function(trackedObject, targetx, targety) {
		targetx -= this.container.x;
		targety -= this.container.y;
		if (!collisionSystem.checkCellValid(targetx, targety) ||
			(collisionSystem.getCollisionCoordinateFromCell(trackedObject.x, trackedObject.y).x = targety &&
			 collisionSystem.getCollisionCoordinateFromCell(trackedObject.x, trackedObject.y).y === targety)) {
			cleanUpMovement.call(this);
			console.log('invalid target!');
			return;
		}

		this.moveToX = targetx;
		this.moveToY = targety;
		this.movingToCellTarget = collisionSystem.getCollisionCoordinateFromCell(this.moveToX, this.moveToY);
		this.movingToCellStart = collisionSystem.getCollisionCoordinateFromCell(this.movingObject.x, this.movingObject.y);
		this.moving = true;
		this.movingObject = trackedObject;
	};

	/**
	 * [movementTickActions description]
	 * @return {[type]} [description]
	 */
	this.movementTickActions = function() {
		var startxy = collisionSystem.getCollisionCoordinateFromCell(this.movingObject.x + this.movingObject.animations.spriteSheet._frameWidth / 2, this.movingObject.y + this.movingObject.animations.spriteSheet._frameHeight);
		if (!this.movementSearchResult[0] || (startxy.x === this.movementSearchResult[0].x && startxy.y === this.movementSearchResult[0].y)) {
			var start = this.movementGraph.grid[startxy.x][startxy.y];
			var end = this.movementGraph.grid[this.movingToCellTarget.x][this.movingToCellTarget.y];
			this.movementSearchResult = astar.search(this.movementGraph, start, end);
		}

		if (this.movingToCellTarget.y === startxy.y && this.movingToCellTarget.x === startxy.x || !collisionSystem.checkCellValid(startxy.x, startxy.y) || !this.movementSearchResult || !this.movementSearchResult[0]) {
			cleanUpMovement.call(this);
			return;
		}

		// figure out if we should move the player or the map:
		// these if statements require some explanation since they are basically unreadable

		// if the player is centered on neither x nor y coordinates of map
		if (((this.movingObject.x > gamestage.canvas.width / 2) &&
			(this.getMapWidth() > this.movingObject.x + gamestage.canvas.width / 2)) &&
			((this.movingObject.y > gamestage.canvas.height / 2) &&
				   (this.getMapHeight() > this.movingObject.y + gamestage.canvas.height / 2))
			) {

			shiftMap.call(this, (this.movementSearchResult[0].x - startxy.x) * this.movingObject.moveSpeed, (this.movementSearchResult[0].y - startxy.y) * this.movingObject.moveSpeed);
		// if the player is centered on x but not y
		} else if ((this.movingObject.x > gamestage.canvas.width / 2) &&
			(this.getMapWidth() > this.movingObject.x + gamestage.canvas.width / 2) &&
			!((this.movingObject.y > gamestage.canvas.height / 2) &&
				   (this.getMapHeight() > this.movingObject.y + gamestage.canvas.height / 2))) {

			shiftMap.call(this, (this.movementSearchResult[0].x - startxy.x) * this.movingObject.moveSpeed, 0);
			this.movingObject.animations.y += (this.movementSearchResult[0].y - startxy.y) * this.movingObject.moveSpeed;
		// if the player is centered on y but not x
		} else if ((this.movingObject.y > gamestage.canvas.height / 2) &&
				   (this.getMapHeight() > this.movingObject.y + gamestage.canvas.height / 2) &&
				   !((this.movingObject.x > gamestage.canvas.width / 2) &&
			(this.getMapWidth() > this.movingObject.x + gamestage.canvas.width / 2))) {

			shiftMap.call(this, 0, (this.movementSearchResult[0].y - startxy.y) * this.movingObject.moveSpeed);
			this.movingObject.animations.x += (this.movementSearchResult[0].x - startxy.x) * this.movingObject.moveSpeed;
		// if the player is not centered at all
		} else {
			this.movingObject.animations.x += (this.movementSearchResult[0].x - startxy.x) * this.movingObject.moveSpeed;
			this.movingObject.animations.y += (this.movementSearchResult[0].y - startxy.y) * this.movingObject.moveSpeed;
		}

		// inherited from person class
		this.movingObject.updateMovementAnimation(this.movementSearchResult[0].x - startxy.x, this.movementSearchResult[0].y - startxy.y);

		this.movingObject.x += (this.movementSearchResult[0].x - startxy.x) * this.movingObject.moveSpeed;
		this.movingObject.y += (this.movementSearchResult[0].y - startxy.y) * this.movingObject.moveSpeed;
	};

	/**
	 * [getMapWidth returns map width]
	 * @return {[type]} [description]
	 */
	this.getMapWidth = function() {
		return this.mapData.tilewidth * (this.mapData.width);
	};

	/**
	 * [getMapHeight returns map width]
	 * @return {[type]} [description]
	 */
	this.getMapHeight = function() {
		return this.mapData.tileheight * (this.mapData.height - 1);
	};
}

