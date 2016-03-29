describe("Store", function () {
    "use strict";

    var url = "http://localhost:8080/api/todos",
        store,
        allTodos = [
            { id: 1, title: "The first task", completed: false},
            { id: 2, title: "The second task", completed: true},
            { id: 3, title: "The third task", completed: false},
            { id: 4, title: "The fourth task", completed: true},
            { id: 5, title: "The fifth task", completed: false},
            { id: 6, title: "The sixth task", completed: true},
            { id: 7, title: "The seventh task", completed: false}
        ],
        completedTodos = allTodos.filter(function(todo) { return todo.completed }),
        activeTodos = allTodos.filter(function(todo) { return !todo.completed });

    beforeEach(function() {
    	store = new app.Store(url);
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("should find all todos", function (done) {
        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(allTodos)
        });

        store.find(function(err, todos) {
            expect(todos).toEqual(allTodos);
            done();
        })

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url);
    });

    it("should find completed todos", function (done) {
        jasmine.Ajax.stubRequest(url + "?completed=true").andReturn({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(completedTodos)
        });

        store.find({ completed: true }, function(err, todos) {
            expect(todos).toEqual(completedTodos);
            done();
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url + "?completed=true");
    });

    it("should find active todos", function (done) {
    	jasmine.Ajax.stubRequest(url + "?completed=false").andReturn({
    		status: 200,
    		contentType: 'application/json',
    		responseText: JSON.stringify(activeTodos)
    	});

    	store.find({ completed: false }, function(err, todos){
    		expect(todos).toEqual(activeTodos);
    		done();   //important thing
    	});
    	expect(jasmine.Ajax.requests.mostRecent().url).toBe(url + "?completed=false");
    });


    it("should create new todo", function (done) {
        var newTodo = {
                id: 1000,
                title: "New task"
            };

        jasmine.Ajax.stubRequest(url).andReturn({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(newTodo)
        });

        store.save({ title: "New task" }, function(err, todo) {
            expect(todo).toEqual(newTodo);
            done();
        });
    });

    it("should update todo", function (done) {
    	var updateTodo = {
    		id: 2, 
    		title:"Existing"
    	};

    	jasmine.Ajax.stubRequest(url + "/" + updateTodo.id).andReturn({
    		status: 200,
    		contentType: 'application/json',
    		responseText: JSON.stringify(updateTodo)
    	});

    	store.save({ id: 2, title:"Existing" }, function(err, todo){
    		expect(todo).toEqual(updateTodo);
    		done();
    	});
    	expect(jasmine.Ajax.requests.mostRecent().url).toBe(url + "/" + updateTodo.id);
    });

    it("should read todo", function () {
    	var once = { id: 10 };
        jasmine.Ajax.stubRequest(url + "/" + once.id).andReturn({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(once)
        });

        store.read(once.id, function(err, todos) {
            expect(todos).toEqual(once);
            done();
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url + "/" + once.id);
    });

    it("should return 'not found' error", function (done) {
    	jasmine.Ajax.stubRequest(url + "/120").andReturn({
		    "status": 404,
		    "contentType": 'text/plain',
		    "responseText": 'not found'
    	});

    	store.read(120, function(err, todo){
    		expect(err).toEqual(new Error('not found'));
    		done();
    	});
    });

    it("should delete todo", function () {
    	var removeMe = { id: 12 };
        jasmine.Ajax.stubRequest(url + "/" + removeMe.id).andReturn({
            status: 200,
            contentType: 'application/json', 
            responseText: JSON.stringify(removeMe)
        });

        store.remove(removeMe.id, function(err, todos) {
            expect(todos).not.toEqual(removeMe);
            done();
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toBe(url + "/" + removeMe.id);
    });
});
