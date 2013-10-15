#requires backbone.js
#requires SearchManager.js
class CacheInfo extends Backbone.Model
    initialize: ->
        @on 'add', @modelAdded, @
        @on 'modUpdateApplied', @updateApplied, @

    modelAdded: ->
        console.info 'model added'
        @set 'key', @get('CacheName')

    updateApplied: ->
        console.info 'model: updateApplied'
        @updateCacheStats()

    updateCacheStats: ->
        #calculate current cache utilization
        @ensureProperty 'CacheUtilization', 0
        prevUtilization = @get 'CacheUtilization'
        maxSize = @get('MaxSize')
        newUtilization = 0
        if maxSize > 0
            newUtilization = Math.floor( @get('CacheSize') / @get('MaxSize') * 100 )
        @set 'CacheUtilization', newUtilization

        @ensureProperty 'CacheUtilizationDelta', 0
        utilizationDelta = newUtilization - prevUtilization
        @set 'CacheUtilizationDelta',  utilizationDelta unless prevUtilization is 0 

        @ensureProperty 'CacheUtilizationDeltaChange', 'positive'
        if utilizationDelta < 0 
            @set 'CacheUtilizationDeltaChange', 'negative'
        else
            @set 'CacheUtilizationDeltaChange', 'positive' 
        SearchManager.processCacheInfoUpdate @


    ensureProperty: (propertyName, defaultValue) ->
        val = @get propertyName
        @set propertyName, defaultValue unless val?

window.CacheInfo = CacheInfo