---
title: Learn Nancy in 62 pages
excerpt: A review of Christian Horsdal's Instant Nancy Web Development. Sixty-two pages, and I still learned things I'd overlooked.
date: 2014-01-04
tag: Book Reviews
---

We all like a little bit of light reading over the Christmas break between the massive meals, mulled wine, and cheese and crackers. This Christmas was the turn [Christian Horsdal][0]'s new book [Instant Nancy Web Development][1].


![Instant Nancy Web Development][3]

For those of you who don't know [Nancy][2] is a low ceremony web framework for .Net that focuses on making websites and API's simple and fun to write. Nancy draws a lot of its inspiration from the [Sinatra framework for Ruby][4] and is in many ways an alternative to Microsoft's MVC and WebAPI. If Nancy is totally new to you and you are wondering why anyone would feel the need to use an alternative to MVC then I would suggest reading the preface to the book as Christian makes some great observations on the importance of style and simplicity in code. He also introduces the Super Super Happy Path which is the ethos that Nancy developers abide by.

I approached this book as a web developer who is familiar with, and enjoys working with Nancy, so I was keen to see what it had to offer beyond the basics. The format of the book makes it accessible to people of all levels. Each chapter - or recipe - covers a distinct topic making it simple to pick up at any point. If you're new to Nancy then you would be best off reading through sequentially as each recipe builds upon the previous one, starting off with a simple hello world application and building up to more advanced real world scenarios. If you're already familiar with the basics of Nancy then you can safely jump to one of the more advanced chapters. This book will also make a great reference when it comes to adding more advanced features such as content negotiation or error logging.

The format of each chapter is also consistent, which makes them very quick to consume. Christian takes the [red, green, refactor][5] approach from TDD which nicely displays the problem before explaining the solution, whilst simultaneously promoting good coding practices. In each recipe we get an overview of what it is setting out to achieve, the code for the tests and implementation, and an explanation of what is happening. The "There's more..." section at the end of each recipe points you in the direction of many non-generic functions or techniques that you may not be aware of.

I found it very useful to read the book from cover to cover. Much of the content simply reaffirmed what I already knew but it also informed me of a number of basic things I had overlooked. For example, I didn't realised the full capabilities of `Nancy.Testing`, nor did I know that creating your own view engine is as simple as implementing `IViewEngine`. There were also a lot of topics that were new to me. It was great to see how easily content negotiation and asynchronousy can be added to an application. [Instant Nancy Web Development][1] is definitely a book that I will be referring back to when I come to adding these features.

As luck would have it there's currently a sale on so you can [grab a copy of the ebook for **£3.05**][1]. You'd be silly not to.

   [0]: http://twitter.com/chr_horsdal "Christian Horsdal"
   [1]: http://bit.ly/1bIK5hp "Instant Nancy Web Development"
   [2]: http://nancyfx.org "Nancy"
   [3]: /img/instant_nancy_web_development.jpg "Instant Nancy Web Development"
   [4]: http://www.sinatrarb.com/ "Sinatra"
   [5]: http://www.jamesshore.com/Blog/Red-Green-Refactor.html "Red, Green, Refactor"
