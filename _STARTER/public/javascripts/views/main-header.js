var APP = window.APP || {};

(function() {
  APP.Views = APP.Views || {};
  APP.Views.MainHeader = Backbone.View.extend({
    initialize: function() {
      // if (Modernizr.canvas) this.upgradeHeaderTitle();
    },
    upgradeHeaderTitle: function() {
      var $canvas = $('<canvas>')
        .addClass('title-canvas')
        .attr('width', '400')
        .attr('height', '80');

      // this.$el.find('h1').remove();
      this.$el.append($canvas);
    }
  });

})();