(function() {
  var TemplateManager;

  TemplateManager = (function() {
    var jTemplates;

    jTemplates = null;

    TemplateManager.cacheInfoTemplate = null;

    function TemplateManager() {
      var _this = this;
      jQuery.get('assets/app/html/cache-info-templates.html', function(templates) {
        jTemplates = jQuery(templates);
        return _this.cacheInfoTemplate = jTemplates.filter('#cache-card-template').html();
      });
    }

    return TemplateManager;

  })();

  window.TemplateManager = new TemplateManager();

}).call(this);
