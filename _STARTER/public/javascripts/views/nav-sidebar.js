var APP = window.APP || {};

(function() {
  APP.Views = APP.Views || {};

  APP.Views.NavSidebar = Backbone.View.extend({
    buttons: [],

    initialize: function(config) {
      this.template = $('#mobile-sidebar-template-1').html();
      this.render();

      this.model.on('change:navOpen', function(model, isOpen) {
        if (isOpen) { this.show(); }
        else { this.hide(); }
      }.bind(this));
      
      return this;
    },

    show: function() {
      this.$el.animate({ 'left': '0'});

      $('body').one('touchstart click', function(e) {
        this.model.set('navOpen', false);
      }.bind(this));
      
      return this;
    },

    hide: function() {
      this.$el.animate({ 'left': '-20%'});
      return this;
    },

    render: function() {
      this.$el.html(_.template(this.template, {}));
      this.setUpNavButtons();
      return this;
    },

    setUpNavButtons: function() {
      $('.nav-button').each(function(i, el) {
        this.buttons.push(new SidebarButtonView({ el: el, model: this.model }));
      }.bind(this));
    }
  });

  var SidebarButtonView = Backbone.View.extend({
    events: {
      'click'       : 'respondToContact',
      'touchstart'  : 'respondToContact'
    },

    initialize: function() {
      this.type = this.model.get('navType') || 'link';

      this.state = new Backbone.Model({
        selected: false,
        visited: false,
        disabled: false
      });

      this.state.on('change:selected', function(state, isSelected) {
        if (isSelected) { this.beSelected(); }
        else { this.beUnselected(); }
      }.bind(this));
    },

    respondToContact: function(e) {
      if (this.type == 'link') {
        this.state.set('visited', true);
      } else if (this.type == 'toggle') {
        e.stopPropagation();
        this.state.set('selected', !this.state.get('selected'));
      }
    },

    beSelected: function() {
      this.$el.addClass('on')
        .find('.icon')
        .removeClass('icon-blocked')
        .addClass('icon-checkmark');
    },

    beUnselected: function() {
      this.$el.removeClass('on')
        .find('.icon')
        .removeClass('icon-checkmark')
        .addClass('icon-blocked');
    }
  });

})();
