 /**
 * @name MapLoader
 * @class
 */

/**
 * MapLoader handles loading the Tiled map file and passing it to a Renderer
 * @constructor
 */
function MapLoader(loader) {
	// initilizations
	this.callback = null;
	var map;

	/**
	* Loads the given map file
	* @param {string} mapname
	* @param {callback} callback to be called when map is loaded
	*/
	this.loadMap = function(mapname, callback) {
		console.log('loading ' + mapname);
		this.callback = callback;
		loader.removeAllEventListeners();
		loader.addEventListener('fileload', handleMapLoad.bind(this));
		loader.loadManifest([{ id: 'map', src: mapname }], true, 'maps/');
	};

	/**
	* Handler for preload complete
	*/
	function handleMapLoad() {
		map = loader.getResult('map');
		console.log(map);
		console.log(map.tilesets);
		console.log(map.tilesets[0]);
		console.log(map.tilesets[0].name);
		loader.removeAllEventListeners();
		loader.addEventListener('fileload', handleTilesetLoad.bind(this));
		loader.loadManifest([{ id: 'tileset', src: map.tilesets[0].name + TILESET_FILE_TYPE }], true, 'graphics/');
	}

	/**
	 * Handler for when tileset is loaded
	 */
	function handleTilesetLoad() {
		var image = loader.getResult('tileset');
		renderer.prepareRenderer(map);
		renderer.setImage(image);
		renderer.initMap();
		if (this.callback) {
			this.callback();
		}
	}
}