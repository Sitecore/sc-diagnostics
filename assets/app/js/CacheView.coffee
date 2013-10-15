#requires backbone.js
#requires mustache.js
#requires TemplateManager.js
class CacheView extends Backbone.View
    
    initialize: ->
        @model.on 'modUpdateApplied', @update, @

    update: ->
        @render
    
    getTemplateData: ->
        data = @model.toJSON()
        #calcCacheStatusCSS
        currUtilization = @model.get 'CacheUtilization'
        cacheStatus = 'ok'
        if 75 < currUtilization < 90
            cacheStatus = 'warn'
        else if currUtilization >= 90
            cacheStatus = 'bad'
        data.calcCacheStatusCSS = cacheStatus
        #calcDeltaChangeCSS
        deltaChange = 'positive'
        deltaChangeVal = @model.get 'CacheUtilizationDelta'
        if deltaChangeVal < 0
            deltaChange = 'negative'
        data.calcDeltaChangeCSS = deltaChange
        #calcCacheSizeReadable
        data.calcCacheSizeReadable = @parseSize @model.get('CacheSize')
        #calcMaxSizeReadable
        data.calcMaxSizeReadable = @parseSize @model.get('MaxSize')
        return data

    parseSize: (size) ->  
        suffix = ["bytes", "KB", "MB", "GB", "TB", "PB"]
        tier = 0
        while size >= 1024 
            size = size / 1024;
            tier++;
        Math.round(size * 10) / 10 + " " + suffix[tier];

    render: ->
        if @model.get 'matchesSearch'
            @$el.html Mustache.to_html(TemplateManager.cacheInfoTemplate, @getTemplateData())
        else
            @$el.html ""

window.CacheView = CacheView