(function() {
  var CacheInfoList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CacheInfoList = (function(_super) {

    __extends(CacheInfoList, _super);

    function CacheInfoList() {
      return CacheInfoList.__super__.constructor.apply(this, arguments);
    }

    CacheInfoList.prototype.model = CacheInfo;

    CacheInfoList.prototype.initialize = function(options) {
      this.on('add', this.addOne, this);
      this.on('remove', this.removeOne, this);
      return this.on('colUpdateApplied', this.updateApplied, this);
    };

    CacheInfoList.prototype.comparator = function(a, b) {
      var aVal, bVal;
      aVal = a.get('CacheUtilization');
      bVal = b.get('CacheUtilization');
      if (aVal < bVal) {
        return 1;
      } else if (aVal > bVal) {
        return -1;
      } else {
        return 0;
      }
    };

    CacheInfoList.prototype.addOne = function(model) {
      return console.info('cacheInfoList: model added');
    };

    CacheInfoList.prototype.removeOne = function(model) {
      return console.warn("removed [" + (model.get('CacheName')) + "]");
    };

    CacheInfoList.prototype.updateApplied = function() {
      return console.warn('collection: updateApplied');
    };

    return CacheInfoList;

  })(Backbone.Collection);

  window.CacheInfoList = CacheInfoList;

}).call(this);
