(function() {
  var CacheView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CacheView = (function(_super) {

    __extends(CacheView, _super);

    function CacheView() {
      return CacheView.__super__.constructor.apply(this, arguments);
    }

    CacheView.prototype.initialize = function() {
      return this.model.on('modUpdateApplied', this.update, this);
    };

    CacheView.prototype.update = function() {
      return this.render;
    };

    CacheView.prototype.getTemplateData = function() {
      var cacheStatus, currUtilization, data, deltaChange, deltaChangeVal;
      data = this.model.toJSON();
      currUtilization = this.model.get('CacheUtilization');
      cacheStatus = 'ok';
      if ((75 < currUtilization && currUtilization < 90)) {
        cacheStatus = 'warn';
      } else if (currUtilization >= 90) {
        cacheStatus = 'bad';
      }
      data.calcCacheStatusCSS = cacheStatus;
      deltaChange = 'positive';
      deltaChangeVal = this.model.get('CacheUtilizationDelta');
      if (deltaChangeVal < 0) {
        deltaChange = 'negative';
      }
      data.calcDeltaChangeCSS = deltaChange;
      data.calcCacheSizeReadable = this.parseSize(this.model.get('CacheSize'));
      data.calcMaxSizeReadable = this.parseSize(this.model.get('MaxSize'));
      return data;
    };

    CacheView.prototype.parseSize = function(size) {
      var suffix, tier;
      suffix = ["bytes", "KB", "MB", "GB", "TB", "PB"];
      tier = 0;
      while (size >= 1024) {
        size = size / 1024;
        tier++;
      }
      return Math.round(size * 10) / 10 + " " + suffix[tier];
    };

    CacheView.prototype.render = function() {
      if (this.model.get('matchesSearch')) {
        return this.$el.html(Mustache.to_html(TemplateManager.cacheInfoTemplate, this.getTemplateData()));
      } else {
        return this.$el.html("");
      }
    };

    return CacheView;

  })(Backbone.View);

  window.CacheView = CacheView;

}).call(this);
