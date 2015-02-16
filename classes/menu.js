var Menu = function(data) {
	this.data = data || {};
	this.data.actions = data.actions || [];
	this.data.x = this.data.x || 0;
	this.data.y = this.data.y || 0;
	this.el = this.data.el || $('body');

	this.registerAction = function(action) {
		this.data.actions.push(action);
	}

	this.render = function() {
		this.el.html(template.call(this));
		// console.log(template.call(this))
		this.data.actions.forEach(function(action) {
			this.el.find("button[name='" + action.name + "']").click(function(event) {
				event.preventDefault();
				action.callback();
			});
		}, this);
	}

	function template() {
		html = "<form class='autoForm' style='left:" + this.data.x + "px; top:" + this.data.y + "px;' >";
		this.data.actions.forEach(function(action) {
			html += "<button name='" + action.name + "'>" + action.name + "</button>";
		})
		html += "</form>";
		return html;
	}
};


$(function() {
	attack = function() {
		console.log('attack');
	}

	move = function() {
		console.log('move');
	}

	data = {
		el: $('.forms'),
		x: 100,
		y: 400,
		actions: [{
			name: 'attack',
			callback: attack
		}, {
			name: 'move',
			callback: move
		}]
	}

	menu = new Menu(data);
	menu.render();
});