describe("Model", function () {
    "use strict";

    var store, model,
        allTodos = [
        { id: 1, title: "The first task", completed: false, isImportant: false},
        { id: 2, title: "The second task", completed: true, isImportant: false},
        { id: 3, title: "The third task", completed: false, isImportant: true},
        { id: 4, title: "The fourth task", completed: true, isImportant: false},
        { id: 5, title: "The fifth task", completed: false, isImportant: true},
        { id: 6, title: "The sixth task", completed: true, isImportant: false},
        { id: 7, title: "The seventh task", completed: false, isImportant: true}
        ];

    beforeEach(function () {
        store = jasmine.createSpyObj("store", ["find", "save", "read", "remove"]);
        model = new app.Model(store);
    });

    describe("find", function () {

        it("should fill model with todos", function () {
            store.find.and.callFake(function (query, callback) {
                callback(null, allTodos);
            });

            model.find();

            expect(model.todos).toEqual(allTodos);
        });

        it("should publish 'model:find:done' on success", function () {
            store.find.and.callFake(function (query, callback) {
                callback(null, allTodos);
            });

            spyOn(EventBus, "publish");

            model.find();

            expect(EventBus.publish).toHaveBeenCalledWith("model:find:done", allTodos);
        });

        it("should publish 'model:find:fail' on error", function () {
            var err = new Error("error");

            store.find.and.callFake(function (query, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.find();

            expect(EventBus.publish).toHaveBeenCalledWith("model:find:fail", err);
        });
    });

    describe("save", function () {
        it("should add new todo", function (done) {
            var newTodo = { id: 1000, title: "The n-th task", completed: false };

            model.todos = allTodos.slice(0); // set initial state

            store.save.and.callFake(function (todo, callback) {
                callback(null, newTodo);
            });

            model.save({
                title: "The n-th task"
            }, function(err, todo) {
                expect(todo).toEqual(newTodo);
                expect(model.todos).toContain(jasmine.objectContaining(newTodo));
                expect(model.todos.length).toBe(allTodos.length + 1);

                done();
            });
        });

        it("should update existing todo", function (done) {
            var updatedTodo = { id: 6, title: "The sixth task updated", completed: true };

            model.todos = allTodos.slice(0); // set initial state

            store.save.and.callFake(function (todo, callback) {
                callback(null, updatedTodo);
            });

            model.save(updatedTodo, function(err, todo) {
                expect(todo).toEqual(updatedTodo);
                expect(model.todos).toContain(jasmine.objectContaining(updatedTodo));
                expect(model.todos.length).toBe(allTodos.length);

                done();
            });
        });

        it("should publish 'model:create:done' on success", function () {
            var newTodo = { id: 1000, title: "The n-th task", completed: false };

            store.save.and.callFake(function (todo, callback) {
                callback(null, newTodo);
            });

            spyOn(EventBus, "publish");

            model.save({
                title: "The n-th task"
            });

            expect(EventBus.publish).toHaveBeenCalledWith("model:create:done", newTodo);
        });

        it("should publish 'model:create:fail' on error", function () {
            var err = new Error("error");

            store.save.and.callFake(function (todo, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.save({
                title: "The n-th task"
            });

            expect(EventBus.publish).toHaveBeenCalledWith("model:create:fail", err);
        });

        it("should publish 'model:update:done' on success", function () {
            var updatedTodo = { id: 6, title: "The sixth task updated", completed: true };

            store.save.and.callFake(function (todo, callback) {
                callback(null, updatedTodo);
            });

            spyOn(EventBus, "publish");

            model.save(updatedTodo);

            expect(EventBus.publish).toHaveBeenCalledWith("model:update:done", updatedTodo);
        });

        it("should publish 'model:update:fail' on error", function () {
            var err = new Error("error");
            var updatedTodo = { id: 1110, title: "The sixth task updated", completed: true };

            store.save.and.callFake(function (todo, callback) {
                callback(err);
            });

            spyOn(EventBus, "publish");

            model.save(updatedTodo);

            expect(EventBus.publish).toHaveBeenCalledWith("model:update:fail", err);
        });
    });
});
