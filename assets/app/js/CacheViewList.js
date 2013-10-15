(function() {
  var CacheViewList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CacheViewList = (function(_super) {

    __extends(CacheViewList, _super);

    function CacheViewList() {
      return CacheViewList.__super__.constructor.apply(this, arguments);
    }

    CacheViewList.prototype.initialize = function() {
      this.collection.on('add', this.addOne, this);
      return this.collection.on('reset sort search', this.reRender, this);
    };

    CacheViewList.prototype.addOne = function(cacheInfo) {
      var cacheView;
      cacheView = new CacheView({
        model: cacheInfo
      });
      cacheView.render();
      return jQuery('#card-container').append(cacheView.$el);
    };

    CacheViewList.prototype.reRender = function() {
      var cacheInfo, _i, _len, _ref, _results;
      jQuery('#card-container').empty();
      _ref = this.collection.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cacheInfo = _ref[_i];
        _results.push(this.addOne(cacheInfo));
      }
      return _results;
    };

    return CacheViewList;

  })(Backbone.View);

  window.CacheViewList = CacheViewList;

}).call(this);
