---
title: Browser specific JQuery script bundling
excerpt: Serving different jQuery versions to different browsers using ASP.NET script bundles and conditional comments.
date: 2013-07-17
tag: .NET
---

Script bundling has become a standard feature for all my recent projects, it simplifies and centralises script management. But what can you do if you need to load different scripts based on the users browser? For example, if you're using JQuery 2.x but have to support lower versions of IE you're going to want to specify a supported version of JQuery. Luckily script bundles work much the same as normal script references.


Register the following bundles:

	bundles.Add(new ScriptBundle("~/bundles/jquery2").Include(
					"~/Scripts/jquery-2.0.2.js",
					"~/Scripts/jquery-migrate-{version}.js"));

	bundles.Add(new ScriptBundle("~/bundles/jquery1").Include(
					"~/Scripts/jquery-1.10.2.js",
					"~/Scripts/jquery-migrate-{version}.js"));

Reference these in your markup like so:

	<!--[if lt IE 9]>
		 @Scripts.Render("~/bundles/jquery1")
	<![endif]-->
	<!--[if gte IE 9]><!-->
		 @Scripts.Render("~/bundles/jquery2")
	<!--<![endif]-->

This will render as:

	<!--[if lt IE 9]>
		<script src="/Scripts/jquery-1.10.2.js"></script>
		<script src="/Scripts/jquery-migrate-1.0.0.js"></script>
	<![endif]-->
	<!--[if gte IE 9]><!-->
		<script src="/Scripts/jquery-2.0.2.js"></script>
		<script src="/Scripts/jquery-migrate-1.0.0.js"></script>
	<!--<![endif]-->

And there you have it
