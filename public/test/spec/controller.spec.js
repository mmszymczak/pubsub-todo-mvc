describe("Controller", function(){
	'use strict';

	var controller,
		title = 'New title',
		id = 3,
		todo = {id: 6, title: "brand new title"};

	beforeEach(function(){
		spyOn(EventBus, 'subscribe').and.callThrough();
		spyOn(EventBus, 'request'); 
		this.controller = new app.Controller();
	});

	describe("constructor", function(){
		it("should be defined", function(){
			expect(this.controller).toBeDefined();
		});
		it("should subscribe EventBus", function(){
			expect(EventBus.subscribe).toHaveBeenCalled();
		});
	});

	describe("Controller.prototype functions", function(){
		xit("should called createTodo func", function(){
			spyOn(this.controller, "createTodo").and.callThrough();
			expect(this.controller.createTodo.bind(this)).toHaveBeenCalled();
		});
		xit("should called removeTodo func", function(){
			spyOn(this.controller, "removeTodo").and.callThrough();
			expect(this.controller.removeTodo).toHaveBeenCalled();
		});
	});

	describe("Prototype functions requests", function(){
		it("createTodo: should request 'model:todo:create'", function(){
			this.controller.createTodo(title);
			expect(EventBus.request).toHaveBeenCalledWith('model:todo:create',{title: title});
		});
		it("removetodo: should have been called",function(){
			EventBus.publish("view:todo:remove", id);
			
			expect(EventBus.request).toHaveBeenCalled();
		});
		it("removetodo: should request 'model:todo:remove'",function(){
			EventBus.publish("view:todo:remove", id);
			
			expect(EventBus.request).toHaveBeenCalledWith("model:todo:remove", id);
		});
		it("updateTodo: should have been called", function(){
			EventBus.publish("view:todo:update", todo);

			expect(EventBus.request).toHaveBeenCalled();
		});
		it("updateTodo: should request 'model:todo:update", function(){
			EventBus.publish("view:todo:update", todo);

			expect(EventBus.request).toHaveBeenCalledWith("model:todo:update", todo);
		});
	});

});