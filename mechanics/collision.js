 
/**
 * CollisionSystem system to handle collision within a map
 * @constructor
 */
var CollisionSystem = function() {
	/**
	 * Array holding collision data
	 * @type {Array}
	 */
	this.collisionArray = [[],[]];

	/**
	 * Returns true if coordinate is valid
	 * @param  {number} x    x-coordinate in pixels
	 * @param  {number} y    y-coordinate in pixels
	 * @return {boolean}
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
	 * Returns true if coordinate is valid
	 * @param  {number} x x-component in grid coordinates
	 * @param  {number} y y-component in grid coordinates
	 * @return {boolean}
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
	 * Returns false if object intersects invalid tile
	 * @param  {Object} object
	 * @return {boolean}
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
	 * Returns object with grid coordinates
	 * @param  {number} x
	 * @param  {number} y
	 * @return {Object}
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
	 * Returns true if objects intersect
	 * @param  {Object} object1
	 * @param  {Object} object2
	 * @return {boolean}
	 */
	this.simpleCollision = function(object1, object2) {
		var obj1 = object1;
		var obj2 = object2;

		if (!obj1.spriteSheet || !object2.spriteSheet) {
			return false;
		}

		return !(
				obj1.y + obj1.spriteSheet._frameHeight < obj2.y ||
				obj1.y > obj2.y + object2.spriteSheet._frameHeight ||
				obj1.x > obj2.x + object2.spriteSheet._frameWidth  ||
				obj1.x + obj1.spriteSheet._frameWidth < obj2.x
		);
	}
}














