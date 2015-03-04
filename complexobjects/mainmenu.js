/**
 * [mainForm main menu form]
 * @return {[type]} [description]
 */
function mainForm() {
	var fields = [{
		text: 'New Game',
		type: 'button',
		callback: function() {
			console.log('click')
			selectMap(mainMenu);
		}
	}];

	var mainMenu = new Form(fields);
	mainMenu.render();
}

/**
* [select map menu form]
*/
function selectMap(previous) {
	previous.hide();
	var fields = [{
		text: 'back',
		type: 'button',
		callback: function() {
			newGame.hide();
			mainForm();
		}
	}, {
		text: 'next',
		type: 'button',
		callback: function() {
			console.log('next thing');
			console.log(newGame.getValue('mapname'))
			console.log('named')
			selectPlayers(newGame);
		}
	}, {
		text: 'map',
		type: 'select',
		options: ['dungeon', 'outside'],
		id: 'mapname'
	}];

	var newGame = new Form(100, 100, fields);
	newGame.render();
}

/**
* [select map menu form]
*/
function selectPlayers(previous) {
	previous.hide();

	var fields = [{
		text: 'Start Game',
		type: 'button',
		callback: function() {
			startGame.hide();
			console.log(startGame.getValue('numberOfPlayers')); //this was an alert
			maploader.loadMap(previous.getValue('mapname')+'.json')
		}
	}, {
		text: 'Number of Players',
		type: 'range',
		id: 'numberOfPlayers',
		min: 1,
		max: 4
	}];
	console.log("this is a new game")
	var startGame = new Form(200, 200, fields);
	startGame.render();
}

mainForm();