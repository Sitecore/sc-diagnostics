 Sitecore Diagnostics (sc-diagnostics)
=====================================

WHAT
----

Currently a proof-of-concept solution that implements the following approach to 
collect diagnostic data for a Sitecore CMS instance:
 * Put an "auto-compileable" web service to a Sitecore CMS webroot
 * Consume the web service from a web page and process/analyze the information there by means of browser processing capabilities

WHY
---

The intent behind the effort is to introduce a way of non-intrusive diagnostics ( one that would not require restart of 
ASP.NET Application Pool ) and easy-to-consume reporting on the diagnostic data. Combination of the above should help
to reduce time for typical research activities performed against a Sitecore CMS instance.

HOW
---

1. Download the files from GitHub
2. Copy the files to a folder within Sitecore CMS instance web root ( '<webroot>/layouts/debug' is a good option )
3. Request the reporting page : 'http://<sitename>/path/to/page/cache-monitor.html' ( 'http://<sitename>/layouts/debug/cache-monitor.html' if you decided to go with suggested path)
4. Get prepared for Zen ( or unexpected )       :)

AND IF
------

Should you want to help the project feel free to contact author andrew.at.sitecore[at]gmail.com ( or leave a feedback in the project issues )