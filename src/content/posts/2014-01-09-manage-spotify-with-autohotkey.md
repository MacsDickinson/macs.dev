---
title: Manage Spotify with AutoHotKey
excerpt: No media keys at work, so I mapped my own with AutoHotKey. Writing it down so I stop losing the script.
date: 2014-01-09
tag: Productivity
---

I've got a fancy keyboard at home that's so futuristic it has play and pause buttons on it. Crazy I know! My computer at work isn't quite as spectacular as this so I have to resort to other means if I don't want to be constantly opening [Spotify][0]. A couple of years ago a [colleague][1] showed me [AutoHotKey][2] - a scriptable desktop automation application -  for this very reason. I've since lost that script (and that keyboard) so I'm writing this post to help me next time I lose it.

Setting up your script
----------------------

Downloading and installing AutoHotKey is as straightforward as it should be. Once you've got it running you're going to want to create your script. If like me you want the script to run on startup go ahead and create it in your startup folder. Call it something like startup.ahk. My file looks a little something like this:

      ^!Space::Media_Play_Pause     ; Ctrl+Alt+Space => Play/Pause music
      ^!Left::Media_Prev            ; Ctrl+Alt+← => Previous track
      ^!Right::Media_Next			; Ctrl+Alt+→ => Next Track
      ^!Up::Volume_Up				; Ctrl+Alt+↑ => Volume up
      ^!Down::Volume_Down           ; Ctrl+Alt+↓ => Volume down

You can do a lot more with AutoHotKey, check out their [quick start guide][3], [hotkey list][4], [key list][5] and [command list][6] to get an idea of what you can do.

Update
------

As suggested by [Matt][1] in the comments - I've taken a look at [SharpKeys][7] to map my CapLocks (who uses it?!) to a function key - F15. Using AutoHotKey I can then map my mapped F15 plus other keys to send the commands:

      F15 & Space::Send {Media_Play_Pause}   ; Caps+Space => Play/Pause music
      F15 & Left::Send {Media_Prev}          ; Caps+← => Previous track
      F15 & Right::Send {Media_Next}         ; Caps+→ => Next Track
      F15 & Up::Send {Volume_Up}             ; Caps+↑ => Volume up
      F15 & Down::Send {Volume_Down}         ; Caps+↓ => Volume down

And for when someone does something that you disapprove of there is this:

      F15 & Insert:: Send ಠ_ಠ                ; Caps+Insert => Prints ಠ_ಠ


   [0]: https://www.spotify.com
   [1]: https://twitter.com/mattscode
   [2]: http://www.autohotkey.com/
   [3]: http://www.autohotkey.com/docs/Tutorial.htm
   [4]: http://www.autohotkey.com/docs/Hotkeys.htm
   [5]: http://www.autohotkey.com/docs/KeyList.htm
   [6]: http://www.autohotkey.com/docs/commands.htm
   [7]: http://www.randyrants.com/2011/12/sharpkeys_35.html
