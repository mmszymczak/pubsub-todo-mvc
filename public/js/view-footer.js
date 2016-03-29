(function(window){
	'use strict';

	var PopupView = function(){
		EventBus.subscribe('model:update:fail', this.showFail.bind(this));
		EventBus.subscribe('model:create:fail', this.showFail.bind(this));
		EventBus.subscribe('model:read:fail', this.showFail.bind(this));
		EventBus.subscribe('model:remove:fail', this.showFail.bind(this));
		EventBus.subscribe('model:count:fail', this.showFail.bind(this));

		EventBus.subscribe('model:create:done', this.addSuccess.bind(this));
		EventBus.subscribe('model:remove:done', this.removeSuccess.bind(this));
		EventBus.subscribe('model:update:done', this.updateSuccess.bind(this));

	}

	PopupView.prototype = {
		showFail: function(err){
			toastr.error('Opps i cant find any data :C');
		},
		addSuccess: function(todo){
			toastr.success(todo.title+'<br>Added succesfully.');
		},
		removeSuccess: function(id){
			toastr.info('Task with id ='+id+' was removed.');
		},
		updateSuccess: function(todo){
			toastr.success(todo.title+'<br>Updated successfully.');	
		}
	};

	window.app = window.app || {};
	window.app.PopupView = PopupView;
})(window);