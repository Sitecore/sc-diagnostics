#requires backbone.js
class CacheInfoList extends Backbone.Collection
    model: CacheInfo

    initialize: (options) ->
        @on 'add', @addOne, @
        @on 'remove', @removeOne, @
        @on 'colUpdateApplied', @updateApplied, @

    comparator: (a, b) ->
        aVal = a.get 'CacheUtilization'
        bVal = b.get 'CacheUtilization'
        if aVal < bVal
            return 1
        else if aVal > bVal
            return -1
        else
            return 0

    addOne: (model) ->
        console.info 'cacheInfoList: model added'

    removeOne: (model) ->
        console.warn "removed [#{model.get('CacheName')}]"

    updateApplied: ->
        console.warn 'collection: updateApplied'

window.CacheInfoList = CacheInfoList