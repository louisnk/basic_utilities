var APP = window.APP || {};

(function() {
  APP.Views = APP.Views || {};

  APP.Views.MainFooter = Backbone.View.extend({
    events: {
      'click'       : 'toggleTakeover',
      'touchstart'  : 'toggleTakeover'
    },

    initialize: function(config) {
      this.model.on('change:footerAvailable', function(model, available) {
        if (available) { this.show(); }
        else { this.hide(); }
      }.bind(this));
        
      this.model.on('change:footerTakeover', function(model, shouldTakeOver) {
        if (shouldTakeOver) { this.takeOverScreen(); }
        else { this.surrenderScreen(); }
      }.bind(this));

      if (this.model.get('footerAvailable')) {
        if (this.model.get('footerTakeover')) { this.takeOverScreen(); }
        else { this.surrenderScreen(); }
      } else {
        this.hide();
      }
    },

    toggleTakeover: function() {
      this.model.set('footerTakeover', !this.model.get('footerTakeover'));
    },

    takeOverScreen: function() {
      this.$el.animate({ 'top': '80px' });
      return this;
    },

    surrenderScreen: function() {
      this.$el.animate({ 'top':  '90%' });
      return this;
    },

    show: function() {
      this.model.set('footerTakeover', false);
      this.$el.animate({ 'top':  '90%' });
      return this;
    },

    hide: function () {
      this.model.set('footerTakeover', false);
      this.$el.animate({ 'top':  '100%' });
      return this;
    }
  });

})();
