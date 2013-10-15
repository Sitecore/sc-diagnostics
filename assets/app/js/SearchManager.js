(function() {
  var SearchManager;

  SearchManager = (function() {

    SearchManager.searchFacets = null;

    SearchManager.siteCaches = null;

    SearchManager.databaseCachesRegular = null;

    SearchManager.databaseCachesProvider = null;

    SearchManager.lastSearchHits = 0;

    function SearchManager() {
      this.searchFacets = {
        hasIssues: ['yes', 'no'],
        site: [],
        database: []
      };
      this.siteCaches = ['[filtered items]', '[xsl]', '[viewstate]', '[registry]', '[html]'];
      this.databaseCachesRegular = ['[blobIDs]', '[data]', '[itempaths]', '[items]', '[paths]', '[standardValues]'];
      this.databaseCachesProvider = ['- Prefetch data', '- Property data'];
    }

    SearchManager.prototype.processCacheInfoUpdate = function(cacheInfo) {
      var cacheLabel, cacheName, cacheUtilization, databaseName, identifiedAsDbRegular, identifiedAsSite, siteName, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      cacheName = cacheInfo.get('CacheName');
      cacheUtilization = cacheInfo.get('CacheUtilization');
      if (cacheUtilization >= 75) {
        cacheInfo.set('hasIssues', 'yes');
      } else {
        if (cacheInfo.get('CacheUtilizationDelta') < 0) {
          cacheInfo.set('hasIssues', 'yes');
        } else {
          if (cacheInfo.get('CacheUtilizationDelta') > 5) {
            cacheInfo.set('hasIssues', 'yes');
          } else {
            cacheInfo.set('hasIssues', 'no');
          }
        }
      }
      identifiedAsSite = false;
      _ref = this.siteCaches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cacheLabel = _ref[_i];
        if (cacheName.indexOf(cacheLabel) !== -1) {
          siteName = cacheName.split('[')[0];
          cacheInfo.set('site', siteName);
          if (this.searchFacets.site.indexOf(siteName) === -1) {
            this.searchFacets.site.push(siteName);
          }
          identifiedAsSite = true;
          break;
        }
      }
      if (identifiedAsSite) {
        return;
      }
      identifiedAsDbRegular = false;
      _ref1 = this.databaseCachesRegular;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        cacheLabel = _ref1[_j];
        if (cacheName.indexOf(cacheLabel) !== -1) {
          databaseName = cacheName.split('[')[0];
          cacheInfo.set('database', databaseName);
          if (this.searchFacets.database.indexOf(databaseName) === -1) {
            this.searchFacets.database.push(databaseName);
          }
          identifiedAsDbRegular = true;
          break;
        }
      }
      if (identifiedAsDbRegular) {
        return;
      }
      _ref2 = this.databaseCachesProvider;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        cacheLabel = _ref2[_k];
        if (cacheName.indexOf(cacheLabel) !== -1) {
          databaseName = cacheName.split('(')[1].split(')')[0];
          cacheInfo.set('database', databaseName);
          if (this.searchFacets.database.indexOf(databaseName) === -1) {
            this.searchFacets.database.push(databaseName);
          }
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SearchManager.prototype.getFacets = function() {
      return ['hasIssues', 'site', 'database'];
    };

    SearchManager.prototype.getOptionsForFacet = function(facetName) {
      return this.searchFacets[facetName];
    };

    SearchManager.prototype.applySearchCriteria = function(cacheInfoCollection, options) {
      var cacheInfo, parsedSearchCriteria, searchCondition, searchCriteria, searchFacet, searchValue, _i, _j, _len, _len1, _ref, _ref1;
      this.lastSearchHits = 0;
      parsedSearchCriteria = {
        hasIssues: [],
        site: [],
        database: [],
        empty: false
      };
      searchCriteria = visualSearch.searchQuery;
      if (searchCriteria.models.length > 0) {
        _ref = searchCriteria.models;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          searchCondition = _ref[_i];
          searchFacet = searchCondition.get('category');
          searchValue = searchCondition.get('value');
          switch (searchFacet) {
            case 'hasIssues':
              parsedSearchCriteria.hasIssues.push(searchValue);
              break;
            case 'site':
              parsedSearchCriteria.site.push(searchValue);
              break;
            case 'database':
              parsedSearchCriteria.database.push(searchValue);
          }
        }
      } else {
        parsedSearchCriteria.empty = true;
      }
      _ref1 = cacheInfoCollection.models;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        cacheInfo = _ref1[_j];
        if (this.matchesSearchCriteria(cacheInfo, parsedSearchCriteria)) {
          cacheInfo.set('matchesSearch', true);
          this.lastSearchHits += 1;
        } else {
          cacheInfo.set('matchesSearch', false);
        }
      }
      if (!(options != null ? options.silent : void 0)) {
        return cacheInfoCollection.trigger('search');
      }
    };

    SearchManager.prototype.matchesSearchCriteria = function(cacheInfo, parsedSearchCriteria) {
      var cacheCategory, cacheDb, cacheSite;
      if (parsedSearchCriteria.empty) {
        return true;
      }
      if (parsedSearchCriteria.hasIssues.length > 0) {
        cacheCategory = cacheInfo.get('hasIssues');
        if (!cacheCategory) {
          return false;
        }
        if (parsedSearchCriteria.hasIssues.indexOf(cacheCategory) === -1) {
          return false;
        }
      }
      if (parsedSearchCriteria.site.length > 0) {
        cacheSite = cacheInfo.get('site');
        if (!cacheSite) {
          return false;
        }
        if (parsedSearchCriteria.site.indexOf(cacheSite) === -1) {
          return false;
        }
      }
      if (parsedSearchCriteria.database.length > 0) {
        cacheDb = cacheInfo.get('database');
        if (!cacheDb) {
          return false;
        }
        if (parsedSearchCriteria.database.indexOf(cacheDb) === -1) {
          return false;
        }
      }
      return true;
    };

    return SearchManager;

  })();

  window.SearchManager = new SearchManager();

}).call(this);
