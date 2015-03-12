/**
 * @name Form
 * @class
 */

var formCounter = 0;

/**
 * the form class is responsible for rendering html inputs to the dom and provides an interface for retrieving this information
 * @param {number} x coorddinate
 * @param {number} y coordinate
 * @param {Function} list of fields
 * @param {Object} @optional options object
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
	this.header = options ? options.header || null : null;
	this.message = options ? options.message || null : null;
	this.cssClass = options ? options.cssClass || null : null;

	// inherited constructor
	Widget.apply(this, [{x: x, y: y, cssClass: this.cssClass}]);

	/**
	 * [getValue gets the value of an internal form field]
	 * @param  {value}
	 * @return {string}
	 * @public
	 */
	this.getValue = function(value) {
		return this.el.find("#" + value).val();
	};

	/**
	 * [values returns the values of all fields within a form]
	 * @return {Object}
	 * @public
	 */
	this.values = function() {
		obj = {};
		this.fields.forEach(function(field) {
			obj[field.text] = this.getValue(field.text);
		}, this);
		return obj;
	};

	/**
	 * [render renders the form to the screen]
	 * @public
	 */
	this.render = function() {
		this.el.html(template.call(this));
		if(this.message){
			this.el.prepend("<p>"+this.message+"</p>");
		}
		if(this.header){
			this.el.prepend("<h2>"+this.header+"</h2>");
		}
		this.container.append(this.el);
		attachCallbacks.call(this);
	};

	// private
	/**
	 * [getId gets the idea of a form field by its number]
	 * @param  {number|string} index
	 * @return {string}
	 * @private
	 */
	function getId(index) {
		if (typeof(index) === "number") {
			return this.formName + index.toString();
		} else {
			return index;
		}
	}

	/**
	 * [template returns the proper template for the desired form.]
	 * @return {string}
	 * @private
	 */
	function template() {
		return inputFields.call(this);
	}

	/**
	 * Displays raw text on the form field
	 * @param  {string} textToRender The string of text to render
	 * @return {string}              HTML code to be injected to display text
	 * @private
	 */
	function basicText(textToRender) {
		return "<p class='basic-text'>" + textToRender + "</p>";
	}

	/**
	 * [textField diplays a text field]
	 * @param  {string} name
	 * @param  {number} index
	 * @return {string}
	 * @private
	 */
	function textField(name, index) {
		return "<input class='input-default' placeholder='" + name + "' id='" + getId.call(this, index) + "' autofocus ></input>";
	}

	/**
	 * [buttonField displays a button field]
	 * @param  {string} name
	 * @param  {number} index
	 * @return {string}
	 * @private
	 */
	function buttonField(name, index) {
		return "<button class='button-default' placeholder='" + name + "' id='" + getId.call(this, index) + "'>" + name + "</button>";
	}

	/**
	 * [selectField displays a select field]
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
	 * [radioField displays a radio field]
	 * @param  {string} name
	 * @param  {string} options
	 * @param  {number} index
	 * @return {string}
	 * @private
	 */
	function radioField(name, options, index) {
		var html = name ? "<p>choose the " + name + "</p>" : "";
		firstOption = options.shift();
		html += "<input checked type='radio' class='radio-default' id='" + getId.call(this, index) + "' value='" + firstOption + "'>" + firstOption + "</br> "
		options.forEach(function(option) {
			html += "<input type='radio' id='" + name + "' value='" + option + "'>" + option + "</br> "
		});
		return html;
	}

	/**
	 * [numberField displays a numberField]
	 * @param  {string} name
	 * @param  {number} min
	 * @param  {number} max
	 * @param  {number} index
	 * @return {string}
	 * @private
	 */
	function numberField(name, min, max, index) {
		return "<input class='input-default' placeholder='" + min + "-" + max + "' type='number' id='" + getId.call(this, index) + "' min='" + min + "' max='" + max + "' autofocus></input>"
	}

	/**
	 * [rangeField displays a range field]
	 * @param  {string} name
	 * @param  {number} min
	 * @param  {number} max
	 * @param  {number} index
	 * @return {string}
	 * @private
	 */
	function rangeField(name, min, max, defaultValue, index) {
		var html = name ? "</br>" + name + "</br>" : "";
		return html + "<input class='range-default' type='range' id='" + getId.call(this, index) + "' min='" + min + "' max='" + max + "' value='"+defaultValue+"'></input>";

	}

	/**
	 * [inputFields handles the display of all types of fields]
	 * Returns a string of the fields' HTML
	 * @return {string}
	 * @private
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
				html += rangeField.call(this, field.text, field.min, field.max, field.value, (field.id) ? field.id : index);
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
	 * [attachCallbacks attaches the proper callback functions to each form.]
	 * @private
	 */
	function attachCallbacks() {
		var index = 0;
		this.fields.forEach(function(field) {
			if (field.type === 'button') {
				$("#" + getId.call(this, (field.id) ? field.id : index)).click(field.callback);
			}
			if(field.key){
				// $("body").unbind();
				// console.log(Mousetrap);
				// $("body").keypress(function(event){
				// 	if(event.which == field.key.charCodeAt()){
				// 		console.log(field);
				// 		field.callback();
				// 	}
				// });
			}
			index++;
		}.bind(this));
	}
}



