/**
 * @name  Constants
 */

/**
 * when a player's turn counter reaches this turn in a frame, it is their turn.
 * @type {number}
 * @constant
 * @default
 */
var MAX_TURN_COUNTER = 100;

/**
 * Speed that the map attempts to center at
 * @type {number}
 * @constant
 * @default
 */
var MAP_MOVE_SPEED = 1;

/**
 * Number of players to be instantiated
 * @type {number}
 * @constant
 * @default
 */
var NUM_PLAYERS = 1;

/**
 * Number of enemies to be instantiated
 * @type {number}
 * @constant
 * @default
 */
var NUM_ENEMIES = 1;

/**
 * Tileset file extension
 * @type {string}
 * @constant
 * @default
 */
var TILESET_FILE_TYPE = '.png';

/**
 * Default sight distance
 * @type {number}
 * @constant
 * @default
 */
var DEFAULT_PERSON_SIGHT_DISTANCE = 4;

/**
 * Default health
 * @type {number}
 * @constant
 * @default
 */
var DEFAULT_PERSON_HEALTH = 10;

/**
 * Default attack damage
 * @type {number}
 * @constant
 * @default
 */
var DEFAULT_PERSON_ATTACK = 2;

/**
 * Boolean indicating whether fps will be logged
 * @type {boolean}
 * @constant
 * @default
 */
var LOG_FPS = false;

/**
 * Maximum enemy distance
 * @type {number}
 * @constant
 * @default
 */
var MAX_ENEMY_DISTANCE = 8;

/**
 * Minimum enemy distance
 * @type {number}
 * @constant
 * @default
 */
var MAX_ENEMY_DISTANCE = 2;

/**
 * [MAX_HIGH_SCORES The max amount of high scores kept track of]
 * @type {number}
 * @constant
 * @default
 */
var MAX_HIGH_SCORES = 5;