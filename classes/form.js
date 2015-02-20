/**
 * the form class is responsible for rendering html inputs to the dom and provides an interface for retrieveing this information
 * @param {[type]}
 * @param {Function}
 */
var Form = function(options, action) {
	// constructor
	Widget.apply(this, arguments);

	if(typeof action == "function" || typeof action == "undefined"){
		this.action = action || null;
		this.buttonText = options.buttonText || 'submit';
	}else if(typeof action == "object"){
		this.menu = new Menu(action);
		this.menu.setForm(this);
	}
	

	// public
	this.getvalue = function(value) {
		return this.el.find("[name='" + value + "']:checked").val() || this.el.find("[name='" + value + "']").val();
	}

	this.values = function() {
		obj = {};
		this.options.fields.forEach(function(field) {
			obj[field.name] = this.getvalue(field.name);
		}, this);
		return obj;
	}

	this.render = function() {
		this.el.html(template.call(this));
		this.container.append(this.el);
		if(this.menu){
			this.menu.render();
		}else{
			this.el.find("button").click(this.action);	
		}	
	}

	// private

	function template() {
		var html = "<form class='autoForm' onsubmit='return false' "+this.positionStyling()+" >" 
			+ inputFields.call(this);
		if(this.action != null){
			html+="<button type='button'>" +this.buttonText+ "</button>"
		}
		html+="</form>";
		return html;
	}

	function textField(name) {
		return "<input placeholder='" + name + "' name='" + name + "''></input>";
	}

	function selectField(name, options) {
		var html = "<select name='" + name + "'>";
		options.forEach(function(option) {
			html += "<option name='" + option + "'>" + option + "</option>";
		});
		html += "</select>"
		return html;
	}

	function radioField(name, options) {
		var html = "<p>choose the " + name + "</p>";
		firstOption = options.shift();
		html += "<input checked type='radio' name='" + name + "' value='" + firstOption + "'>" + firstOption + "</br> "
		options.forEach(function(option) {
			html += "<input type='radio' name='" + name + "' value='" + option + "'>" + option + "</br> "
		});
		return html;
	}

	function numberField(name, min, max) {
		return "<input placeholder='number of players (" + min + "-" + max + ")' type='number' name='" + name + "' min='" + min + "' max='" + max + "'></input>"
	}

	function rangeField(name, min, max) {
		return "</br>" + name + "</br><input type='range' name='" + name + "' min='" + min + "' max='" + max + "'></input>"
	}

	function inputFields() {
		var html = "";
		this.options.fields.forEach(function(field) {
			if (field.type == 'text') {
				html += textField(field.name);
			} else if (field.type == 'select') {
				html += selectField(field.name, field.options);
			} else if (field.type == 'radio') {
				html += radioField(field.name, field.options);
			} else if (field.type == 'number') {
				html += numberField(field.name, field.min, field.max);
			} else if (field.type == 'range') {
				html += rangeField(field.name, field.min, field.max);
			}
		});
		return html;
	}
}


