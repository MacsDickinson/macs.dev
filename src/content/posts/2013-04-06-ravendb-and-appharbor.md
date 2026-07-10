---
title: Using RavenDB and AppHarbor
excerpt: Getting RavenDB and AppHarbor working together for continuous deployment, including the connection-string gotcha that trips everyone up.
date: 2013-04-06
tag: .NET
---

I recently started an ASP.NET MVC 4 project using [RavenDB][1] and one of the first things I've taken a look at is how to implement continuous integration. We are using GitHub for source control so my first thought was [Travis CI][2] but after reading into some of the issues with implementing this with .NET projects I decided to look elsewhere. My next port of call was [AppHarbor][3], I've not used it before but I've heard great things about it. Getting signed up and getting the automated build running was simple. Next I needed to figure out how to use RavenDB and AppHarbor together.


## AppHarbor Setup

First things first, you need to add the RavenHQ add-on. Go to the Add-ins menu, find RavenHQ and add it. Simple.

Next you want to grab the connection string for your new database. Find RavenHQ (or just click [this link][4] while logged in), click on your database and select connection details.

## Config Setup

In order to set this connection string in AppHarbor you will want to set up config transformations in Visual Studio. Firstly create a new solution configuration "AppHarbor". Then, right click the web.config and select "Add Config Transform". This will add Web.AppHarbor.config.

If you already have RavenDB set up you will have a connection string set up in your base web.config: (if you don't then [have a read of this][5])

	<connectionStrings>
		<add name="RavenDB" connectionString="Url=http://localhost:8080" />
	</connectionStrings>

In order to make this play nicely with AppHarbor you need to name the connection string **RavenHQ** and also include the database name. This is a bit of a Gotcha as naming the connection string RavenDB doesn't work.

	<connectionStrings>
		<add name="RavenHQ" connectionString="Url=http://localhost:8080/databases/MyDatabase" />
	</connectionStrings>

Now you need to add the connection string from RavenHQ to to Web.AppHarbor.config:

	<connectionStrings>
		<add name="RavenHQ" connectionString="Url={your connection string};ApiKey={your api key}"
		  xdt:Transform="SetAttributes" xdt:Locator="Match(name)"/>
	</connectionStrings>

Once that is done all you need to do is tell AppHarbor which config transformation to use. Go to your applications settings page and change the environment to AppHarbor.

And that is it. Push your config changes to GitHub and watch the magic happen.

#Update

Configuration variables can be customised in AppHarbor so recently I have been configuring this using appSettings and setting up my my document store like so:

	var store = new DocumentStore
		{
			Url = ConfigurationManager.AppSettings["RAVENHQ_URI"],
			DefaultDatabase = ConfigurationManager.AppSettings["RAVENHQ_Database"],
			ApiKey = ConfigurationManager.AppSettings["RAVENHQ_APIKEY"],
		};
	store.Initialize();

   [1]: http://ravendb.net/ "RavenDB"
   [2]: https://travis-ci.org/ "Travis CI"
   [3]: https://appharbor.com/ "AppHarbor"
   [4]: https://mgmt.ravenhq.com/Home/Databases "RavenHQ"
   [5]: http://www.dalsoft.co.uk/blog/index.php/2012/04/12/mvc-get-ravendb-up-and-running-in-5-minutes-using-ninject/ "mvc get ravendb up and running in 5 minutes using ninject"
