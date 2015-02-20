// register forms in one place 
// provide interface for elements to interact with them without touching them directly


function mainMenu(){
	menu = {
		actions: [{
			name: 'play game',
			callback: function(){
				selectMap(MainMenu);
			}
		}]
	}
	MainMenu = new Menu(menu);
	MainMenu.render();
}

function selectMap(previous){
	previous.hide();
	menu = {
		actions: [{
			name: 'back',
			callback: function(){
				NewGame.hide();
				mainMenu();
			}
		},{
			name: 'next',
			callback: function() {
				selectPlayers(NewGame);
			}
		}]
	}
	options = {
		x: 100, //defaults to 0
		y: 100, // defaults to 0
		// el: $('.forms'), // if a element is spesified here, the default is overriden
		fields: [{
			name: 'map',
			type: 'select',
			options: ['forrest', 'dungeon']
		}]
	};
	NewGame = new Form(options, menu);
	NewGame.render();
}

function selectPlayers(previous){
	previous.hide();
	menu = {
		actions: [{
			name: 'start game',
			callback: function(){
				StartGame.hide();
			}
		}]
	}
	options = {
		fields:[{
			name: 'Number of players',
			type: 'range',
			min: 1,
			max:4
		}],
	}

	StartGame = new Form(options, menu);
	StartGame.render();
}

mainMenu();