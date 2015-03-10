/**
 * [mainForm Main menu form, which is displayed at the beginning of the game]
 * @return {[void]} []
 */
function mainForm() {
	var fields = [{
		text: 'New Game!',
		type: 'button',
		callback: function() {
			console.log('click')
			selectPlayers(mainMenu);
		}
	},{
		text: 'high scores',
		type: 'button',
		callback: function(){
			console.log('highscores');
		}
	}
	];
	var options = {
		header:"rougish",
		message:'a game produced in cis422'
	}

	var mainMenu = new Form(0,0,fields, options);
	mainMenu.render();
}

/**
 * [selectPlayers description]
 * @param  {[function]} previous [previous menu item, that this menu hides]
 * @return {[void]}          []
 */
function selectPlayers(previous) {
	previous.hide();

	var fields = [
	{
		type: 'range',
		id: 'numberOfPlayers',
		min: 1,
		max: 4
	},
	{
		text: 'Next',
		type: 'button',
		callback: function() {
			players.hide();
			namePlayers(parseInt(players.getValue("numberOfPlayers")), []);
		}
	}];

	var players = new Form(fields, {header:"players"});
	players.render();
}

/**
 * [namePlayers The menus for naming each player. creates a menu with a text field for player name input]
 * @param  {[type]} numPlayers [The number of players chosen, the dialog will be displayed this number of times.]
 * @param  {[type]} names      [The list of names added recursively in this function.]
 */
function namePlayers(numPlayers, names) {
	if (names.length == numPlayers) {
		activeObjects = [];
		renderer.centered = true;
		maploader.loadMap('dungeon.json', function() {
			for (var i = 0; i < numPlayers; i++) {
				var player = new Player(i * 16 + parseInt(startPoint.x), i * 16 + parseInt(startPoint.y), 10);
				player.setName(names[i]);
				activeObjects.push(player);
				updateFogOfWar(player);
			}
		}.bind(this));

		return;
	}

	var fields = [
	{
		type: "basic-text",
		text: "Player " + (names.length + 1) + " name:"
	},
	{
		type: "text",
		id: "player" + names.length,
	},
	{
		type: "button",
		text: names.length == numPlayers - 1 ? "Start Game" : "Next",
		callback: function() {
			startGame.hide();
			names.push(startGame.getValue('player' + names.length));
			namePlayers(numPlayers, names);
		}
	}];

	var startGame = new Form(fields, {header:"names"});
	startGame.render();
}

mainForm();