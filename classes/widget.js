/**
 * @name Widget
 * @class
 */

/**
 * Widget is a 'abstract class used to construct Dom based ui element classes and control their position on screen'
 * @param {Object} options object with x, y, container and el
 */
var Widget = function(options) {
	this.x = options.x || null;
	this.y = options.y || null;
	this.cssClass = options.cssClass || null;
	this.cssId = options.cssId || null;
	this.container = $('body');
	this.el = {}; // going to reset slightly later in the code

	console.log(this.cssClass);

	/**
	 * Returns a string with position information in css form
	 * @return {string}
	 */
	this.getPositionCSS = function() {
		if (!this.x && !this.y) {
			return "";
		} else {
			return "style='position:absolute; top:" + this.y + "px; left: " + this.x + "px;'";
		}
	};

	// ugly hack to have to move this declaration here, since we want to use the getPositionCSS method:
	this.el = $("<div class='forms' " + this.getPositionCSS() + "></div>");
	if(this.cssClass){
		this.el.addClass(this.cssClass);
	}else{
		this.el.addClass("forms-default");
	}

	/**
	 * Hides element
	 * @return {Widget}
	 */
	this.hide = function() {
		this.el.hide();
		return this
	};

	/**
	 * Shows element
	 * @return {void} []
	 */
	this.show = function() {
		this.el.show();
	};

	/**
	 * Removes element
	 * @return {void} []
	 */
	this.destroy = function() {
		this.el.remove();
	}
}
