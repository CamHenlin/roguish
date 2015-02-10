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
	console.log(map1);
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
					if (y === 0) {
						for (var i = 1; i <= this.getRepeatedTopRows(); i++) {
							cellBitmap = new createjs.Sprite(tilesetSheet);
							// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
							cellBitmap.gotoAndStop(layerData.data[idx] - 1);
							cellBitmap.x = x * tilewidth;
							cellBitmap.y = (y - i) * tileheight;
							container.addChild(cellBitmap);
						}
					}

					cellBitmap = new createjs.Sprite(tilesetSheet);
					// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
					cellBitmap.gotoAndStop(layerData.data[idx] - 1);
					cellBitmap.x = x * tilewidth;
					cellBitmap.y = y * tileheight;
					container.addChild(cellBitmap);

					// internalgamestage.addChild(cellBitmap);

					this.collisionArray[y][x] = true;
				} else {
					this.collisionArray[y][x] = false;
				}
			}
		}

		container.tickEnabled = false;
		container.snapToPixel = true;
		return container;
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

