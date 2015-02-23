// register forms in one place
// provide interface for elements to interact with them without touching them directly


function mainMenu() {
	var menu = {
		actions: [{
			name: 'play game',
			callback: function() {
				selectMap(mainMenu);
			}
		}]
	};

	var mainMenu = new Menu(menu);
	mainMenu.render();
}

function selectMap(previous) {
	previous.hide();
	var menu = {
		actions: [{
			name: 'back',
			callback: function() {
				newGame.hide();
				mainMenu();
			}
		}, {
			name: 'next',
			callback: function() {
				selectPlayers(newGame);
			}
		}]
	};

	var forms = [{
		name: 'map',
		type: 'select',
		options: ['forrest', 'dungeon']
	}];

	var newGame = new Form(100, 100, forms, menu);
	newGame.render();
}

function selectPlayers(previous) {
	previous.hide();
	var menu = {
		actions: [{
			name: 'start game',
			callback: function() {
				startGame.hide();
			}
		}]
	};

	var forms = [{
		name: 'Number of players',
		type: 'range',
		min: 1,
		max: 4
	}];

	var startGame = new Form(200, 200, forms, menu);
	startGame.render();
}

mainMenu();