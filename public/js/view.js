(function(window){
	'use strict';

	var toDoTemplateElement 
		=	'<li data-id="{{id}}" class="{{completed}} {{important}}">'
		+		'<div class="view">'
		+			'<input class="toggle" type="checkbox" {{checked}}>'
		+			'<label>{{title}}</label>'
		+			'<button class="turn-important"></button>'
		+			'<button class="destroy"></button>'
		+		'</div>'
		+	'</li>';

	function getToDoElementHtml(todo){
		var template = toDoTemplateElement;
		var completed = '';
		var checked = '';
		var important = '';

		if (todo.completed) {
			completed = 'completed';
			checked = 'checked';
		}
		if (todo.isImportant) {
			important = 'important';
		}

		template = template.replace('{{id}}', todo.id);
		template = template.replace('{{title}}', todo.title);
		template = template.replace('{{completed}}', completed);
		template = template.replace('{{checked}}', checked);
		template = template.replace('{{important}}', important);

		return template;
	}
		
	function addListElementListeners(ctx){
		ctx.$todoList.on('click', '.destroy', function(evt){
			EventBus.publish("view:todo:remove", _getParentIDFromTarget(evt));
		});

		ctx.$todoList.on('click', '.toggle', function(evt){
			EventBus.publish("view:todo:update", _getEventReturnObject(evt));
		});

		ctx.$todoList.on('click', '.turn-important', function(evt){
			EventBus.publish("view:todo:update", _getParentClassReturnObject(evt));
		});
	} 

	function addRemoveCompletedListener(ctx){
		ctx.$footer.on('click', '.clear-completed', function(e){
			$('.completed').each(function(){
				var id = $(this).attr('data-id');
				EventBus.publish("view:todo:remove", id);
			});
		});
	}

	function addElementOnChangeListener(ctx){
		ctx.$newTodo.change(function(e){
			if(e.target.value.trim() === ''){
				e.target.value = ''; 
				return;
			}
			EventBus.publish("view:todo:create", e.target.value);
			e.target.value = "";
		});
	}

	function addAllElementCompletedListener(ctx){
		ctx.$toggleAll.on('click', function(){
			ctx.$todoList.find('li').each(function(){
				var id = $(this).attr('data-id');
				EventBus.publish("view:todo:update", 
					{id: id, completed: true, isImportant: false});
			});
		}.bind(ctx));
	}

	function toggleClassFilter(){
		var route = window.location.hash.split('/')[1];
		$('.filters .selected').toggleClass('selected');
		$('.filters [href="#/' + route + '"]').toggleClass('selected');
	}

    function getActiveElementsCouter(){
		EventBus.request("model:todos:counter");
		EventBus.subscribe("model:count:done", function(counter){
	        if(typeof counter === "object"){
                $('.counter').html('Time to rest :)');
            }else if(counter == 1){
                $('.counter').html(counter + ' task to do.');
            }else{
                $('.counter').html(counter + ' tasks to do.');
            }
        });
    }

	function addBusListeners(ctx){
		EventBus.subscribe("todos:init", ctx.init.bind(ctx));
		EventBus.subscribe("model:find:done", ctx.show.bind(ctx));
		EventBus.subscribe("model:create:done", ctx.addElement.bind(ctx));
		EventBus.subscribe("model:update:done", ctx.updateElement.bind(ctx));
		EventBus.subscribe("model:remove:done", ctx.removeElement.bind(ctx));
	}
	
//  //  //  //  //  //  //  //  //  //  //  //  //  //  //
	var View = function(){
		this.$todoList = $(".todo-list");
		this.$newTodo = $(".new-todo");
		this.$toggleAll = $('.toggle-all');
		this.$footer = $('.footer');

		addBusListeners(this);
		addListElementListeners(this);
		addElementOnChangeListener(this);
		addAllElementCompletedListener(this);
		addRemoveCompletedListener(this);
	};

	View.prototype = {
		init: function(locationhash){
			toggleClassFilter();
			getActiveElementsCouter();
			EventBus.request("model:todos:find", _getQueryBasedOnUrl(locationhash));
		},
		show: function(todos){
			this.$todoList.html('');
			todos.forEach(function(todo){
				if(todo.isImportant){
					this.$todoList.prepend(getToDoElementHtml(todo));
				}else{
					this.$todoList.append(getToDoElementHtml(todo));
				}
			}, this);
		},
		addElement: function(todo){
			this.$todoList.append(getToDoElementHtml(todo));
			this.init(document.location.hash);
		},
		updateElement: function(todo){
			this.$todoList.find('li[data-id='+todo.id+']').replaceWith(getToDoElementHtml(todo));
			this.init(document.location.hash);
		},
		removeElement: function(id){
			this.$todoList.find('li[data-id='+id+']')[0].remove();
			getActiveElementsCouter();
		}
	}

//	kind like private functions
	function _getQueryBasedOnUrl(locationhash){
		var query = {};
		switch(locationhash){
			case('#/active'): query = {completed: false}; break;
			case('#/completed'): query = {completed: true}; break;
			case('#/important'): query = {isImportant: true}; break;
		}
		return query;
	}
	function _getParentIDFromTarget(evt, param){
		var $parentLi = $(evt.target).closest('li[data-id]'),
			id = $parentLi.attr('data-id');
		return id;
	}
	function _getEventReturnObject(evt){
		var parentId = $(evt.target).closest('li[data-id]').attr('data-id'),
			obj = {id: parentId, completed: evt.target.checked, isImportant: false};
		return obj;
	}
	function _getParentClassReturnObject(evt){
		var $parentLi = $(evt.target).closest('li[data-id]'),
			id = $parentLi.attr('data-id'),
			bool = $parentLi[0].classList.contains('important');
		
		(bool) ? bool = false : bool = true;
		return {id: id, isImportant: bool, completed: false };
	}

	window.app = window.app || {};
	window.app.View = View;
})(window);