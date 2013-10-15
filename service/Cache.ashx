<%@ WebHandler Language="C#" Class="Sitecore.Internals.Services.CacheService"%>
<%@ Assembly Src="Serialization\fastJson\FastJsonAssembly.cs" %>

using System.Collections.Generic;
using System.Text;
using System.Web;
using Sitecore.Caching;
using Sitecore.Internals.Services.Serialization.fastJson;

namespace Sitecore.Internals.Services
{
    /// <summary>
    /// Summary description for TEST
    /// </summary>
    public class CacheService : IHttpHandler
    {

        public class CacheInfo
        {
            public CacheInfo(Cache scCache)
            {
                this.CacheName = scCache.Name;
                this.CacheSize = scCache.Size;
                this.MaxSize = scCache.MaxSize;
            }
            
            public string CacheName { get; set; }
            public long CacheSize { get; set; }
            public long MaxSize { get; set; }
        }
        
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/json";

            var resultCollection = new List<CacheInfo>();
            
            var sitecoreCacheList = CacheManager.GetAllCaches();
            foreach (var cache in sitecoreCacheList)
            {
                resultCollection.Add(new CacheInfo(cache));
            }

            context.Response.Write(JSON.Instance.ToJSON(resultCollection, new JSONParameters(){EnableAnonymousTypes = true}));
        }
        
        public bool IsReusable
        {
            get
            {
                return false;   
            }
        }
    }
}