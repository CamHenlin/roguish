# Extensible Multiplayer Rogue-Like (Name to be determined)

## Software Architecture Guidelines

### Technologies to be familiar with
- JavaScript (obviously)
- EaselJS (note: I know many of you might notice that there are other options for HTML5 graphics frameworks or even using the canvas API directly. If any of you feel strongly about using some other rendering mechanism, I am fine with that. Please discuss more if necessary)
- Tiled Map Editor

### Technologies depended on
- HTML5
- EaselJS
- Google Closure Compiler

#### Helpful websites
- [EaselJS documentation](http://www.createjs.com/Docs/EaselJS/modules/EaselJS.html)
- [JavaScript API reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Git documentation](http://git-scm.com/documentation)
- [Gamedev.net (some good ideas here, sometimes)](http://www.gamedev.net/page/index.html)
- [Gamedev StackExchange (good to search for ideas)](http://gamedev.stackexchange.com)

### Coding standards
`very important, please read`
Good coding standards are important in any development project, but particularly when multiple developers are working on the same project. Having coding standards helps ensure that the code is of high quality, has fewer bugs, and is easily maintained.

- **Indentation** Use an indent of 1 tab for each level of indent, with no spaces. This way, each developer can set their prefered visible tab width in their own editor.
- **Maximum Line Length** Code lines shouldn't be too long. Content lines can be as long as necessary (use soft-wrap).
- **Classes** Class names must start with a capital letter. If a class name is comprised of more than one word, the first letter of each new word must be capitalized.
- **Class Declaration** Classes must be named by following the naming conventions. The brace is always written on the same line as the class name. Every class must have a documentation block that conforms to the JSDoc standard. Any code within a class must be indented one tab. Only one class is recommended per JS file.
- **Class Member Variables** Any variables declared in a class must be listed at the top of the class, prior to declaring any functions.
- **Filenames** Only alphanumeric characters, underscores, and the dash character ("-") are permitted. Spaces and are prohibited.
- **Functions and Methods** Function names may only contain alphanumeric characters. Underscores are not permitted. Numbers are permitted in function names but are discouraged. Function names must always start with a lowercase letter. When a function name consists of more than one word, the first letter of each new word must be capitalized. This is commonly called the "camelCaps" method. Verbosity is encouraged. Function names should be as verbose as is practical to enhance the understandability of code. Functions in the global scope ("floating functions") are permitted but discouraged. It is recommended that these functions should be wrapped in a "static" class.
- **Function and Method Declaration** Like classes, the brace is always written on the same line as the function name. There is no space between the function name and the opening parenthesis for the arguments. Every function must have a documentation block that conforms to the JSDoc standard.
- **Function and Method Usage** Function arguments are separated by a single trailing space after the comma delimiter, with no space before or after the opening parenthesis, and no space before or after the closing parenthesis. For example: threeArguments(1, 2, 3);
- **Variables** Like function names, variable names must always start with a lowercase letter and follow the "camelCaps" capitalization convention. Verbosity is encouraged. Variables should always be as verbose as practical. Terse variable names such as "i" and "n" are discouraged for anything other than the smallest loop contexts. If a loop contains more than 20 lines of code, the variables for the indices need to have more descriptive names.
- **Constants** Constants may contain both alphanumeric characters and the underscore. Numbers are permitted in constant names. Constants must always have all letters capitalized. To enhance readablity, words in constant names must be separated by underscore characters.
- **String Literals** When a string is literal (contains no variable substitutions), the apostrophe or "single quote" must always used to demarcate the string.
- **Control Statements** Control statements based on the if and else if constructs must have a single space after the "if" or "else if" and before the opening parenthesis of the conditional. Within the conditional statements between the parentheses, operators must be separated by spaces for readability. Inner parentheses are encouraged to improve logical grouping of larger conditionals. The opening brace is written on the same line as the conditional statement. "else if" statements are written on the same line as the closing brace for the previous "if" or "else if" statement. The final closing brace is always written on its own line. Any content within the braces must be indented one tab.
- **Switch** Control statements written with the "switch" construct must have a single space after the opening "switch" of the conditional statement.
- **Comments** What you found clever, another developer may find unreadable. Please explain your clever code. If you are unsure of something, a comment stating so is good to have. If you think you did something "hacky", that's probably worth commenting about as well.
- **Commented Out Code** Commented out code is greatly discouraged. Since the system is under version control, deleted code can always be easily retrieved. The only time commented out code is allowed is when it is being used to describe a usage example. Otherwise it should be deleted prior to check in.

### Using git as a team

To best facilitate quickly sharing and updating code, it should be checked in early and often with clear git commits explaining what minor feature you added. Not only does this make it easy to track how much work you've done, but it lets others react to your changes more quickly. This also gives you an opportunity for better and faster feedback on your changes. Furthermore, a high quantity of checkins will help spotting bugs as they are introduced.

Note, the easiest way to commit code is to do so in the following manner:
> git commit -am "my commit message explaining what the hell i did"
>
> git pull --rebase
>
> git push

The `git pull --rebase` will pull down other updates from the repository, and then add your changes on top of these updates, allowing you to push your updates to the repository easily. If the updates conflict you will need to perform a merge by following onscreen instructions.

## Project Structure

Each of the items in the following list are logical groupings of code, separated by directories at the root of the project structure of the same name.

- **build** contains files for building the system. *Google Closure Compiler*, a simple build shell script, and a minified javascript output file
- **classes** extendable classes. things in *complexobjects* and *simpleobjects* would probably make use of these files.
- **complexobjects** these are the default includeable in-game objects, including things such as treasure chests, doors, etc. Items of this type are considered "active" and would run as a part of the main game loop. *Tiled* "objects" with attributes.
- **graphics** default graphics files.
- **libs** contains library files depended on by the system. For example, EaselJS.
- **maps** default map files.
- **mechanics** these are the files that control the core functionality of the entire system.
- **simpleobjects** simpleobjects differ from normal objects in that they are a simple tile layer items with no options. Allows for keeping track of objects that maybe don't need to be updated as quickly. For example, tiles that have disappearing footprints. *Tiled* "tiles" with no attributes on *active* tile layer.
- **plugins** contains user plugins - we need to build documentation on how such a plugin might attach itself to the main game loop. This is probably our most important feature.
- **tests** unit tests.

Additionally, the root of the project directory will contain:

- **index.html** main index file containing a reference to *build/build.min.js*
- **devindex.html** main index file containg a reference to all js files normally built together by *build/build.sh* or *build/build.bat* for use by developers who need access to unminified code.
- **testindex.html** html file with unit testable code, and unit test code included.

## *Tiled* Map Instructions

We need to standardize are map structure so that programmers can make assumptions about maps as they build the system, and map designers can make assumptions about what the system will do for them.

Maps in tiled allow for separate layers, and we are going to use them as follows (Layer titles in italics):

- **foreground** layer displayed over the top of the map and all sprites. Useful for things lock fog, tree covers, pillars that a player can walk behind, etc
- **collision** this is a layer of collideable objects. ie, walls, tables, rocks, etc.
- **simpleobjects** these are the layer of *simpleobjects*. They are objects that take an active role in the game, but allow for no map designer input. First thought is things like footsteps in sand that disappear, or tiles that simply kill you when you touch them. Basic enemy types can go here too, think common ones like bats, imps, in other rogue games etc.
- **background1** top background layer, used for layering on top of *background2* layer, makes doing certain types of art easier
- **background2** bottom background layer. combined with *background1* layer at render time.

Additionally, we need to add an *object* layer, which will allow us more general *complexobjects* with map-designer-defined properties.

## Project code groupings

### *Mechanics* Files

This section is comprised of files that the system depends on. For example, one of the mechanics files is the file containing the main game loop. Another is the file containing the definitions for the user interface. Yet another for the rendering system. The game would be incomplete if it were missing any of these files, and unable to run.

- **renderer** handles rendering a map file to the canvas
- **main** contains code for main loop
- **forms** contains generic code for building menus and forms
- **player** contains code for player
- **collision** collison detection code goes here

### *Classes* Files

Any more ideas as to what we can have as some default classes to inherit from?

- *NPC* I'm thinking generically, maybe have some generic enemy types that inherit from this as well
- *triggers* I'm thinking things that when they are triggered, allows something else to happen. For example, I press a switch, I can open a treasure chest elsewhere on the map.
- *magic* Probably some type of generic that magic spells can inherit from?

## Project code documentation reasoning/discussion

### Renderer

The basic idea is that the renderer needs to pull in a JSON tiled map, render it to the screen, and then handle player movement around the map each frame (more difficult than it sounds) when asked to do so by the *main loop*.

### Main Game Loop

This is the game "loop" that runs continuously, updating the onscreen graphics, calling tickhandlers for each "tickable" object, requesting the renderer for map updates, etc. Note that this is not actually a loop but a requestAnimationFrame run 60 times per second.

Needs to implement things like calling player and enemy turns in the correct order via some type of algorithm.

### Forms

The purpose of forms is to provide a simple way to display a menu or form on top of the game. The goal is to create a z-indexed HTML element over the top of the canvas since forms do not need to have "ticks". This will be much easier to implement and help us move forward faster. We will later make specific files that generally depend on the forms, such as form files for the main menus, player information dialogs, action menus, text dialogs, etc.

### Player

Basically the object that is instantiated for each type of player.
