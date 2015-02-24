/**
 * Widget is a 'abstract class used to construct Dom based ui element classes and controll their position on screen'
 * @param {Object} data object with x, y, container and el
 */
var Widget = function(options) {
	this.x = options.x || null;
	this.y = options.y || null;
	this.cssClass = null;
	this.cssId = null;
	this.container = $('body');
	this.el = $("<div class='forms forms-default'></div>");

	this.getPositionCSS = function() {
		if (!this.x && !this.y) {
			return "";
		} else {
			return "style='position:absolute; top:" + this.y + "px; left: " + this.x + "px;'";
		}
	}

	this.hide = function() {
		this.el.hide();
		return this
	};

	this.show = function() {
		this.el.show();
	};

	this.destroy = function() {
		this.el.remove();
	}
}