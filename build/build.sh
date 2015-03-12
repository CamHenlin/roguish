java -jar compiler.jar \
	--js=../libs/preload-0.6.min.js --js=../libs/easeljs-0.8.min.js --js=../libs/astar.js \
	--js=../libs/jquery-2.1.3.min.js \
	\
	--js=../classes/person.class.js --js=../classes/complexobject.class.js --js=../classes/widget.js \
	--js=../classes/form.js --js=../classes/simpleobject.class.js \
	\
	--js=../complexobjects/enemy.js --js=../complexobjects/robot.js --js=../complexobjects/dragon.js \
	--js=../complexobjects/mainmenu.js --js=../complexobjects/maplink.js --js=../complexobjects/startpoint.js \
	--js=../complexobjects/disablefogofwar.js \
	\
	--js=../simpleobjects/endgame.js \
	\
	--js=../rules/advanceturn.js --js=../rules/fogofwar.js --js=../rules/showselectablearea.js \
	--js=../rules/calculatedamage.js \
	\
	--js=../mechanics/collision.js --js=../mechanics/constants.js --js=../mechanics/maploader.js \
	--js=../mechanics/main.js --js=../mechanics/player.js --js=../mechanics/renderer.js \
	\
	--js_output_file=game.min.js