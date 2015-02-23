/**
 * @name MapLoader
 * @class
 */

/**
 * MapLoader handles loading the Tiled map file and passing it to a Renderer
 * @constructor
 */
function MapLoader(loader) {
	var map;

	/**
	* [loadMap loads the given map file ]
	* @param {[String mapname] mapname [String mapname]}
	* @return {[type]} [none]
	*/
	this.loadMap = function(mapname) {
		loader.removeAllEventListeners();
		loader.addEventListener('fileload', handleMapLoad);
		loader.loadManifest( [ { id: 'map', src: mapname }], true, 'maps/');
	};

	/**
	* [handleMapLoad handler for preload complete]
	* @return {[type] [description]}
	*/
	function handleMapLoad() {
		map = loader.getResult('map');
		loader.removeAllEventListeners();
		loader.addEventListener('fileload', handleTilesetLoad);
		loader.loadManifest( [{ id: 'tileset', src: map.tilesets[0].name+TILESET_FILE_TYPE }], true, 'graphics/');
	}

	function handleTilesetLoad() {
		var image = loader.getResult('tileset');
		renderer.prepareRenderer(map);
		renderer.setImage(image);
		renderer.initMap();
		initActiveObjects(NUM_PLAYERS, NUM_ENEMIES);
	}

	function isValidMap() {
		// Runs some basic checks on the map to make sure it is a good map
		// checks for starting point
		// checks for end point
		// checks to make sure you can get from the start to the end point? using A*?
		// checks the size, 16-4096 I think
		// maybe if starting/ending point doesn't exist it can randomly generate?
	}

}