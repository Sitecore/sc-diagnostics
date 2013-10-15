(function() {
  var CollectionManager;

  CollectionManager = (function() {

    function CollectionManager(collection) {
      this.collection = collection;
    }

    CollectionManager.prototype.updateCollection = function(jsonUpdate) {
      var modelUpdate, _i, _len;
      for (_i = 0, _len = jsonUpdate.length; _i < _len; _i++) {
        modelUpdate = jsonUpdate[_i];
        try {
          this.applyModelUpdate(modelUpdate);
        } catch (ex) {
          console.warn("CollectionManager[updateCollection]: Error while applying model update");
          console.error(ex.message);
        }
      }
      this.collection.trigger('colUpdateApplied');
      SearchManager.applySearchCriteria(this.collection, {
        silent: true
      });
      return this.collection.sort();
    };

    CollectionManager.prototype.applyModelUpdate = function(modelUpdate) {
      var newCacheInfo, updateApplied, updateKey,
        _this = this;
      if (modelUpdate == null) {
        throw "modelUpdate not defined";
      }
      updateApplied = false;
      updateKey = null;
      this.collection.each(function(model) {
        try {
          updateKey = _this.getModelKey(modelUpdate);
          if (model.get('key') === updateKey) {
            updateApplied = true;
            return _this.updateModel(model, modelUpdate);
          }
        } catch (ex) {
          console.warn("CollectionManager[applyModelUpdate]: Error while applying model update");
          return console.error(ex.message);
        }
      });
      if (!updateApplied) {
        newCacheInfo = new CacheInfo(modelUpdate);
        newCacheInfo.updateCacheStats();
        return this.collection.add(newCacheInfo, {
          sort: false
        });
      }
    };

    CollectionManager.prototype.getModelKey = function(modelInfo) {
      var key;
      if (modelInfo == null) {
        throw "modelInfo not defined";
      }
      key = modelInfo.CacheName;
      if (key == null) {
        throw "failed to get model key";
      }
      return key;
    };

    CollectionManager.prototype.updateModel = function(model, modelUpdate) {
      var key;
      for (key in modelUpdate) {
        model.set(key, modelUpdate[key]);
      }
      return model.trigger('modUpdateApplied');
    };

    return CollectionManager;

  })();

  window.CollectionManager = CollectionManager;

}).call(this);
