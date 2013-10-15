(function() {
  var CacheInfo,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CacheInfo = (function(_super) {

    __extends(CacheInfo, _super);

    function CacheInfo() {
      return CacheInfo.__super__.constructor.apply(this, arguments);
    }

    CacheInfo.prototype.initialize = function() {
      this.on('add', this.modelAdded, this);
      return this.on('modUpdateApplied', this.updateApplied, this);
    };

    CacheInfo.prototype.modelAdded = function() {
      console.info('model added');
      return this.set('key', this.get('CacheName'));
    };

    CacheInfo.prototype.updateApplied = function() {
      console.info('model: updateApplied');
      return this.updateCacheStats();
    };

    CacheInfo.prototype.updateCacheStats = function() {
      var maxSize, newUtilization, prevUtilization, utilizationDelta;
      this.ensureProperty('CacheUtilization', 0);
      prevUtilization = this.get('CacheUtilization');
      maxSize = this.get('MaxSize');
      newUtilization = 0;
      if (maxSize > 0) {
        newUtilization = Math.floor(this.get('CacheSize') / this.get('MaxSize') * 100);
      }
      this.set('CacheUtilization', newUtilization);
      this.ensureProperty('CacheUtilizationDelta', 0);
      utilizationDelta = newUtilization - prevUtilization;
      if (prevUtilization !== 0) {
        this.set('CacheUtilizationDelta', utilizationDelta);
      }
      this.ensureProperty('CacheUtilizationDeltaChange', 'positive');
      if (utilizationDelta < 0) {
        this.set('CacheUtilizationDeltaChange', 'negative');
      } else {
        this.set('CacheUtilizationDeltaChange', 'positive');
      }
      return SearchManager.processCacheInfoUpdate(this);
    };

    CacheInfo.prototype.ensureProperty = function(propertyName, defaultValue) {
      var val;
      val = this.get(propertyName);
      if (val == null) {
        return this.set(propertyName, defaultValue);
      }
    };

    return CacheInfo;

  })(Backbone.Model);

  window.CacheInfo = CacheInfo;

}).call(this);
