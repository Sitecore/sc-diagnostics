#requires jquery.js
class TemplateManager
    jTemplates = null
    @cacheInfoTemplate = null

    constructor: ->
        jQuery.get 'assets/app/html/cache-info-templates.html', ( templates ) =>
            jTemplates = jQuery(templates)
            @cacheInfoTemplate = jTemplates.filter('#cache-card-template').html()

window.TemplateManager = new TemplateManager()