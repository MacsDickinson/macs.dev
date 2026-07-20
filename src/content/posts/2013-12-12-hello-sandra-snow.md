---
title: Hello Sandra Snow
excerpt: Why I ditched WordPress for Sandra.Snow, a Jekyll-inspired static blog engine built on Nancy, and deployed it to Azure.
date: 2013-12-12
tag: Nancy
---

As the hawk eyed of you will have noticed - my blog has changed somewhat recently. Not only has it had a total redesign but I've also switched the blogging engine from WordPress to [Sandra.Snow][1]. Sandra is a Jekyll inspired static html blogging engine written by [Phillip Haydon][14] and [Jonathan Channon][15] and is powered by the [Nancy web framework][0].

The structure of a Snow blog is simple - a [Razor][2] site defines your template and static pages and posts are written in markdown. Snow.exe simply converts the markdown to html, compiles and renders the site as html and outputs it in your target folder. Simple. No database. No fancy dlls. Just html. Take a look at the [sample site on GitHub][3] to get a better idea of this. [David Whitney][5] has also created a [sample template for use on Azure][4] that contains the [deployment][6] [files][7], [compiler][8] and output directory you will need.

From here on I will be taking Davids approach of adding Snow.exe into a _compiler subfolder and code samples will referring to my [blog on GitHub][9].


Setting up Sandra locally
-------------------------

The first thing you should take a look at in the templates is [snow.config][10] which defines everything from where the posts are to the url format. The important thing for running this locallay is the output path as this is where the site will be deployed.

Living in the Visual Studio world it can be easy to get complacent about simply hitting hitting F5 and waiting for the browser to show. There are parts of this that I don't like, mainly the waiting, but I do like having a one click build. I'm using [Sublime Text][11] for editing this post so to keep my lovely one click build process I've added a [custom build system][16]:

	{
		"cmd": "$project_path\\_compiler\\Snow.exe config=$project_path\\"
	}

Note that this depends on the sublime project file being at the root of the site and the compiler being in the _compiler subfolder. With that lot set up it's Ctrl+B and hey presto the site is updated in the output folder so just point a local IIS website at it.

Building your own template
--------------------------

The templates are just Razor so @if and @for to your hearts content but take a look in the [View Models][12] to see what is available on each page. You'll also want to hop back into snow.config to define any additional pages or change the folder structure.

Deploying to Azure
------------------

This is so easy it's hardly worth me writing up. First create a new website on Azure. If you've already got your code on GitHub then just point the website to this, if not then add a private git repo like Phillip Haydon shows [here][13]. Providing you've used eiteir [David][4] or [my][9] repos as a template it will build and deploy. That's it. Now every time you commit to the branch you have synced with Azure your site will be updated. This seems very SDHP to me.

   [0]: http://nancyfx.org
   [1]: https://github.com/Sandra/Sandra.Snow
   [2]: (http://weblogs.asp.net/scottgu/archive/2010/07/02/introducing-razor.aspx) "Razor"
   [3]: https://github.com/Sandra/Sandra.Snow/tree/master/SnowSite/Snow
   [4]: https://github.com/davidwhitney/Sandra.Snow.AzureTemplate
   [5]: https://twitter.com/david_whitney
   [6]: https://github.com/davidwhitney/Sandra.Snow.AzureTemplate/blob/master/.deployment
   [7]: https://github.com/davidwhitney/Sandra.Snow.AzureTemplate/blob/master/compile.snow.bat
   [8]: https://github.com/davidwhitney/Sandra.Snow.AzureTemplate/tree/master/Snow/_compiler
   [9]: https://github.com/MacsDickinson/blog
   [10]: https://github.com/MacsDickinson/blog/blob/master/Snow/snow.config
   [11]: http://www.sublimetext.com/
   [12]: https://github.com/Sandra/Sandra.Snow/tree/master/src/Snow/ViewModels
   [13]: http://vimeo.com/65055971
   [14]: https://twitter.com/philliphaydon
   [15]: https://twitter.com/jchannon
   [16]: http://docs.sublimetext.info/en/latest/reference/build_systems.html
