java -jar compiler.jar \
	--js=../libs/easeljs-0.8.min.js --js=libs/preload-0.6.min.js \
	\
	--js=../classes/complexobject.class.js --js=../classes/simpleobject.class.js \
	\
	--js=../complexobjects/examplecomplexobject.js \
	\
	--js=../simpleobjects/examplesimpleobject.js \
	\
	--js=../mechanics/main.js --js=../mechanics/renderer.js --js=../mechanics/player.js \
	\
	--js_output_file=game.min.js