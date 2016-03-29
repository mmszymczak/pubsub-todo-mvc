(function(window){
	'use strict';

	var Controller = function(){
		EventBus.subscribe("view:todo:create", this.createTodo.bind(this));
		EventBus.subscribe("view:todo:remove", this.removeTodo.bind(this));
		EventBus.subscribe("view:todo:update", this.updateTodo.bind(this));
	}

	Controller.prototype = {
		createTodo: function(title){
			EventBus.request("model:todo:create", {
				title: title
			});
		},
		removeTodo: function(id){
			EventBus.request("model:todo:remove", id);
		},
		updateTodo: function(todo){
			EventBus.request("model:todo:update", todo);
		}
	};

	window.app = window.app || {};
	window.app.Controller = Controller;
})(window);