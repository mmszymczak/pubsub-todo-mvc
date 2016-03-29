(function (window) {
    "use strict";

    var Model = function (store) {
        this._store = store;
        this.todos = [];   

        EventBus.reply("model:todos:find", this.find.bind(this));
        EventBus.reply("model:todo:create", this.save.bind(this));
        EventBus.reply("model:todo:update", this.save.bind(this));
        EventBus.reply("model:todo:read", this.read.bind(this));
        EventBus.reply("model:todo:remove", this.remove.bind(this));
        EventBus.reply("model:todos:counter", this.activeCounter.bind(this));
    };

    Model.prototype = {
        find: function (query, callback) {
            var self = this;
            if(typeof query === "function") {
                callback = query;
                query = undefined;
            }

            this._store.find(query, function (err, todos) {
                if(err) {
                    EventBus.publish("model:find:fail", err);
                } else {
                    self.todos = todos;
                    EventBus.publish("model:find:done", todos);
                }
                if(callback) callback(err, todos);
            });
        },

        save: function (todo, callback) {
            var self = this;
            if(typeof todo === "function") {
                alert("todo needed!");
            }

            function _updateTodos(todo){
                for(var i = 0; i < self.todos.length; i++){
                    if(self.todos[i].id === todo.id){
                        self.todos[i] = todo;
                    }
                }
            }

            if(todo.id){
                this._store.save(todo, function(err, _todo){
                    if(err){
                        EventBus.publish("model:update:fail", err);
                    }else{
                        _updateTodos(_todo);
                        EventBus.publish("model:update:done", _todo);
                    }
                    if(callback) callback(err, _todo);
                });
            }else {
                this._store.save(todo, function(err, _todo){
                    if(err){
                        EventBus.publish("model:create:fail", err);
                    }else{
                        self.todos.push(_todo);
                        EventBus.publish("model:create:done", _todo);
                    }
                    if(callback) callback(err, _todo);
                });
            }
        },

        read: function (id, callback) {
            var self = this;

            function _updateTodos(todo){
                for(var i=0; i< self.todos.length; i++){
                    if(self.todos[i].id === todo.id){
                        return;
                    }
                }
                self.todos.push(todo);
            }

            this._store.read(id, function(err, todo){
                if(err){
                    EventBus.publish("model:read:fail", err);
                } else {
                    _updateTodos(todo);
                    EventBus.publish("model:read:done", todo);
                }
                if(callback) callback(err, todo);
            });
        },

        remove: function (id, callback) {
            var self = this;

            function _updateTodos(todo){ 
                for(var i=0; i< self.todos.length; i++){
                    if(self.todos[i].id === todo.id){
                        self.todos.splice(i, 1);
                    }
                    return;
                }
            }

            this._store.remove(id, function(err, todo){
                if(err){
                    EventBus.publish("model:remove:fail", err);
                } else {
                    _updateTodos(todo);
                    EventBus.publish("model:remove:done", id);
                }
                if(callback) callback(err, todo);
            });
        },

        activeCounter: function(){
            this._store.find({completed: false}, function(err, data){
                if(err) {
                    EventBus.publish("model:count:fail", err);
                } else {
                    EventBus.publish("model:count:done", data.length);
                }
            });
        }
    };

    window.app = window.app || {};
    window.app.Model = Model;
})(window);
