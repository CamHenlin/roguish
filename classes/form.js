/**
 * @name Form
 * @class
 */

var formCounter = 0;

/**
 * the form class is responsible for rendering html inputs to the dom and provides an interface for retrieving this information
 * @param {number} x
 * @param {number} y
 * @param {Function} fields
 */
var Form = function(x, y, fields, options) {
	
	this.formName = "default-form-" + formCounter + "-name-";
	formCounter++;

	// if an object is passed in for x, then we know it is actually the fields and shift the arguments over
	if (typeof(x) === "object") {
		options = y;
		fields = x;
		x = 0;
		y = 0;
	}

	this.fields = fields;
	this.header = options.header || null; 
	this.message = options.message || null;

	// inherited constructor
	Widget.apply(this, [{x: x, y: y}]);

	// public
	/**
	 * [getValue description]
	 * @param  {value} 
	 * @return {string}
	 */
	this.getValue = function(value) {
		return this.el.find("#" + value).val() || this.el.find("#" + value).is(":checked").val();
	};

	/**
	 * 
	 * @return {Object}
	 */
	this.values = function() {
		obj = {};
		this.fields.forEach(function(field) {
			obj[field.text] = this.getValue(field.text);
		}, this);
		return obj;
	};

	/**
	 * 
	 */
	this.render = function() {
		this.el.html(template.call(this));
		console.log(this.header)
		this.container.append(this.el);
		attachCallbacks.call(this);
	};

	// private
	/**
	 * [getId description]
	 * @param  {number|string} index
	 * @return {string}
	 */
	function getId(index) {
		if (typeof(index) === "number") {
			return this.formName + index.toString();
		} else {
			return index;
		}
	}

	/**
	 * 
	 * @return {string}
	 */
	function template() {
		return inputFields.call(this);
	}

	/**
	 * Displays raw text
	 * @param  {string} textToRender The string of text to render
	 * @return {string}              HTML code to be injected to display text
	 */
	function basicText(textToRender) {
		return "<p class='basic-text'>" + textToRender + "</p>";
	}

	/**
	 * [textField description]
	 * @param  {string} name 
	 * @param  {number} index 
	 * @return {string}
	 */
	function textField(name, index) {
		return "<input class='input-default' placeholder='" + name + "' id='" + getId.call(this, index) + "'></input>";
	}

	/**
	 * 
	 * @param  {string} name  
	 * @param  {number} index 
	 * @return {string}
	 */
	function buttonField(name, index) {
		return "<button class='button-default' placeholder='" + name + "' id='" + getId.call(this, index) + "'>" + name + "</button>";
	}

	/**
	 * [selectField description]
	 * @param  {string} name    
	 * @param  {string} options 
	 * @param  {number} index  
	 * @return {string}
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
	 * @param  {string} name   
	 * @param  {string} options 
	 * @param  {number} index   
	 * @return {string}        
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
	 * 
	 * @param  {string} name  
	 * @param  {number} min   
	 * @param  {number} max   
	 * @param  {number} index 
	 * @return {string}       
	 */
	function numberField(name, min, max, index) {
		return "<input class='input-default' placeholder='number of players (" + min + "-" + max + ")' type='number' id='" + getId.call(this, index) + "' min='" + min + "' max='" + max + "'></input>"
	}

	/**
	 * 
	 * @param  {string} name  
	 * @param  {number} min   
	 * @param  {number} max
	 * @param  {number} index
	 * @return {string}
	 */
	function rangeField(name, min, max, index) {
		return "</br>" + name + "</br><input class='range-default' type='range' id='" + getId.call(this, index) + "' min='" + min + "' max='" + max + "'></input>"
	}

	/**
	 * Returns a string 
	 * @return {string} 
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
	 * 
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



