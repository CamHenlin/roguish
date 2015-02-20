/**
 * Widget is a 'abstract class used to construct Dom based ui element classes and controll their position on screen'
 * @param {Object} data object with x, y, container and el
 */
var Widget = function(options){
	this.options = options || {};
	this.x = this.options.x || null;
	this.y = this.options.y || null;
	this.cssClass = this.options.cssClass || null;
	this.cssId = this.options.cssId || null;
	this.container = this.options.container || $('body');
	this.el = this.options.el || $("<div class='forms'></div>");

	this.positionStyling = function(){
		if(!this.x && !this.y){
			return "";
		}else{
			return "style='position:absolute; top:" + this.y + "px; left: " + this.x +"px;'"
		}
	}

	this.hide = function(){
		this.el.hide();
		return this
	}
	this.show = function(){
		this.el.show();
	}
}