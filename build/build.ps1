java -jar compiler.jar `
	--js=../libs/easeljs-0.8.min.js --js=../libs/preload-0.6.min.js --js=../libs/astar.js --js=../libs/jquery-2.1.3.min.js `
	`
	--js=../classes/complexobject.class.js --js=../classes/simpleobject.class.js --js=../classes/person.class.js --js=../classes/form.js `
	`
	--js=../complexobjects/examplecomplexobject.js --js=../complexobjects/robot.js --js=../complexobjects/dragon.js `
	`
	--js=../simpleobjects/examplesimpleobject.js `
	`
	--js=../maps/map1.js `
	`
	--js=../mechanics/renderer.js --js=../mechanics/player.js --js=../mechanics/collision.js `
	--js=../mechanics/enemy.js  --js=../mechanics/constants.js --js=../mechanics/main.js `
	--js=../mechanics/maploader.js `
	`
	--js=../rules/advanceturn.js `
	`
	--js_output_file=game.min.js