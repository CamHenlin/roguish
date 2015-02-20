/**
 * Menu is responsible for rendering user action options to the screen
 * @param {object} data: used to initialize position and containers via the widget constructor
 */
var Menu = function(options) {
	// constructor
	Widget.apply(this, arguments);
	this.actions = options.actions || [];

	this.setForm = function(form){
		this.form = form;
		this.container = form.el;
		this.el = $("<div></div>");
	}
	this.setForm.bind(this);

	if(options.form){
		this.setForm(options.form);
	}

	// public
	this.registerAction = function(action) {
		this.actions.push(action);
	}

	this.render = function() {
		this.el.html(template.call(this));
		container = (this.form ? this.container.find('form') : this.container);
		container.append(this.el);
		form = this.form;

		this.actions.forEach(function(action) {
			this.el.find("button[name='" + action.name + "']").click(function(event) {
				event.preventDefault();
				action.callback.bind(this);
				action.callback();
			});
		}, this);
	}

	// private
	function template() {
		html = "<div class='menu' "+this.positionStyling()+" >";
		this.actions.forEach(function(action) {
			html += "<button name='" + action.name + "'>" + action.name + "</button>";
		})
		html += "</div>";
		return html;
	}
};
