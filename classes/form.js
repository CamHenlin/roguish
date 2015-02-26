/**
 * @name Form
 * @class
 */

var formCounter = 0;

/**
 * the form class is responsible for rendering html inputs to the dom and provides an interface for retrieveing this information
 * @param {[type]}
 * @param {Function}
 */
var Form = function(x, y, fields) {
	this.formName = "default-form-" + formCounter + "-name-";
	formCounter++;

	// if an object is passed in for x, then we know it is actually the fields
	if (typeof(x) === "object") {
		fields = x;
		x = 0;
		y = 0;
	}

	this.fields = fields;

	// constructor
	Widget.apply(this, [{x: x, y: y}]);

	// public
	/**
	 * [getValue description]
	 * @param  {[type]} value [description]
	 * @return {[type]}       [description]
	 */
	this.getValue = function(value) {
		return this.el.find("#" + value).val() || this.el.find("#" + value).is(":checked").val();
	};

	/**
	 * [values description]
	 * @return {[type]} [description]
	 */
	this.values = function() {
		obj = {};
		this.fields.forEach(function(field) {
			obj[field.text] = this.getValue(field.text);
		}, this);
		return obj;
	};

	/**
	 * [render description]
	 * @return {[type]} [description]
	 */
	this.render = function() {
		this.el.html(template.call(this));
		this.container.append(this.el);
		attachCallbacks.call(this);
	};

	// private
	/**
	 * [getId description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	function getId(index) {
		if (typeof(index) === "number") {
			return this.formName + index.toString();
		} else {
			return index;
		}
	}

	/**
	 * [template description]
	 * @return {[type]} [description]
	 */
	function template() {
		return inputFields.call(this);
	}

	/**
	 * [basicText Displays raw text]
	 * @param  {[type]} textToRender [The string of text to render]
	 * @return {[type]}              [HTML code to be injected to display text]
	 */
	function basicText(textToRender) {
		return "<p class='basic-text'>" + textToRender + "</p>";
	}

	/**
	 * [textField description]
	 * @param  {[type]} name  [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	function textField(name, index) {
		return "<input class='input-default' placeholder='" + name + "' id='" + getId.call(this, index) + "'></input>";
	}

	/**
	 * [buttonField description]
	 * @param  {[type]} name  [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	function buttonField(name, index) {
		return "<button class='button-default' placeholder='" + name + "' id='" + getId.call(this, index) + "'>" + name + "</button>";
	}

	/**
	 * [selectField description]
	 * @param  {[type]} name    [description]
	 * @param  {[type]} options [description]
	 * @param  {[type]} index   [description]
	 * @return {[type]}         [description]
	 */
	function selectField(name, options, index) {
		var html = "<select class='select-default' id='" + getId.call(this, index) + "'>";
		options.forEach(function(option) {
			html += "<option class='option-default' id='" + option + "'>" + option + "</option>";
		});
		html += "</select>"
		return html;
	}

	/**
	 * [radioField description]
	 * @param  {[type]} name    [description]
	 * @param  {[type]} options [description]
	 * @param  {[type]} index   [description]
	 * @return {[type]}         [description]
	 */
	function radioField(name, options, index) {
		var html = "<p>choose the " + name + "</p>";
		firstOption = options.shift();
		html += "<input checked type='radio' class='radio-default' id='" + getId.call(this, index) + "' value='" + firstOption + "'>" + firstOption + "</br> "
		options.forEach(function(option) {
			html += "<input type='radio' id='" + name + "' value='" + option + "'>" + option + "</br> "
		});
		return html;
	}

	/**
	 * [numberField description]
	 * @param  {[type]} name  [description]
	 * @param  {[type]} min   [description]
	 * @param  {[type]} max   [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	function numberField(name, min, max, index) {
		return "<input class='input-default' placeholder='number of players (" + min + "-" + max + ")' type='number' id='" + getId.call(this, index) + "' min='" + min + "' max='" + max + "'></input>"
	}

	/**
	 * [rangeField description]
	 * @param  {[type]} name  [description]
	 * @param  {[type]} min   [description]
	 * @param  {[type]} max   [description]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	function rangeField(name, min, max, index) {
		return "</br>" + name + "</br><input class='range-default' type='range' id='" + getId.call(this, index) + "' min='" + min + "' max='" + max + "'></input>"
	}

	/**
	 * [inputFields description]
	 * @return {[type]} [description]
	 */
	function inputFields() {
		var html = "";
		var index = 0;
		this.fields.forEach(function(field) {
			if (field.type === 'text') {
				html += textField.call(this, field.text, (field.id) ? field.id : index);
			} else if (field.type === 'select') {
				html += selectField.call(this, field.text, field.options, (field.id) ? field.id : index);
			} else if (field.type === 'radio') {
				html += radioField.call(this, field.text, field.options, (field.id) ? field.id : index);
			} else if (field.type === 'number') {
				html += numberField.call(this, field.text, field.min, field.max, (field.id) ? field.id : index);
			} else if (field.type === 'range') {
				html += rangeField.call(this, field.text, field.min, field.max, (field.id) ? field.id : index);
			} else if (field.type === 'button') {
				html += buttonField.call(this, field.text, (field.id) ? field.id : index);
			} else if (field.type === 'basic-text') {
				html += basicText.call(this, field.text);
			}
			index++;
		}.bind(this));

		return html;
	}

	/**
	 * [attachCallbacks description]
	 * @return {[type]} [description]
	 */
	function attachCallbacks() {
		var index = 0;
		this.fields.forEach(function(field) {
			if (field.type === 'button') {
				$("#" + getId.call(this, (field.id) ? field.id : index)).click(field.callback);
			}
			index++;
		}.bind(this));
	}
}



