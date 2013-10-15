#requires backbone.js
class CollectionManager
    constructor: (collection) ->
        @collection = collection
    
    updateCollection: (jsonUpdate) ->
        for modelUpdate in jsonUpdate
            try
                @applyModelUpdate modelUpdate
            catch ex
                console.warn "CollectionManager[updateCollection]: Error while applying model update"
                console.error ex.message
        @collection.trigger 'colUpdateApplied'
        #apply search before sort ( as sort will trigger re-render anyways
        SearchManager.applySearchCriteria @collection, { silent: true }
        @collection.sort()

    applyModelUpdate: (modelUpdate) ->
        throw "modelUpdate not defined" unless modelUpdate?
        updateApplied = false
        updateKey = null
        @collection.each (model) =>
            try
                updateKey = @getModelKey modelUpdate
                if model.get('key') == updateKey
                    updateApplied = true
                    @updateModel model, modelUpdate
            catch ex
                console.warn "CollectionManager[applyModelUpdate]: Error while applying model update"
                console.error ex.message

        if not updateApplied
            newCacheInfo = new CacheInfo(modelUpdate)
            newCacheInfo.updateCacheStats()
            @collection.add newCacheInfo, {sort: false}

    getModelKey: (modelInfo) ->
        throw "modelInfo not defined" unless modelInfo?
        key = modelInfo.CacheName
        throw "failed to get model key" unless key?
        return key
    
    updateModel: (model, modelUpdate) -> 
        model.set(key, modelUpdate[key]) for key of modelUpdate
        model.trigger 'modUpdateApplied'

#export class definition
window.CollectionManager = CollectionManager