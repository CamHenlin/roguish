/**
 * Main menu form
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
* Select map menu form
* @param {Element} previous
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
			isDemo = false;
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
*
* @param {Element} previous
*/
function selectPlayers(previous) {
	previous.hide();

	var fields = [{
		text: 'Start Game',
		type: 'button',
		callback: function() {
			startGame.hide();
			activeObjects = [];
			renderer.centered = true;
			console.log(startGame.getValue('numberOfPlayers'));
			maploader.loadMap(previous.getValue('mapname') + '.json', function() {
				for (i = 0; i < parseInt(startGame.getValue('numberOfPlayers')); i++) {
					var player = new Player(i * 16 + 32, i * 16 + 32, 10);
					activeObjects.push(player);
					updateFogOfWar(player);
				}
			}.bind(this));
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