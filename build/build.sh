java -jar compiler.jar \
	--js=../libs/easeljs-0.8.min.js --js=../libs/preload-0.6.min.js --js=../libs/astar.js \
	\
	--js=../classes/complexobject.class.js --js=../classes/simpleobject.class.js --js=../classes/person.class.js \
	\
	--js=../complexobjects/examplecomplexobject.js --js=../complexobjects/enemy.js   \
	\
	--js=../simpleobjects/examplesimpleobject.js \
	\
	--js=../maps/map1.js \
	\
	--js=../mechanics/renderer.js --js=../mechanics/player.js --js=../mechanics/collision.js \
	--js=../mechanics/constants.js --js=../mechanics/main.js \
	\
	--js=../rules/advanceturn.js \
	\
	--js_output_file=game.min.js