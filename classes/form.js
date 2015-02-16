var Form = function(data, callback){
	this.el = data.el || $('body');
	this.data = data;
	this.data.x = this.data.x || 0;
	this.data.y = this.data.y || 0;
	this.callback = callback;

	// public
	this.getvalue = function(value){
		return this.el.find("[name='"+ value +"']:checked").val() || this.el.find("[name='"+ value +"']").val();
	}

	this.values = function(){
		obj = {};
		this.data.fields.forEach(function(field){
			obj[field.name] = this.getvalue(field.name);
		}, this);
		return obj;
	}

	this.render = function(){
		this.el.html(template.call(this));
		this.el.find("button").click(this.callback);
	}

	// private
	textField = function(name){
		return "<input placeholder='" + name + "' name='" + name + "''></input>";
	}

	selectField = function(name, options){
		var html = "<select name='" + name + "'>";
		options.forEach(function(option){
			html += "<option name='"+ option +"'>" + option + "</option>";
		});
		html += "</select>"
		return html;
	}

	radioField = function(name, options){
		var html = "<p>choose the " + name + "</p>";
		firstOption = options.shift();
		html += "<input checked type='radio' name='"+ name +"' value='" + firstOption +"'>" + firstOption + "</br> "
		options.forEach(function(option){
			html += "<input type='radio' name='"+ name +"' value='" + option +"'>" + option + "</br> "
		});
		return html;
	}

	numberField = function(name, min, max){
		return "<input placeholder='number of players ("+min+"-"+max+")' type='number' name='"+name+"' min='"+min+"' max='"+max+"'></input>"
	}

	rangeField = function(name, min, max){
		return "</br>" + name + "</br><input type='range' name='"+name+"' min='"+min+"' max='"+max+"'></input>"
	}

	inputFields = function(){
		var html = "";
		this.data.fields.forEach(function(field){
			if(field.type == 'text'){
				html+=textField(field.name);
			} 
			else if (field.type == 'select'){
				html+=selectField(field.name, field.options);
			}
			else if (field.type == 'radio'){
				html+=radioField(field.name, field.options);
			}
			else if (field.type == 'number'){
				html+=numberField(field.name, field.min, field.max);
			}else if(field.type == 'range'){
				html+=rangeField(field.name, field.min, field.max);
			}
		});
		return html;
	}

	template = function(){
		return "<form class='autoForm' onsubmit='return false' style='left:" + this.data.x  + "px; top:" + this.data.y +"px;' >" 
					+ inputFields.call(this)
					+ "<button type='button'>print me</button>"
		 		"</form>";
	}
	this.render();
}


// example of use 
data = {
	x: 500, //defaults to 0
	y: 100, // defaults to 0
	el: $('.forms'), // if a element is spesified here, the default is overriden
	fields: [
		{name:'name', type:'text'},
		{name:'description', type:'text'},
		{name:'players', type:'number', min:1, max:5},
		{name:'difficulty', type:'range', min:1, max:5},
		{name:'map', type:'select', options:['forrest', 'dungeon']},
		{name:'victory condition', type:'radio', options:['capture the flag', 'war']}
	]
};
secondData = {
	x: 000, //defaults to 0
	y: 100, // defaults to 0
	el: $('.second'), // if a element is spesified here, the default is overriden
	fields: [
		{name:'name', type:'text'},
		{name:'description', type:'text'}
	]
};

// NewGame.render();
// SecondGame.render();


$(function(){

	NewGame = new Form(data, function(){
		console.log(NewGame.values());
	});

	// SecondGame = new Form(secondData, function(){
	// 	console.log(SecondGame.values());
	// });

});

