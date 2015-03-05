/**
 * @name  Collision
 * @class
 */

/**
 * CollisionSystem system to handle collision within a map
 * @constructor
 */
var CollisionSystem = function() {
	this.collisionArray = [[],[]];

	/**
	 * [checkCellValid check cell valid]
	 * @param  {[type]} playerCollisionPoints [description]
	 * @param  {[type]} collisionArray        [description]
	 * @param  {[type]} x                     [description]
	 * @param  {[type]} y                     [description]
	 * @return {[type]}                       [description]
	 */
	this.checkCellValid = function(x, y) {
		var tilesize = 16; // this is used as width and height!

		try {
			var a = ~~(y / tilesize);
			var b = ~~(x / tilesize);

			if (a <= -1 || a >= this.collisionArray.length) {
				return false;
			}

			if (b <= -1 || b >= this.collisionArray[a].length) {
				return false;
			}

			if (this.collisionArray[a][b] === 0) { // if there is an item in the collision array, that means we can't go there
				return false;
			}
		} catch (error) {

		}

		return true;
	};

	/**
	 * [checkCellValid check cell valid]
	 * @param  {[type]} playerCollisionPoints [description]
	 * @param  {[type]} collisionArray        [description]
	 * @param  {[type]} tile #  x             [description]
	 * @param  {[type]} tile #  y             [description]
	 * @return {[type]}                       [description]
	 */
	this.checkCollisionCellValid = function(x, y) {
		try {
			var a = y;
			var b = x;

			if (a <= -1 || a >= this.collisionArray.length) {
				return false;
			}

			if (b <= -1 || b >= this.collisionArray[a].length) {
				return false;
			}

			if (this.collisionArray[a][b] === 0) { // if there is an item in the collision array, that means we can't go there
				return false;
			}
		} catch (error) {

		}

		return true;
	};

	/**
	 * [checkCellValid check cell valid]
	 * @param  {[type]} playerCollisionPoints [description]
	 * @return {[type]}                       [description]
	 */
	this.checkCellValidForObject = function(object) {
		var tilesize = 16; // this is used as width and height!

		try {
			// top left
			var a = ~~(object.y / tilesize);
			var b = ~~(object.x / tilesize);

			if (a <= -1 || a >= this.collisionArray.length) {
				return false;
			}

			if (b <= -1 || b >= this.collisionArray[a].length) {
				return false;
			}

			// top right
			var a = ~~(object.y / tilesize);
			var b = ~~(object.x + object.animations.spriteSheet._frameWidth / tilesize);

			if (a <= -1 || a >= this.collisionArray.length) {
				return false;
			}

			if (b <= -1 || b >= this.collisionArray[a].length) {
				return false;
			}

			if (this.collisionArray[a][b] === 0) { // if there is an item in the collision array, that means we can't go there
				return false;
			}

			// bottom left
			var a = ~~(object.y + object.animations.spriteSheet._frameHeight / tilesize);
			var b = ~~(object.x / tilesize);

			if (a <= -1 || a >= this.collisionArray.length) {
				return false;
			}

			if (b <= -1 || b >= this.collisionArray[a].length) {
				return false;
			}

			if (this.collisionArray[a][b] === 0) { // if there is an item in the collision array, that means we can't go there
				return false;
			}

			// bottom right
			var a = ~~(object.y + object.animations.spriteSheet._frameHeight / tilesize);
			var b = ~~(object.x + object.animations.spriteSheet._frameWidth / tilesize);

			if (a <= -1 || a >= this.collisionArray.length) {
				return false;
			}

			if (b <= -1 || b >= this.collisionArray[a].length) {
				return false;
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

		if (a <= -1 || a >= this.collisionArray.length) {
			a = 0;
		}

		if (b <= -1 || b >= this.collisionArray[a].length) {
			b = 0;
		}

		return {x: b, y: a};
	};

	/**
	 * [simpleCollision description]
	 * @param  {[type]} object1 [description]
	 * @param  {[type]} object2 [description]
	 * @return {[type]}         [description]
	 */
	this.simpleCollision = function(object1, object2) {
		var obj1 = object1;
		var obj2 = object2.animations;

		if (!obj1.spriteSheet || !obj2.spriteSheet) {
			return true;
		}

		return !(
				obj1.y + obj1.spriteSheet._frameHeight < obj2.y ||
				obj1.y > obj2.y + obj2.spriteSheet._frameHeight ||
				obj1.x > obj2.x + obj2.spriteSheet._frameWidth  ||
				obj1.x + obj1.spriteSheet._frameWidth < obj2.x
		);
	}
}














