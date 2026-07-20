---
title: Hack Manchester 2013
excerpt: Twenty-five hours, two teams, one 2am pivot, and the birth of Dr Clockwork. What I took away from Hack Manchester.
date: 2013-10-30
tag: Hackathons
---

This weekend a group of us from [Leeds#][1] (the Leeds .Net user group) took a road trip across to Manchester to take part in this year's [Hack Manchester][2]. Hack Manchester is a **25 hour coding competition in the heart of Manchester**. It takes place in the amazing Museum of Science and Industry and is a part of Manchester Science Week. This was the second Hack Manchester and the format was pretty much the same as last year; a large group of geeks take on challenges set by sponsors for a bit of fun, a challenge, and the potential to win some swag. Along the way these geeks are supplied with copious amounts of food, sweets, fruit, coffee, beer and sleep deprivation, and the inevitable chortling and mega-lolz pursue. If your lucky you might also get to see some pretty nifty prototypes.

![Hack Manchester][3]


What we did
========

There were five of us that travelled over from Leeds and teams were limited to four so we split into two teams. [Paul Stead][4] and [Rich Tasker][5] paired up to take on the [Clockwork SMS][6] challenge - [The most ridiculous use of Clockwork SMS][7]. Their idea was to create an SMS version of the 80's classic text based adventure game [Zork][8]. Check out their video submission [here][9].

The remaining three of us, [Matt Ross][10], [Mat McLoughlin][11] and myself, decided to take on the [ao.com][12] challenge - [The Ultimate Hack Day companion][13]. Our plan was to sync up with Github and Twitter, gather as much data as possible and display some funky metrics. We had plans to use the number of commits and lines added to drive a horse race and to analyse commits to award achievements. By 2am we had sign up through Github and Twitter using [SimpleAuthentication][14], a simple [NancyFX][15] web project with [RavenDB][16] and [SignalR,][17] and we were getting a load of metrics back from Github using [RestSharp][18] and the [Github API][19]. Things were looking good, however we had a bit of a startling realisation; we were basically implementing the graphs already on Github, just not as well. This was a massive drain on our motivation - which was a problem as we weren't really having any fun. In [Lean Startup][20] terms we needed to decide if we were going to persevere or pivot. We went for pivot.

So at 2am - half way through - we decided to scrap the dashboard and start anew. Matt had been looking into [AIMLBot][21] - a .NET bot that makes it easy to implement Artificial Intelligence Markup Language - and had a plan to use this in conjunction with the Clockwork SMS API to create an “Ask Me Anything” SMS service. This is when [Dr Clockwork][22] was born. We spent the next few hours getting the service up and running and adding a website to display a live stream of incoming messages and answers. By around 8am we had a working prototype. The next 4 hours were spent working on the design for the site, ironing out as many kinks as possible with the AI and getting the site hosted on Azure. At 12 we launched the site at [http://drclockwork.co.uk][23]. Unfortunately the (not so) subliminal messaging in [our submission video][24] didn't work and we didn't win.

Lessons Learnt
==========

Preparation is everything! We needed to have settled on an idea before we got there rather than putting a flaky plan together and winging it.

I needed to be more familiar with the API's and libraries we were using. Sleep deprivation and an open bar don't make for the most pragmatic of thought processes. I probably spent over 5 hours battling with SignalR and it was all down to a missing script reference.

That said, one of the most useful things I've learnt is that SignalR is fricking awesome! Once you get your head around the principle it quickly becomes apparent how it could be applied in all sorts of scenarios. This is something I will definitely be using again.

Simplicity is key. It's really important not to try to do too much. When it gets to the early hours you need a simple win to stop despair kicking in. Get a basic prototype working as early as possible then spend time polishing it and adding features.

Beanbags are great for coding on. If you can put up with the heat pouring out of your laptop, then chilling back on a bean bag with a beer in hand is probably the ideal coding position. Well it is for me anyway.

The future of Dr Clockwork
=================

The purpose of creating this service was nothing more than a bit of light hearted fun. That said we will probably extend it a little - just for the crack! We've already got [the obligatory twitter account][25] so we will probably add that as a new mechanism to ask questions. It would also be nice to display the messages on the website within conversations. Oh and the obvious thing for us to do is to sell all your mobile numbers to GCHQ ! :P

Thanks to the organisers
================

This year Hack Manchester was organised even better than the last. Everything was seamless. There were still a few unavoidable wifi issues but these were quickly fixed or worked around. **PROTIP**: One of the wifi routers was in the beanbag room so signal in there wasn't a problem! [Joe][27], [Gemma][28], [Claire][29] and the high vis volunteers did a fantastic job of keeping us fed, watered and [entertained][30]. Well done!

Roll on next year!

   [1]: http://leeds-sharp.org/
   [2]: http://www.hackmanchester.com/
   [3]: /img/hackManchester.png
   [4]: https://twitter.com/pauljstead
   [5]: https://twitter.com/ritasker
   [6]: http://www.clockworksms.com/
   [7]: http://www.clockworksms.com/blog/hack-manchester-challenge/
   [8]: http://en.wikipedia.org/wiki/Zork
   [9]: http://www.youtube.com/watch?v=DZ3WE2z_HXs&amp;feature=youtu.be
   [10]: https://twitter.com/autonomatt
   [11]: https://twitter.com/mat_mcloughlin
   [12]: http://ao.com/
   [13]: http://blog.hackmanchester.com/post/63387766561/challenge-from-ao-com
   [14]: https://github.com/SimpleAuthentication/SimpleAuthentication
   [15]: http://nancyfx.org/
   [16]: http://ravendb.net/
   [17]: http://signalr.net/
   [18]: http://restsharp.org/
   [19]: http://developer.github.com/v3/
   [20]: http://en.wikipedia.org/wiki/Lean_Startup
   [21]: http://aimlbot.sourceforge.net/
   [22]: /img/dr-clockwork-logo-2.png
   [23]: http://drclockwork.co.uk/
   [24]: https://vimeo.com/77905665
   [25]: https://twitter.com/dr_clockwork (Dr Clockwork)
   [27]: https://twitter.com/theallseeingpie
   [28]: https://twitter.com/ruby_gem
   [29]: https://twitter.com/squarejazz
   [30]: http://www.youtube.com/watch?v=ZDOmm9d6V9A
