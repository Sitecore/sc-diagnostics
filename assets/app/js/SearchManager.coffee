#requires CacheInfo.js
#requires visualsearch.js
class SearchManager
    @searchFacets = null
    @siteCaches = null
    @databaseCachesRegular = null
    @databaseCachesProvider = null
    @lastSearchHits = 0

    constructor: ->
        @searchFacets = 
            hasIssues : [ 'yes', 'no' ]
            site: []
            database: []
        @siteCaches = ['[filtered items]', '[xsl]', '[viewstate]', '[registry]', '[html]']
        @databaseCachesRegular = ['[blobIDs]', '[data]', '[itempaths]', '[items]', '[paths]', '[standardValues]' ]
        @databaseCachesProvider = ['- Prefetch data', '- Property data']

    processCacheInfoUpdate: ( cacheInfo ) ->
        cacheName = cacheInfo.get 'CacheName'
        #set search-related attributes
        #for category
        cacheUtilization = cacheInfo.get 'CacheUtilization'
        if cacheUtilization >= 75
            cacheInfo.set 'hasIssues', 'yes'
        else
            if cacheInfo.get('CacheUtilizationDelta') < 0
                cacheInfo.set 'hasIssues', 'yes'
            else
                if cacheInfo.get('CacheUtilizationDelta') > 5
                    cacheInfo.set 'hasIssues', 'yes'
                else
                    cacheInfo.set 'hasIssues', 'no'

        identifiedAsSite = false
        for cacheLabel in @siteCaches
            if cacheName.indexOf(cacheLabel) != -1
                siteName = cacheName.split('[')[0]
                cacheInfo.set 'site', siteName
                if @searchFacets.site.indexOf(siteName) == -1
                    @searchFacets.site.push(siteName)
                identifiedAsSite = true
                break
        
        if identifiedAsSite 
            return
        
        identifiedAsDbRegular = false
        for cacheLabel in @databaseCachesRegular
            if cacheName.indexOf(cacheLabel) != -1
                databaseName = cacheName.split('[')[0]
                cacheInfo.set 'database', databaseName
                if @searchFacets.database.indexOf(databaseName) == -1
                    @searchFacets.database.push(databaseName)
                identifiedAsDbRegular = true
                break

        if identifiedAsDbRegular
            return

        for cacheLabel in @databaseCachesProvider
            if cacheName.indexOf(cacheLabel) != -1
                databaseName = cacheName.split('(')[1].split(')')[0]
                cacheInfo.set('database', databaseName);
                if @searchFacets.database.indexOf(databaseName) == -1
                    @searchFacets.database.push(databaseName)
                break

    getFacets: ->
        return ['hasIssues', 'site', 'database']

    getOptionsForFacet: ( facetName ) ->
        return @searchFacets[facetName]

    applySearchCriteria: ( cacheInfoCollection, options ) ->
        @lastSearchHits = 0
        
        parsedSearchCriteria =
            hasIssues: []
            site: []
            database: []
            empty: false
        
        searchCriteria = visualSearch.searchQuery
        if searchCriteria.models.length > 0
            for searchCondition in searchCriteria.models
                searchFacet = searchCondition.get 'category'
                searchValue = searchCondition.get 'value'
                switch searchFacet
                    when 'hasIssues' then parsedSearchCriteria.hasIssues.push searchValue
                    when 'site' then parsedSearchCriteria.site.push searchValue
                    when 'database' then parsedSearchCriteria.database.push searchValue
        else 
            parsedSearchCriteria.empty = true

        for cacheInfo in cacheInfoCollection.models
            if @matchesSearchCriteria cacheInfo, parsedSearchCriteria
                cacheInfo.set 'matchesSearch', true
                @lastSearchHits += 1
            else 
                cacheInfo.set 'matchesSearch', false
        cacheInfoCollection.trigger 'search' unless options?.silent

    matchesSearchCriteria: ( cacheInfo, parsedSearchCriteria ) ->
        #approve all data if search query is empty
        if parsedSearchCriteria.empty
            return true

        if parsedSearchCriteria.hasIssues.length > 0
            cacheCategory = cacheInfo.get 'hasIssues'
            return false unless cacheCategory
            return false unless parsedSearchCriteria.hasIssues.indexOf(cacheCategory) != -1
        
        if parsedSearchCriteria.site.length > 0
            cacheSite = cacheInfo.get 'site'
            return false unless cacheSite
            return false unless parsedSearchCriteria.site.indexOf(cacheSite) != -1

        if parsedSearchCriteria.database.length > 0
            cacheDb = cacheInfo.get 'database'
            return false unless cacheDb
            return false unless parsedSearchCriteria.database.indexOf(cacheDb) != -1
        
        return true

window.SearchManager = new SearchManager()