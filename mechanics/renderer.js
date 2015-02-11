/**
 * [Renderer handles rendering a map file to the canvas]
 * @param {[type]} gamestage [EaselJS stage]
 */
function Renderer(gamestage) {
	this.backgroundContainer = new createjs.Container();
	this.collisionArray = [[],[]];
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

	console.log('initializing renderer');

	// getting imagefile from first tileset
	if (this.mapData.tilesets[0].image.indexOf("..\/") > -1) {
		this.mapData.tilesets[0].image = this.mapData.tilesets[0].image.replace("..\/", "");
	}

	this.tileset.src = this.mapData.tilesets[0].image;

	/**
	 * [initMap initializes the renderer, gets it ready to render a new map]
	 * @return {[type]} [none]
	 */
	this.initMap = function () {
		this.initLayers();
		this.completeRenderer();

		this.doneRendering = true;
	};

	/**
	 * [prepareRenderer basically reinitialize all of our variables here, gets us ready to draw a new map]
	 * @param  {[type]} mapData [new map JSON]
	 * @return {[type]}         [none]
	 */
	this.prepareRenderer = function(mapData) {
		this.backgroundContainer = new createjs.Container();
		this.collisionArray = [[],[]];
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

		var fillColor = new createjs.Shape();
		// kind of convuluted, but basically, fill the whole canvas, possibly with a bigger area than the canvas if the map is bigger than the canvas, with the map's backgroundColor property
		//fillColor.graphics.beginFill('#' + this.mapData.properties.backgroundColor).drawRect(0, 0, (this.getMapWidth() > gamestage.canvas.width) ? this.getMapWidth() : gamestage.canvas.width, this.getMapHeight() + this.mapData.tileheight);
		//this.backgroundContainer.addChild(fillColor);
	};

	/**
	 * [completeRenderer run at the end of our map rendering process]
	 * @return {[type]} [none]
	 */
	this.completeRenderer = function() {
		this.gamestage.removeAllChildren(); // clear the gamestage since we are ready to render.
		this.doneRendering = true;

		this.gamestage.addChild(this.backgroundContainer);
		this.gamestage.addChild(this.container);
		this.gamestage.addChild(this.foregroundContainer);
		console.log('rendering done!');
	};

	/**
	 * [initLayers initialize all of the layers in the map]
	 * @return {[type]} [none]
	 */
	this.initLayers = function() {

		console.log(this.mapData);
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
					this.backgroundContainer.addChild(this.initDrawableLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				} else if (i === 1) { // background 1
					this.backgroundContainer.addChild(this.initDrawableLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				} else if (i === 2) { // simpleobjects
					this.simpleobjects = this.initSimpleObjects(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight);
				} else if (i === 3) { // collision
					this.container.addChild(this.initDrawableLayerWithCollisionArray(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				} else if (i === 4) { // foreground
					this.foregroundContainer.addChild(this.initDrawableLayer(layer, tilesetSheet, this.mapData.tilewidth, this.mapData.tileheight));
				}
			}

			if (layer.type === 'objectgroup') { // this is the list of tiled objects, if any
				for (var j = 0; j < layer.objects.length; j++) {
					// this is where we will handle cases for object files
				}
			}
		}
	};

	/**
	 * [initSimpleObjects initialization method for simple objects]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @return {[type]}              [description]
	 */
	this.initSimpleObjects = function(layerData, tilesetSheet, tilewidth, tileheight) {
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
	};

	/**
	 * [initDrawableLayer draws a single visible layer to a container]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @return {[type]}              [EaselJS container]
	 */
	this.initDrawableLayer = function(layerData, tilesetSheet, tilewidth, tileheight) {
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
	};

	/**
	 * [initLayerWithCollisionArray Same as initDrawableLayer, but also builds the renderer's collision array]
	 * @param  {[type]} layerData    [description]
	 * @param  {[type]} tilesetSheet [description]
	 * @param  {[type]} tilewidth    [description]
	 * @param  {[type]} tileheight   [description]
	 * @return {[type]}              [EaselJS container]
	 */
	this.initDrawableLayerWithCollisionArray = function(layerData, tilesetSheet, tilewidth, tileheight) {
		var container = new createjs.Container();

		this.collisionArray = new Array(layerData.height);
		for (var y = 0; y < layerData.height; y++) {
			this.collisionArray[y] = new Array(layerData.width);
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

					// internalgamestage.addChild(cellBitmap);

					this.collisionArray[y][x] = 0;
				} else {
					this.collisionArray[y][x] = 1;
				}
			}
		}

		this.movementGraph = new Graph(this.collisionArray);

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
	};

	/**
	 * [moveTo shifts the map in a certain way]
	 * @param  {[type]} trackedObject [description]
	 * @param  {[type]} targetx             [description]
	 * @param  {[type]} targety             [description]
	 * @return {[type]}               [description]
	 */
	this.moveTo = function(trackedObject, targetx, targety) {
		if (!this.checkCellValid(targetx, targety) ||
			(this.getCollisionCoordinateFromCell(trackedObject.x, trackedObject.y).x = targety &&
			 this.getCollisionCoordinateFromCell(trackedObject.x, trackedObject.y).y === targety)) {

			console.log('invalid target!');
			return;
		}

		this.moveToX = targetx;
		this.moveToY = targety;
		this.movingToCellTarget = this.getCollisionCoordinateFromCell(this.moveToX, this.moveToY);
		this.movingToCellStart = this.getCollisionCoordinateFromCell(this.movingObject.x, this.movingObject.y);
		this.moving = true;
		console.log(trackedObject);
		this.movingObject = trackedObject;
	};

	/**
	 * [movementTickActions description]
	 * @return {[type]} [description]
	 */
	this.movementTickActions = function() {
		var startxy = this.getCollisionCoordinateFromCell(this.movingObject.x, this.movingObject.y);
		if (this.movingToCellTarget.y === startxy.y && this.movingToCellTarget.x === startxy.x) {
			this.moving = false;
			this.movingObject = {};
			this.moveToX = 0;
			this.moveToY = 0;
			this.movingToCellTarget = {};
			return;
		}

		var start = this.movementGraph.grid[startxy.x][startxy.y];
		var end = this.movementGraph.grid[this.movingToCellTarget.x][this.movingToCellTarget.y];
		var result = astar.search(this.movementGraph, start, end);
		// figure out if we should move the player or the map:
		// these if statements require some explanation since they are basically unreadable

		// if the player is centered on neither x nor y coordinates of map
		if (((this.movingObject.x > gamestage.canvas.width / 2) &&
			(this.getMapWidth() > this.movingObject.x + gamestage.canvas.width / 2)) &&
			((this.movingObject.y > gamestage.canvas.height / 2) &&
				   (this.getMapHeight() > this.movingObject.y + gamestage.canvas.height / 2))
			) {

			this.shiftMap((result[0].x - startxy.x) * this.movingObject.moveSpeed, (result[0].y - startxy.y) * this.movingObject.moveSpeed);
		// if the player is centered on x but not y
		} else if ((this.movingObject.x > gamestage.canvas.width / 2) &&
			(this.getMapWidth() > this.movingObject.x + gamestage.canvas.width / 2) &&
			!((this.movingObject.y > gamestage.canvas.height / 2) &&
				   (this.getMapHeight() > this.movingObject.y + gamestage.canvas.height / 2))) {
			// right here we will actually have to iterate over other players and watched objects not contained by the renderer and move them in the opposite direction as well

			this.shiftMap((result[0].x - startxy.x) * this.movingObject.moveSpeed, 0);
			this.movingObject.animations.y += (result[0].y - startxy.y) * this.movingObject.moveSpeed;
		// if the player is centered on y but not x
		} else if ((this.movingObject.y > gamestage.canvas.height / 2) &&
				   (this.getMapHeight() > this.movingObject.y + gamestage.canvas.height / 2) &&
				   !((this.movingObject.x > gamestage.canvas.width / 2) &&
			(this.getMapWidth() > this.movingObject.x + gamestage.canvas.width / 2))) {

			this.shiftMap(0, (result[0].y - startxy.y) * this.movingObject.moveSpeed);
			this.movingObject.animations.x += (result[0].x - startxy.x) * this.movingObject.moveSpeed;
		// if the player is not centered at all
		} else {
			this.movingObject.animations.x += (result[0].x - startxy.x) * this.movingObject.moveSpeed;
			this.movingObject.animations.y += (result[0].y - startxy.y) * this.movingObject.moveSpeed;
		}

		this.movingObject.x += (result[0].x - startxy.x) * this.movingObject.moveSpeed;
		this.movingObject.y += (result[0].y - startxy.y) * this.movingObject.moveSpeed;
	};

	/**
	 * [shiftMap description]
	 * @param  {[type]} xamount [description]
	 * @param  {[type]} yamount [description]
	 * @return {[type]}         [description]
	 */
	this.shiftMap = function(xamount, yamount) {
		this.backgroundContainer.x -= xamount;
		this.backgroundContainer.y -= yamount;
		this.container.x -= xamount;
		this.container.y -= yamount;
		this.foregroundContainer.x -= xamount;
		this.foregroundContainer.y -= yamount;
	}

	/**
	 * [checkCellValid check cell valid]
	 * @param  {[type]} playerCollisionPoints [description]
	 * @param  {[type]} collisionArray        [description]
	 * @param  {[type]} heightOffset          [description]
	 * @param  {[type]} widthOffset           [description]
	 * @return {[type]}                       [description]
	 */
	this.checkCellValid = function(x, y) {
		var tilesize = 16; // this is used as width and height!

		try {
			var a = ~~(y / tilesize);
			var b = ~~(x / tilesize);

			if (a <= -1 || a > this.collisionArray.length) {
				a = 0;
			}

			if (b <= -1 || b > this.collisionArray[a].length) {
				b = 0;
			}

			if (this.collisionArray[a][b] === 0) { // if there is an item in the collision array, that means we can't go there
				return false;
			}
		} catch (error) {

		}

		return true;
	};

	/**
	 * [getCollisionCoordinateFromCell description]
	 * @param  {[type]} x [description]
	 * @param  {[type]} y [description]
	 * @return {[type]}   [description]
	 */
	this.getCollisionCoordinateFromCell = function(x, y) {
		var tilesize = 16; // this is used as width and height!

		var a = ~~(y / tilesize);
		var b = ~~(x / tilesize);

		if (a <= -1 || a > this.collisionArray.length) {
			a = 0;
		}

		if (b <= -1 || b > this.collisionArray[a].length) {
			b = 0;
		}

		return {x: b, y: a};
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

