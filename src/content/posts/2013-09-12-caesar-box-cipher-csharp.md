---
title: Caesar Box Cipher in C#
excerpt: A Roman cipher from Dan Brown's back catalogue, solved in C#, just in time for GCHQ's recruitment puzzle.
date: 2013-09-12
tag: Cryptography
---

## What is a Caesar Box Cipher?

A number of years ago I read Dan Browns [Digital Fortress][1]. Trashy of me I know but this was the first time I had ever acknowledged cryptography. In this book they discuss a number of cryptographic ciphers but the one that stuck out in my mind was the Caesar Box cipher for it simplicity. Surprisingly this encryption technique dates back to the Roman times when Caesar would send information via courier and in order to prevent these instructions being intercepted Caesar would encode them. To do this he would split the message into equal lines and rewrite it vertically.


Take the encrypted message “WDCEOEOLRGLNECGLEVLS”.

If you split this into three lines of equal length you get:

    WDCEO
    EOLRG
    LNECG
    LEVLS

Read this back vertically and you see the message “Well done clever cloggs”.

## Doing this in code

This is obviously a very simple Caesar Box example but with a little bit of basic maths we can write a function to decode any box of any size.

Firstly we want to split the encoded message into the separate lines:

    string[] split = new string[(input.Length + boxLength -1)/boxLength]; 
    
    for (int i = 0; i < input.Length; i+=boxLength)
    {
        split[i/boxLength] = input.Substring(i, (boxLength < input.Length - i) ? boxLength : input.Length - i);
    }

Then it is simply a case of looping through the lines and building up the new message

    StringBuilder sb = new StringBuilder(input.Length);
    for (int i = 0; i < boxLength; i++)
    {
        for (int k = 0; k < split.Length; k++)
        {
            if (split[k].Length >= boxLength)
            {
                sb.Append(split[k][i]);
            }
        }
    }

An that is it. Here's the whole method for you lazy Romans.

	public string SolveCaesarBox(string input, int boxLength)
	{
		string[] split = new string[(input.Length + boxLength -1)/boxLength];
	 
		for (int i = 0; i < input.Length; i+=boxLength)
		{
			split[i/boxLength] = input.Substring(i, (boxLength < input.Length - i) ? boxLength : input.Length - i);
		}
		StringBuilder sb = new StringBuilder(input.Length);
		for (int i = 0; i < boxLength; i++)
		{
			for (int k = 0; k < split.Length; k++)
			{
				if (split[k].Length >= boxLength)
				{
					sb.Append(split[k][i]);
				}
			}
		}
		return sb.ToString();
	}

## GCHQ :: Can you find it?

You may have seen [GCHQ's most recent recruitment drive][2]&nbsp;in the news. Basically they have hidden a number of encrypted messages around the internet for you the crack and submit at&nbsp;[https://canyoufindit.co.uk][3]. Now that you know about the Caesar Box this first one should be pretty simple.

![Can you find it - Caesar Box][4]

   [1]: http://www.amazon.co.uk/Digital-Fortress-Dan-Brown/dp/0552159735 (Digital Fortress on Amazon)
   [2]: http://www.telegraph.co.uk/news/uknews/defence/10301435/Can-you-crack-the-code-GCHQ-unveils-fiendish-puzzle-for-new-recruits.html (Can you crack the code? GCHQ unveils fiendish puzzle for new recruits)
   [3]: https://canyoufindit.co.uk/
   [4]: /img/2013-09-12-22_37_22-GCHQ-__-Can-you-find-it_.png (Can you find it - Caesar Box)
