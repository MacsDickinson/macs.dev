---
title: Direct linking with AngularJS html5mode and IIS
excerpt: AngularJS html5mode makes for pretty URLs and broken direct links. Fixing the SEO hit with URL rewrites in IIS.
date: 2014-08-14
tag: JavaScript
draft: true
---

I've recently started moving the [Yorkshire Digital][0] project over to use [AngularJs][1]. There's a number of reasons behind this decision that I'll discuss in a later post but one of the pain points that I've had was around direct linking with html5mode and the negative impact it has on SEO. I've just managed to get it working so I'm sharing the steps I went through to hopefully save someone else some time.

![AngularJs SEO][5]


What is html5mode
-----------------

Before I go into the steps to solve the problem I thought I best explain what the problem is. Historically AngularJS app used hashbangs to root to the different controllers in the application. 'myapp.com/#!/Home'. This isn't particularly pretty and there's an SEO hit from the hashbang as this will understood by indexers as 'myapp.com/?_escaped_fragment_=Home'. The resolution to this is to use html5mode.

	$locationProvider.html5Mode(true);

This turns the ugly ducklin ''myapp.com/#!/Home' into the beautiful swan 'myapp.com/Home'. The problem with this is that we now have deep links and our server (IIS in my case) knows nothing about 'myapp.com/Home'. If I try to access this link, or anything else other than the root, I get a 404. The reason this wasn't an issue before was that all requests were going to our root and then angular was picking it up from there. This is still what we want to happen but we need our server to know this. 

Enter URL rewite
----------------

To make this work, and thanks to [Dustin Johnson][2] for sharing [this protip][3], we need to add some url rewrites. 

	<configuration>
	    <system.webServer>
	        <rewrite>
	          <rules>
	            <rule name="Main Rule" stopProcessing="true">
	                    <match url=".*" />
	                    <conditions logicalGrouping="MatchAll">
	                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
	                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
	                    </conditions>
	                    <action type="Rewrite" url="/" />
	                </rule>
	            </rules>
	        </rewrite>
	    </system.webServer>
	</configuration>

For this to work you will need to have the [URL rewite module installed in IIS][4]. For this to work with deeper links like Blog/AngularJs you need to also add this into <head> in your index.html.

	<base href="/" />

Here we are defining the root of the application so yours may be href="/app/" or something similar.

   [0]: http://www.yorkshiredigital.com
   [1]: https://angularjs.org/
   [2]: https://coderwall.com/dustinrjo
   [3]: https://coderwall.com/p/mycbiq
   [4]: http://www.iis.net/learn/extensions/url-rewrite-module/using-the-url-rewrite-module
   [5]: /img/angularjs.jpg
