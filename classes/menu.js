/**
 * creates a series of buttons from a list of callbacks
 * @param {object} data: used to initialize position and containers via the widget constructor
 */
var Menu = function(data) {
	// constructor
	Widget.apply(this, arguments);
	this.actions = data.actions || [];

	// public
	this.registerAction = function(action) {
		this.actions.push(action);
	}

	this.render = function() {
		this.el.html(template.call(this));
		this.container.append(this.el);
		this.actions.forEach(function(action) {
			this.el.find("button[name='" + action.name + "']").click(function(event) {
				event.preventDefault();
				action.callback();
			});
		}, this);
	}

	// private
	function template() {
		html = "<form class='autoForm' style='left:" + this.x + "px; top:" + this.y + "px;' >";
		this.actions.forEach(function(action) {
			html += "<button name='" + action.name + "'>" + action.name + "</button>";
		})
		html += "</form>";
		return html;
	}

	this.render();
};


$(function() {
	attack = function() {
		console.log(NewGame.values());
	}

	move = function() {
		console.log('move');
	}

	console.log(NewGame.el);

	menuData = {
		x: 0,
		y: NewGame.el.find('form').height(),
		container: NewGame.el.find('form'),
		el: $("<div></div>"),
		actions: [{
			name: 'attack',
			callback: attack
		}, {
			name: 'move',
			callback: move
		}]
	}

	menu = new Menu(menuData);
});