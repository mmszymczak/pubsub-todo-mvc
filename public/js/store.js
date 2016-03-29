(function (window, $) {
    "use strict";

    function Store(url) {
        var slash = url.substr(url.length - 1);

        if(slash === "/"){ 
            this.url = url.substring(0, url.length - 1);
        }else {
            this.url = url;
        }
    }

    Store.prototype.find = function(query, callback) {
        if(typeof query === "function") { 
            callback = query;
            query = "";
        }else if(typeof query === "undefined"){
            query = "";
        }else{
            query = "?" + $.param(query);  
        }

        $.ajax({
            type: "GET",
            url: this.url + query,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                callback(null, data);
            },
            error: function (xhr, status) {
                callback(new Error(xhr.responseText));
            }
        });
    };

    Store.prototype.remove = function(id, callback) {
        if(typeof id === "function") {
            console.log("Ey, id is needed!"); return;
        }
        $.ajax({
            type: "DELETE",
            url: this.url + "/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "text",
            success: function (data, status, xhr) {
                callback(null, data);
            },
            error: function (xhr, status) {
                callback(new Error(xhr.responseText));
            }
        });
    };

    Store.prototype.save = function(todo, callback) {
        if (todo.id) {
            $.ajax({
                type: "PUT",
                url: this.url + "/" + todo.id,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(todo),
                success: function (data, status, xhr) {
                    callback(null, data);
                },
                error: function (xhr, status) {
                    callback(new Error(xhr.responseText));
                }
            });

        } else {
            $.ajax({
                type: "POST",
                url: this.url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(todo),
                success: function (data, status, xhr) {
                    callback(null, data);
                },
                error: function (xhr, status) {
                    callback(new Error(xhr.responseText));
                }
            });
        }
    };

    Store.prototype.read = function(id, callback) {
        if(typeof id === "function") {
            console.log("Ey, id is needed!"); return;
        }
        $.ajax({
            type: "GET",
            url: this.url + "/" + id,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, status, xhr) {
                callback(null, data);
            },
            error: function (xhr, status) {
                callback(new Error(xhr.responseText));
            }
        });
    };

    window.app = window.app || {};
    window.app.Store = Store;

})(window, $);
