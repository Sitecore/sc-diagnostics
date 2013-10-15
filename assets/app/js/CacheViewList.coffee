#requires backbone.js
#requires mustache.js
#requires TemplateManager.js
#requires CacheView.js
class CacheViewList extends Backbone.View
    initialize: ->
        @collection.on 'add', @addOne, @
        @collection.on 'reset sort search', @reRender, @

    addOne: ( cacheInfo ) ->
        cacheView = new CacheView { model: cacheInfo }
        cacheView.render()
        jQuery('#card-container').append cacheView.$el

    reRender: ->
        jQuery('#card-container').empty()
        for cacheInfo in @collection.models
            @addOne cacheInfo

window.CacheViewList = CacheViewList