---
title: Introducing Jquery Autocomplete
excerpt: I needed a lightweight, client-side autocomplete that didn't fight my styling, so I built one and put it on GitHub.
date: 2013-04-02
tag: JavaScript
---

I came across an issue the other day. I needed a fully client side autocomplete to append to a dynamically generated form. We were already using the asp.net ajax autocomplete control throughout the site but this was of no use to me here as all the elements needed to be generated on the fly. Also, the designers had already made the ajax autocomplete look pretty so in order to remain **[DRY][0]** I needed to avoid redoing their work. So, I knocked up **jquery autocomplete**.

![jquery autocomplete on GitHub][1]

There are plenty of other jquery autocomplete plugins out there that solve similar problems to this, [JQuery UI][2] and [select2][3] just to name a couple. Where my plugin differs is in its simplicity. First of all it is very lightweight, sub 4kb for the minified file. Secondly, it doesn't try to do your styling for you. It allows you to specify the classes on the final elements, maintaining consistency with your existing application.


## Using jquery autocomplete

Using this plugin is simple, just add a reference to the script:

	<script src="http://www.macsentom.co.uk/docs/jquery.autocomplete.min.js" />

Then append the autocomplete function to your ul or select element:

	$('#myselect').autocomplete();

If you need to be a little more specific you can specify the classes added to each of the elements:

	$(function() { 
	    $('#myul').autocomplete({ 
	        'containerclass' : 'your-container-class', 
	        'searchclass' : 'your-input-class', 
	        'resultsclass' : 'your-ul-class', 
	        'listitemclass': 'your-li-class', 
	        'selectedclass': 'your-selected-class'
	    }); 
	});

This plugin is open source and hosted on [GitHub][4] so feel free to fork and use it how you please. If there is anything that doesn't work for you or there is anything you would like to see adding then leave a comment here.

   [0]: http://programmer.97things.oreilly.com/wiki/index.php/Don "Don"
   [1]: /img/jquery.autocomplete-300x282.jpg "jquery autocomplete on GitHub"
   [2]: http://jqueryui.com/autocomplete/ "jquery ui"
   [3]: http://ivaynberg.github.com/select2/ "select2"
   [4]: https://github.com/MacsDickinson/jquery.autocomplete
