var APP = window.APP || {};

(function() {
  APP.Views = APP.Views || {};

  APP.Views.MainContent = Backbone.View.extend({
    initialize: function(config) {
      this.model.on('change:navOpen', function(model, isOpen) {
        if (isOpen) { this.makeRoomForNav(); } 
        else { this.takeBackRoomFromNav(); }
      }.bind(this));
    },

    makeRoomForNav: function() {
      this.$el.animate(this.makeAnim({}, this.model.get('navPosition'), '20%'));
    },

    takeBackRoomFromNav: function() {
      this.$el.animate(this.makeAnim({}, this.model.get('navPosition'), '0'));
    }, 

    makeAnim: function(obj, key, val) {
      obj[key] = val;
      return obj;
    }
  });

})();
