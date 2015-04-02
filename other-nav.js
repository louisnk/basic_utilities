var APP = APP || {};

(function() {


	/**
	 *	This should be moved out into its own module/file, but for now don't care and
	 * 	need to ensure it's loaded before it gets called.
	 */
	APP.PrimaryNavigationStates = (function() {

		/**
		 *	Add whatever states you want to track here,
		 *	if they take a non-boolean value, also add to the
		 * 	_nonBoolStates object below -- is that too much checking?
		 */
		var _states = {
			activeItem: false,
			secondaryNavOpen: false,
			thirdNavOpen: false
		};

		/**
		 *	Object of states that can be something other than true/false, 
		 * 	used to ensure proper typing of potential states
		 *
		 *	valid types are only be string or number
		 */
		var _nonBoolStates = {
			"activeItem": { "string": true, "number": true }
		};
		
		/**
	 	 *	Emits the state change event for a given state, and what it changed to
		 *
		 */
		var _announceStateChangeFor = function(state, to) {
			var $el = APP.PrimaryNavigation.$el || $("#primary-navigation");

			$el.trigger({
				type: "STATE_CHANGE",
				changed: {
					state: state,
					toWhat: to
				}
			});
		};

		var _closeAllNavs = function() {
			for (var state in _states) {
				if (state.match(/\w(Nav)\w/g)) {
					_states[state] = false;
				}
			}
			return true;
		};

		/**
		 *	used by the setters and getters, takes a string, returns a boolean
		 */
		var _stateExists = function(state) {
			return state && _states.hasOwnProperty(state);
		}

		/**
		 *	Checks correct type for setting states
		 * 	@param stateName		[string] 					name of the state
		 *	@param toState 			[bool || number] 	the state you're trying to set
		 */
		var _isCorrectTypeFor = function(stateName, toState) {
			if (typeof toState !== "boolean") {
				return stateName in _nonBoolStates && typeof toState in _nonBoolStates[stateName];
			} else {
				return !(stateName in _nonBoolStates);
			}
		}			

		/**
		 *	sets a given state and announces its change
		 * 	@param stateName 		[string] 					the name of the state you want to change
		 *	@param toState 			[bool | number]		the state you're trying to set
		 */
		var set = function(stateName, toState) {
			if (stateName && 
					typeof stateName === "string" &&
					stateName !== "closeAll" &&
					_stateExists(stateName) &&
					_isCorrectTypeFor(stateName, toState)) {

				_states[stateName] = toState;

				_announceStateChangeFor(stateName, toState);

				return this;
			} else if (stateName === "closeAll") {
				_closeAllNavs();
				_announceStateChangeFor(stateName, false);
				return this;
			} else { return undefined; }
		};

		/**
		 *	Gets a given state's current status
		 *	@param stateName 		[string]	the name of the state you want to check
		 */
		var get = function(stateName) {
			if (stateName &&
					typeof stateName === "string" &&
					_stateExists(stateName)) {
				return _states[stateName];
			} else {
				return undefined;
			}
		};

		return {
			get: get,
			set: set
		}
	})();

	APP.PrimaryNavigation = {

		// some "parent" element
		$el: $("#primary-navigation"),
		$secondaryNav: $("nav.second-nav"),
		$thirdNav: $("nav.third-nav"),

		_state: APP.PrimaryNavigationStates,

		init: function() {
			this.setListeners().watchScroll();
		},

		setListeners: function() {
			var $primaryNavLinks = $("a.primary-nav");
			var $subNavLinks = $("nav.menu a");
			var $logo = $(".navbar-brand");

			// set the context, so jQuery doesn't take over
			var handleNavAction = this.handleNavAction.bind(this);
			var changeNavState = this.changeNavState.bind(this);

			$primaryNavLinks.on("click", changeNavState);
			$subNavLinks.on("click", changeNavState);
			$logo.on("click", function(e) {
				this._state.set("closeAll", true);
			}.bind(this));

			/**
			 *	This event fires any time you 'this._state.set()' something,
			 *	so you can hook into any state changes for cascading effects
			 *
			 *	For now, it's just open/closing the navs...
			 */
			this.$el.on("STATE_CHANGE", handleNavAction);

			return this;
		},

		/**
		 *	do some magic to change some content!
		 */
		changeContent: function(tier, which) {
			var $contentTarget = tier.toLowerCase() === "secondary" ? 
													 this.$secondaryNav : 
													 this.$thirdNav;

			$contentTarget.find("ul").addClass("hidden");
			$contentTarget.find("." + which).removeClass("hidden");

			return this;
		},

		changeNavState: function(e) {
			e.stopPropagation();

			var $target = $(e.target);
			var which = $target.parents("nav").data("target-tier");
			var active = $target.data("unique-class");

			if (which) {
				// Would it be better to make set take arrays as arguments? Comma separated list?
				this._state.set(which + "NavOpen", true).set("activeItem", active);

				if (which === "secondary" && this._state.get("thirdNavOpen")) {
					this._state.set("thirdNavOpen", false);
				};

				/**
				 *	This chunk actually triggers the content change, 
				 * 	based on the link's data-target
				 * 	and it's parent <nav>'s target-tier
				 *
				 *	should be handled by the state-machine...
				 *	no time for now
				 */
				if ($target.data("target") && $target.hasClass("primary-nav")) {
					this.changeContent(which, $target.data("target"));
				}
			} else {
				console.log("no data-target-tier set on parent <nav> container of: ", $target);
			}

			return this;
		},

		handleNavAction: function(e) {
			var which = e.changed.state;
			var open = e.changed.toWhat;

			if (open) {
				this.showNav(which);
			} else {
				this.hideNavs(which);
			}
			return this;
		},

		hideNavs: function(which) {

			switch (true) {
				case !this._state.get("thirdNavOpen") && this.$thirdNav.hasClass("open"):
					this.$thirdNav.removeClass("open").find("ul").addClass("hidden");	
					this.hideNavs();
					break;

				case !this._state.get("secondaryNavOpen") && this.$secondaryNav.hasClass("open"):
					this.$secondaryNav.removeClass("open");
					break;

				default: 
					// console.warn("no navs are currently set to closed, what should I show?");
					break;
			}
			
			return this;
		},

		showNav: function(which) {

			switch (true) {
				case this._state.get("thirdNavOpen"):
					this.$thirdNav.addClass("open");
					break;
				case this._state.get("secondaryNavOpen"):
					this.$secondaryNav.addClass("open");
					break;

				default: 
					console.warn("no navs are currently set to open, what should I show?");
					break;
			}

			return this;
		},

		watchScroll: function() {

			$(window).scroll(function() {
		    if ($(window).scrollTop() > 1) {
		      $('header').addClass('sticky');
		    } else {
		      $('header').removeClass('sticky');
		    }
		  });

		  return this;
		}
	};

	$(document).on("ready", function() {
		APP.PrimaryNavigation.init();
	});
})();

