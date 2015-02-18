/**
 * @name MapLoader
 * @class
 */

/**
 * MapLoader handles loading the Tiled map file and passing it to a Renderer
 * @param {[CreateJS loader] loader [CreateJS loader]}
 * @param {[Renderer renderer] renderer [Renderer renderer]}
 * @constructor
 */
 function MapLoader(loader,renderer) {
  var maploader = new createjs.LoadQueue(false);
  var maprenderer = renderer;

   /**
  * [loadMap loads the given map file ]
  * @param {[String mapname] mapname [String mapname]}
  * @return {[type]} [none]
  */
  this.loadMap = function(mapname) {
    maploader.addEventListener('fileload', handleComplete);
    maploader.loadManifest( [ { id: 'map', src: mapname } ],true,'maps/');
    console.log('map loaded.');
    };

  /**
  * [handleComplete handler for preload complete]
  * @return {[type] [description]}
  */ 
  function handleComplete() {
    maprenderer.prepareRenderer(maploader.getResult('map'));
    maprenderer.initMap();
    initPlayers(3);
    initEnemies(2);
    };

  }