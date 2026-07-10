---
title: Google Chrome Extension Tutorials - Popup.html
excerpt: Part two of the Chrome extension series: adding icons, a popup window, and pulling in external resources.
date: 2014-02-03
tag: Chrome Extensions
---

This is the second post in my [series of tutorials for Google Chrome extensions][0]. Following on from [my last post][1] where we created a very basic - and somewhat annoying hello world extension - we will now start afresh and create a simple pop-up page to search Instagram.

In this lesson we will cover:

1.  [Adding Icons](#icons)
2.  [Popup Html](#popuphtml)
3.  [Allowing external resources](#externalresources)

Code from this tutorial is [available on GitHub][7].

## Adding Icons

Before we get started with creating the pop-up window we're going to want to add an icon to make it stand out and to give us something to click. We're going to start from scratch in this lesson so create a new `manifest.json` file:

	{
	    "name" : "InstaKitten",
	    "version" : "0.0.1",
	    "description" : "Google Chrome Extension Tutorials: Popup.html",
	    "homepage_url": "http://www.macsdickinson.com/category/chrome-extension/",
		"icons" : {
			"16" : "icons/icon.png",
			"48" : "icons/icon_48.png"
		},
	    "manifest_version" : 2
	}

Most of this file was covered in [Part 1][1] but we now see the addition of the `icons` element. I've only included the minimum for what we need here - 16x16 for the icon on the toolbar and 48x48 for in the [extension manager][3].

![Chrome Extension Manager][2]

It's good practice to provide a number of different resolutions for your icons as there are a number of different places that they are rendered. I generally provide icons for 16x16, 19x19, 38x38, 48x48 and 128x128. The icons I have used are [available on Github][8].

## Popup Html

Now that we have a pretty icon we can add a html file for the pop-up. Create a new file in the extensions root folder called `popup.html` and give it some content. We'll start as basic as possible:

	<!doctype html>
	<html>
	  <head>
	    <title>Chome Extension Tutorials: Lesson 2 - Popup.html</title>
	  </head>
		<body>
			Hello World!
		</body>
	</html>

Next we need to reference this file in our `manifest.json` file. Add the following element:

	"browser_action": {
		"default_icon": "icons/icon.png",
		"default_popup": "popup.html"
	}

Note that we've referenced the icon again here - this is the 16x16 version that we want to display in the browsers toolbar. Load the extension in Chrome [as described in part 1][4] and you should see the icon in your toolbar. Clicking it will display your html page with the familiar message "Hello World!".

## Allowing External Resources

Up until now we've not done anything with any substance - lets change that by loading some data into our pop-up window. Update `popup.html` to contain the following content:

	<!doctype html>
	<html>
	  <head>
	    <title>Chome Extension Tutorials: Lesson 2 - Popup.html</title>
	    <style>
			body { min-width: 224px; overflow-x: hidden; margin: 10px; }
			input[type="text"] { width: 66%; }
			input[type="button"] { width: 30%; }
			img { border: 1px solid black; margin: 5px; vertical-align: middle; width: 100px; height: 100px; }
			.searchbox { margin: 5px; }
	    </style>
	    <script src="scripts/popup.js"></script>
	  </head>
		<body>
			<div class="searchbox">
				<input type="text" id="searchTerm" value="kitten" />
				<input type="button" id="search" value="Search" />
			</div>
			<div id="results"></div>
		</body>
	</html>

There's no magic here, just a couple of inputs and a div to hold some results. You'll notice that we've referenced a script file - this is because __your JavaScript and HTML needs to be kept in separate files__ due to [Googles content security policy][5]. Go ahead and create `popup.js` in  scripts folder and give it the following content:

	var imageGenerator = {
		requestImages: function() {
			var searchTerm = document.getElementById('searchTerm').value;
			var req = new XMLHttpRequest();
			req.open("GET", 'https://api.instagram.com/v1/tags/' + searchTerm + '/media/recent?access_token=51998352.1fb234f.1cff33c9ce24494e92536e353b1b1ee2', true);
			req.onload = this.showImages.bind(this);
			req.send(null);
		},
		clearResults: function() {
			var results = document.getElementById('results');
			var children = results.children;
			for (var i = children.length; i > 0; i--) {
				results.removeChild(children[i-1]);
			}
		},
		showImages: function (e) {
			this.clearResults();
			var response = eval('(' + e.target.responseText + ')');
			for (var i = 0; i < response.data.length; i++) {
				var img = document.createElement('img');
				img.src = response.data[i].images.thumbnail.url;
				if (response.data[i].caption) {
					img.setAttribute('alt', response.data[i].caption.text);
				}
				document.getElementById('results').appendChild(img);
			}
		}
	};

	document.addEventListener('DOMContentLoaded', function () {
		imageGenerator.requestImages();
		document.getElementById("search").addEventListener("click", requestImages, false);
	});

	function requestImages() {
		imageGenerator.requestImages();
	}

Again, there's no magic here - we are simply pinging a request to the Instagram API and displaying the results. Now, if you reload the extension and try opening the pop-up again you will get - wait for it - nothing. Check the console and you should see an error something along the lines of:

	XMLHttpRequest cannot load https://api.instagram.com/v1/tags/kitten/media/recent?access_token=51998352.1fb234f.1cff33c9ce24494e92536e353b1b1ee2. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'chrome-extension://[extention_id]' is therefore not allowed access. 

This is because `popup.js` is calling off to an external resource that your browser hasn't authorised. The sandboxed environment for Chrome extensions is very strict on what you can access - and rightly so - you wouldn't want a malicious app firing your login details off to an unknown server. In order to enable this type of communication we need to add `https://api.instagram.com/` to a white-list of resources. Update the `manifest.json` file with the following element:

    "permissions": [
		"https://api.instagram.com/"
	]

Also, as we are wanting to call `eval()` on our results from Instagram we need to relax the security policy a little. To do this add the following element to the `manifest.json` file.

	"content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"

With these permissions nicely relaxed you should now be able to reload the extension and bask in your furry glory.

![Chrome Extension Manager][6]

Stay tuned for the next instalment in this [Chrome Extensions 101][0] series where I will be taking a closer look at content scripts.

Code from this tutorial is [available on GitHub][7].

You can also install the finished sample extension from the [Chrome Web Store][9].

   [0]: /../category/chrome-extension/ "Chrome extension tutorial series"
   [1]: /../javascript/google-chrome-extension-tutorial-hello-world "GOOGLE CHROME EXTENSION TUTORIALS: HELLO WORLD"
   [2]: /img/2014-02-03_15_27_28-Lesson2-icons.png "Chrome Extension Manager"
   [3]: chrome://extensions/
   [4]: /../javascript/google-chrome-extension-tutorial-hello-world/#unpackedextensions "GOOGLE CHROME EXTENSION TUTORIALS: HELLO WORLD"
   [5]: http://developer.chrome.com/extensions/contentSecurityPolicy.html
   [6]: /img/2014-02-03_15_27_28-Lesson2-InstaKitten.png "InstaKitten"
   [7]: https://github.com/MacsDickinson/ChromeExtensions101/tree/master/Part%202%20-%20Popup.html/
   [8]: https://github.com/MacsDickinson/ChromeExtensions101/tree/master/Part%202%20-%20Popup.html/icons
   [9]: https://chrome.google.com/webstore/detail/instakitten/ldjiocmhpjhpcelgfbdeoenoojgejboc?utm_source=macsdickinson.com
