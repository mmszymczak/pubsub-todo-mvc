(function () {
	'use strict';

	function Todo() {
		this.storage = new app.Store("http://localhost:8080/api/todos/");
		this.model = new app.Model(this.storage);
		this.view = new app.View();
		this.controller = new app.Controller();
		this.footerView = new app.PopupView();
	}

	var todo = new Todo();

	function setView() {
		EventBus.publish("todos:init", document.location.hash);
	}

	window.addEventListener("load", setView);
	window.addEventListener("hashchange", setView);

	$.ajaxSetup({
		beforeSend: function() { $('#loader').show(); },
	  	complete: function(){ $('#loader').hide(); }
	});
})();