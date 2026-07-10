---
title: Google Chrome - The holy grail of password hacks
excerpt: How easy it is to walk into someone's whole online life through Chrome's saved passwords, and what you should do about it.
date: 2013-08-12
tag: Security
---

![Google Chrome password hack vulnerability][1]

I recently bought a new laptop and one of the first things I did was download Google Chrome (the only real use for Internet Explorer) and log in with my Google account. This is a pretty seamless user experience - Google has done well - all I have to do is sign in and all my apps and extensions start downloading. Furthermore, all of my saved passwords are downloaded and I can log right into everything. Lovely. But hang on - does that mean that if my Google account is compromised the hacker has access to all of my accounts? And not just that, but they can also go into the advanced settings where all of my saved passwords are visible in plain text.

![Is this secure password management?][2]

Storage techniques aside, we have a major issue here. Not only does anyone who has access to your computer also have access to all of your passwords but so does any hacker that has the will to get into your Google account. To make the point that this is a serious security flaw I am going to show you how easy this is to do.


# Hacking into Google Chrome

Time for me to put my black hat on. First things first we need someone to hack. Let's head over to [PasteBinLeaks][3] for some inspiration. This may be old but it will do nicely:

> [@PastebinLeaks](https://twitter.com/PastebinLeaks): Possible massive mail/pass leak #pastebinleaks

Follow the link and you'll find a big list of usernames, email addresses and hashed passwords, 338 to be precise. But these passwords are hashed - surely that will stop us? Maybe. Probably not. The hash just adds another step to the process. Lets head over to Google and do a search for one of them.

![Google Search for password hash][4]

The first thing this tells us is that these are MD5 hashes so we now know what to search for. I'm going to ignore that the second result displays the plain text password and head over to [www.md5-hash.com][5] to do a search. There you go - the decrypted text for MD5 hash **297dbe7699dcfa60609bf9e667e2e4dc** is **assword**.

Now I'm not particularly patient so there's no way that I'm doing this 337 more times. To speed things up a bit lets take a copy of the file on pastebin, do a little pre processing and run it through a [linqpad][6] script:

	void Main()
	{
		string inputFile = @"C:\pastebin-output.txt";
		string md5url = @"http://www.md5-hash.com/md5-hashing-decrypt/";
		using (System.IO.StreamReader file = new System.IO.StreamReader(inputFile))
		{
			string line;
			while((line = file.ReadLine()) != null)
			{
				string[] entries = line.Split('|');
				var username = entries[0];
				var hashedPW = entries[1];
				var email = entries[2];

				WebClient webclient = new WebClient();
				string response = webclient.DownloadString(md5url+hashedPW);

				Match match = Regex.Match(response, "<p class=\"fs-12\">Decrypted text for MD5 hash <strong>[^<]+</strong> is <strong class=\"result\">([^<]+)</strong></p>");
				if (match.Length > 0)
				{
					match.Groups[1].Value.Dump(username + " - " + email);
				}
			}
		}
	}

Fast-forward less than four minutes and I've got 51 plain text passwords. This is 15 percent of the original 338 so the MD5 hash has done some good but if we really wanted to crack the other 287 we could. The important thing to point out here is that these 51 passwords are the most generic ones. Common enough for them to have been decrypted and added to the database they have over at md5-hash.com. If you use a secure password it is far less likely to be in there, better yet if it's unique. Of these 51 passwords 11 of them are for gmail accounts - but that doesn't matter because you can log into Chrome with any email account. Anyway, all we need is one person that has reused this email and password for Google - and there are two. So I take my pick, sign into Google Chrome and I get this lovely message:

![Confirm Location][7]

Touché Google, you have done well. If only there was some sort of tool that I could use to search the internet for this kind of information. I mean I have the username and email, I just need something I can use to scan the internet for related information. Any Ideas? Google?

![Google Search][8]

With the huge surge in social media these last few years every webmaster and his dog is asking you for personal details so it doesn't take long to find out where the victim lives. Find the nearest city and BINGO! I'm in. All I need to do is give it a few minutes to sync up and head over to [chrome://settings/passwords][9] and there they are.

The point of all this is not to give a how-to but to point out a number of easy ways that this sort of vulnerability can be avoided.

## Use a secure password

The first and simplest thing you should do is make sure that your password is secure. The 51 passwords that I got hold of were simple ones like "qwerty", "Password1" or "snickers". If you use a generic password like one of these no hashing algorithm will save you. All it takes is one person to crack it and they may as well be storing it in plain text.

## Use a unique password

It doesn't matter how strong your password is, if you sign up to a service that stores their passwords without encription it is going to be compromised. I've written about [the importance of using unique passwords][10] before and it's a point I can't stress enough. I was only able to get into these accounts because the victims had used the same password for both Google and Biclops Games. I totally understand why people don't do it but using unique passwords doesn't mean you have to keep a great big list of them any more. Use a proper password manager like LastPass or use my own unique password generator [SecurePass][11]. <-- shameless plug

## Don't save your passwords in your browser

If all else fails just don't save them in your browser. Sure it is lovely to have all the sign in fields automatically populated but with convenience comes vulnerability. If your passwords are complicated and unique enough for you to need to maintain a list of them - which they should be - then use a properly secured password manager.

## **Conclusion**

This is definitely a security risk and it is something that Google should look into, at the very least they should remove the feature that lets you view the passwords in plain text. But ultimately it is your responsibility to make sure that your online presence is secured. If you're going to use one email address and one generic password for everything then no amount of security software is going to be able to help you.

   [1]: /img/aw-snap.png (Aww Snap)
   [2]: /img/2013-08-08-10_43_19-Settings-Passwords.png
   [3]: https://twitter.com/PastebinLeaks (Pastebin Leaks)
   [4]: /img/2013-08-08-23_05_17-297dbe7699dcfa60609bf9e667e2e4dc-Google-Search.png
   [5]: http://www.md5-hash.com/md5-hashing-decrypt/297dbe7699dcfa60609bf9e667e2e4dc (MD5 Hash)
   [6]: http://www.linqpad.net/ (Linqpad)
   [7]: /img/2013-08-08-11_55_26-Confirm-Location.png
   [8]: /img/2013-08-08-22_27_53-Google-Search.png
   [9]: chrome://settings/passwords
   [10]: http://www.macsentom.co.uk/2013/05/unique-password-generator-securepass/ (Unique Passwords - Why you need them and why SecurePass)
   [11]: http://www.macsentom.co.uk/securepass (SecurePass)
