/**
 * Widget is a 'abstract class used to construct form and menu classes for example'
 * @param {Object} data object with x, y, container and el
 */
var Widget = function(data){
	this.data = data || {};
	this.x = this.data.x || 0;
	this.y = this.data.y || 0;
	this.container = this.data.container || $('body');
	this.el = this.data.el || $("<div class='forms'></div>");
}