---
title: Unique Passwords - Why you need them and why Uniquify
excerpt: Password reuse is the real risk, not weak passwords. Here's the generator I built to give every site its own.
date: 2013-05-31
tag: Security
---

## What are the risks?

Password safety is increasingly the victim of bad press; rather unsurprisingly this is down to a lack of security. Whether it's [passwords being stored in plain text][1] or [yet another security breach][2], hackers are getting hold of passwords. While this is a problem, it is not the most pressing issue that I am concerned about. My concern is with password reuse highlighting the importance of using unique passwords. How many of you use the same password to log-in to numerous accounts over the internet, unaware of the risks you face from hackers?


When Linkedin had its passwords leaked, hackers didn't just get into Linkedin accounts, they also got into Facebook, Google, Amazon; the list goes on. And what is most alarming is that these accounts actually contain your credit card details - anyone use [Google Wallet][3]? That's just the start - once the hacker has gained access to a few commonly used websites they have more than enough information to do some real damage.

![hacking password security][4]

## So what can you do?

Run to your computer and change all of your passwords to be unique? But how are you supposed to remember which account uses which password? This is where password storage programmes come in - of course, until the program storing your passwords gets hacked. What you need is a unique password generator that generates your password for you as and when you need one.

## Unique Passwords

Meet [Uniquify][5] - a unique password generator that I began working on a few months ago. It began as a simple algorithm that I used to work out unique passwords for different sites in my head; take one letter from here, one from there, add something pseudo-random and hey presto you have yourself a unique password. The problem with that is that if it is simple enough for me to work out in my head it's definitely simple enough for a hacker to crack. So I put it into a web application, added SHA265 hashing and improved my algorithm to ensure that it was non-reversible.

## How does it work

[Uniquify][5] takes the domain you are logging into and a secret word of your choice; hashes them and then runs them through my algorithm, which takes into account length and character selection. This process then creates the final, unique password specific to the domain. In order to ensure that your secret word could never be intersected by hackers, the transformation is done in the browser. This does mean that the algorithm is visible to anyone with an F12 button, however using SHA265 hashing, along with my algorithm, ensures that this is a one-way transformation, removing the danger of a hacker recovering your secret word.

![Uniquify - unique password generator][6]

## Next steps

This app is still young and I have a lot I'd like to add to it. I am currently working on a Google Chrome extension that will enable users to generate a secure password from any log-in page. If anyone has any suggestions of changes or improvements then please leave them in the comments. I would also encourage anyone to attempt to crack the algorithm and get the secret word from the resulting password.

   [1]: http://plaintextoffenders.com/ "plain text offenders"
   [2]: https://drupal.org/news/130529SecurityUpdate "Important Security Update: Reset Your Drupal.org Password"
   [3]: https://wallet.google.com/ "Google Wallet"
   [4]: /img/hackers_security_password-100004008-gallery.jpg
   [5]: http://www.macsentom.co.uk/Uniquify "Uniquify - Secure Password Generator"
   [6]: /img/SecurePass.png
