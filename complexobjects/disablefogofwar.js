/**
 * @name  DisableFogOfWar
 * @class
 */

/**
 * StartPoint
 * @constructor
 */
var DisableFogOfWar = function(x, y) {
	setTimeout(function() {
		for (var i = 0; i < renderer.mapData.width; i++) {
			for (var j = 0; j < renderer.mapData.height; j++) {
				renderer.fogOfWarContainer.removeChild(renderer.fogOfWarGrid[j][i]);
			}
		}
	}, 250);
};

DisableFogOfWar.prototype = new ComplexObject;
DisableFogOfWar.prototype.constructor = DisableFogOfWar;

