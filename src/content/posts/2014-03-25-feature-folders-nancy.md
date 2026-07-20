---
title: Feature folders and Nancy
excerpt: Controllers, Models, Views tells you the framework. Basket, Checkout, Product tells you the app. Organising Nancy around features.
date: 2014-03-25
tag: Architecture
---

Working on large applications can get a little messy and related components can end up strewn across a project. When working with MVC or Nancy I often find myself in situations where I'm sifting through the controllers, models and views folders to find related files. This is frustrating at best - especially when the height of one of these folders can span the hight of your monitor. One solution may be to get a bigger monitor - but there's a limit.

![Giant Monitor][0]


 [Uncle Bob][1] suggests an alternative approach - [Screaming Architecture][2]:

 > Architectures are not (or should not) be about frameworks. Architectures should not be supplied by frameworks. Frameworks are tools to be used, not architectures to be conformed to. If your architecture is based on frameworks, then it cannot be based on your use cases.

Let me pose this slightly differently. Which of these reactions is most useful when you first open a project?

 1. __Controllers__, __Models__, __Views__ - So this is an _MVC_ project.
 2. __Basket__, __Checkout__, __Product__ - So this is an _ECommerce_ system.

Knowing the framework that is being used is an essential piece of information but it shouldn't be the single most important thing about your application. What does it do? What apects are there to it? What's the use case?

Which of these is most useful when you start to investigate a bug in the checkout?

 1. __Controllers__, __Models__, __Views__ - Yes, I get that it's an _MVC_ project but that doesn't help narrow down where the bug might be.
 2. __Basket__, __Checkout__, __Product__ - Ok, we have a starting point.

What about Nancy
----------------

One of my favorite things about the Nancy framework is its focus on style. This is in some way a byproduct of the super-duper-happy-path but nevertheless it's an important factor in how a project is percieved and enjoyed because otherwise it feels too much like hard work. I have always put a focus on the simplicity and the usability of the frameworks I use in my personal projects but why should this stop at work? The goal of Nancy is __to stay out of the way as much as possible__ so unsurprisingly it's very simple to rearchitect the default template. Being the lovable rogue that I am I'm just going to move everything around and see what breaks. Here's what I'm starting with:

![Starting Folders][3]

And this is what I've changed it to:

![Feature Folders][4]

When this is run it will throw an exception - but a useful one.

	Nancy.ViewEngines.ViewNotFoundException: Unable to locate view 'LandingPage'
	Currently available view engine extensions: sshtml,html,htm,cshtml,vbhtml
	Locations inspected:	views/Home/LandingPage-en-US,
							views/Home/LandingPage,
							Home/LandingPage-en-US,
							Home/LandingPage,
							views/LandingPage-en-US,
							views/LandingPage,
							LandingPage-en-US,
							LandingPage

As an aside - this is how you throw a useful error. I can see what was attempted and why it didn't work so it's pretty clear what the problem is - Nancy doesn't know where I've hidden my views. We can tell _her_ by adding a [custom view location convention][5]. This goes in the `ConfigureApplicationContainer` method in the bootsrapper.

	Conventions.ViewLocationConventions.Add((viewName, model, context) => string.Concat(context.ModuleName, "/Views/", viewName));

This lovely one liner tells Nancy of another potential location for the views and hence makes it work.

With the top level archetecture nice and easy to navigate the next step is to [make the modules easier to manage][6].

   [0]: /img/siemens_monitor.jpg
   [1]: http://www.8thlight.com/team/uncle-bob
   [2]: http://blog.8thlight.com/uncle-bob/2011/09/30/Screaming-Architecture.html
   [3]: /img/not-feature-folders.png
   [4]: /img/feature-folders.png
   [5]: https://github.com/NancyFx/Nancy/wiki/View-location-conventions
   [6]: http://www.philliphaydon.com/2013/11/making-nancy-modules-easier-to-manage/
