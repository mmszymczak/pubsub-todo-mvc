var EventBus = {
    topics: {},
    requests: {},

    subscribe: function(topic, listener) {
        // create the topic if not yet created
        if(!this.topics[topic]) this.topics[topic] = [];

        // add the listener
        this.topics[topic].push(listener);
    },

    publish: function(topic, data) {
        // return if the topic doesn't exist, or there are no listeners
        if(!this.topics[topic] || this.topics[topic].length < 1) return;

        // send the event to all listeners
        this.topics[topic].forEach(function(listener) {
            listener(data || {});
        });
    },

    request: function (request, data) {
        if(!this.requests[request]) return;
        return this.requests[request](data);
    },

    reply: function (request, executor) {
        if(!this.requests[request]) this.requests[request] = executor;
    }
};