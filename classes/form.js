$(function(){
	var Form = function(data, callback){
		el = data.el || $('body');
		this.data = data;
		this.data.x = this.data.x || 0;
		this.data.y = this.data.y || 0;
		this.callback = callback;

		// public
		this.getvalue = function(value){
			return el.find("[name='"+ value +"']:checked").val() || el.find("[name='"+ value +"']").val();
		}

		this.values = function(){
			obj = {};
			this.data.fields.forEach(function(field){
				obj[field.name] = this.getvalue(field.name);
			}, this);
			return obj;
		}

		this.render = function(){
			el.html(template());
			el.find("button").click(callback);
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
			return "<form class='autoForm' style='left:" + this.data.x  + "px; top:" + this.data.y +"px;' >" 
						+ inputFields()
						+ "<button type='button'>print me</button>"
			 		"</form>";
		}
	}

	data = {
		x: 100, //defaults to 0
		y: 100, // defaults to 0
		el: $('one'), // if a element is spesified here, the default is overriden
		fields: [
			{name:'name', type:'text'},
			{name:'description', type:'text'},
			{name:'players', type:'number', min:1, max:5},
			{name:'difficulty', type:'range', min:1, max:5},
			{name:'map', type:'select', options:['forrest', 'dungeon']},
			{name:'victory condition', type:'radio', options:['capture the flag', 'war']}
		]
	};

	NewGame = new Form(data, function(){
		console.log(NewGame.values());
	});

	NewGame.render();

});

