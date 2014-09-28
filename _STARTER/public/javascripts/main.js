var APP = window.APP || {};

(function(APP) {
  APP = _.extend(APP, {
    navState: new Backbone.Model({
      navOpen: false,
      navPosition: 'left',
      navType: 'link', // link, toggle, radio
      footerAvailable: true,
      footerTakeover: false
    }),

    init: function() {
      var Views = this.Views,
          viewConfig = function(selector) {
            return { el: selector, model: this.navState };
          }.bind(this);

      this.activeViews = {
        nav: new Views.NavSidebar(viewConfig('#nav-container')),
        mainContent: new Views.MainContent(viewConfig('#main-content')),
        mainHeader: new Views.MainHeader(viewConfig('#mobile-header')),
        mainFooter: new Views.MainFooter(viewConfig('#mobile-footer'))
      };

      this.bindNavAction();
    },

    bindNavAction: function() {
      $('.nav-toggle').bind('click touchstart', function(e) {
        e.stopPropagation();
        this.navState.set('navOpen', !this.navState.get('navOpen'));
      }.bind(this));
    }

  });

  $(document).ready(function() {
    APP.init();
  });

})(APP);
