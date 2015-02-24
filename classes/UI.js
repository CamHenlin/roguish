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
			selectPlayers(newGame);
		}
	}, {
		text: 'map',
		type: 'select',
		options: ['forrest', 'dungeon']
	}];

	var newGame = new Form(100, 100, fields);
	newGame.render();
}

function selectPlayers(previous) {
	previous.hide();

	var fields = [{
		text: 'Start Game',
		type: 'button',
		callback: function() {
			startGame.hide();
			alert(startGame.getValue('numberOfPlayers'));
		}
	}, {
		text: 'Number of Players',
		type: 'range',
		id: 'numberOfPlayers',
		min: 1,
		max: 4
	}];

	var startGame = new Form(200, 200, fields);
	startGame.render();
}

mainForm();