(function(){ 
	var ReactAPP = {
		init: function() {
			// avoiding using jsx...it just doesn't seem right.
			var toRender = function() {
				return React.DOM.p(null, ["Hello ", React.DOM.br( { key: 1 }),  
				React.DOM.input({key: 0, placeholder: "your name..."}),
				React.DOM.p({ key: 2}, 
					(new Date()).toDateString() + " at " + (new Date()).toTimeString())
				]);
			}
			setInterval(function() {
				React.render(toRender(), document.getElementById("reaction"));
			}, 500);
		}

	};

	window.onload = ReactAPP.init;
})();