var _ = require("lodash"),
    express = require("express");
    bodyParser = require("body-parser"),
    app = express();

app.use(bodyParser.json());

var DEFAULT_PAGE_LEN = 1000;

var todos = [
    { id: 1, title: "The first task", completed: false, isImportant: false},
    { id: 2, title: "The second task", completed: true, isImportant: false},
    { id: 3, title: "The third task", completed: false, isImportant: true},
    { id: 4, title: "The fourth task", completed: true, isImportant: false},
    { id: 5, title: "The fifth task", completed: false, isImportant: true},
    { id: 6, title: "The sixth task", completed: true, isImportant: false},
    { id: 7, title: "The seventh task", completed: false, isImportant: true}
];

// Read list of todos
// GET http://localhost:8000/api/todos
app.get("/api/todos", function(req, res, next) {
    var page = parseInt(req.query.page || 1),
        pageLen = parseInt(req.query.page_len || DEFAULT_PAGE_LEN),
        start = (page - 1) * pageLen,
        data = todos,
        // /([\+\-]?)(.*)/.exec("+name")
        // ["+name", "+", "name"]

        sortParsed = (/([\+\-]?)(.*)/).exec(req.query.sort || ""),
        sort = sortParsed[2],
        order = sortParsed[1] || "+",
        completed = req.query.completed ? (/^(true|1)$/i).test(req.query.completed) : null;
        isImportant = req.query.isImportant ? (/^(true|1)$/i).test(req.query.isImportant) : null;

    if (sort) {
        data = _.sortBy(data, sort);
        if (order === "-") data = data.reverse();
    }

    if (completed != null) {
        data = _.filter(data, { completed: completed })
    }
    if (isImportant != null) {
        data = _.filter(data, { isImportant: isImportant })
    }

    res.json(data.slice(start, start + pageLen));
});

// Read single todo
// GET http://localhost:8000/api/todos/{id}
app.get("/api/todos/:id", function(req, res, next) {
    var id = parseFloat(req.params.id),
        todo = _.find(todos, { id: id });

    if (!todo) return res.status(404).send("not found");
    return res.json(todo);
});

// Create todo
// POST http://localhost:8000/api/todos
app.post("/api/todos", function(req, res, next) {
    var body = req.body,
        id = parseFloat(body.id || 0),
        index, title, completed, todo;

    if (id === 0) {
        id = todos.length === 0 ? 1 : _.maxBy(todos, "id").id + 1;
    } else {
        index = _.findIndex(todos, { id: id });
        if (index !== -1) return res.status(409).send("there's already a todo with that id");
    }

    title = body.title || "New task";
    completed = body.completed === undefined ? false : body.completed;

    todo = { id: id, title: title, completed: completed }

    todos.push(todo);

    return res.json(todo);
});

// Update todo
// PUT http://localhost:8000/api/todos/{id}
app.put("/api/todos/:id", function(req, res, next) {
    var id = parseFloat(req.params.id),
        todo = _.find(todos, { id: id }),
        updateTodo;

    if (!todo) return res.status(404).send("not found");

    // do not overwrite id
    updateTodo = _.omit(req.body, "id");

    _.assign(todo, updateTodo);

    return res.json(todo);
});

// Delete todo
// DELETE http://localhost:8000/api/todos/{id}
app.delete("/api/todos/:id", function(req, res, next) {
    var id = parseFloat(req.params.id),
        index = _.findIndex(todos, { id: id });

    if (index === -1) return res.status(404).send("not found");

    todos.splice(index, 1);

    return res.send("todo deleted successfully");
});

app.use(express.static(process.cwd() + "/public"));

app.listen(8080);

console.log("Server started");
