# Documentation
Here is the documentation for ``discord-tts-bot``. A text-to-speech bot for Discord, written in NodeJS.

## Configuration
To configure the bot, you must first run the command ``node index`` once.

When you do this, a file is generated in the directory the code is in. You then must configure the bot.

If you already added your token, you can skip down to [here](#further-customization).

There is *one* thing you must fill in yourself, and the code does the rest for you. If you have not already go to [discord.com/developers/applications](https://discord.com/developers/applications) and create an app by hitting "New Application" at the top once you sign in.

![Here is where you find "New Application", where the cursor is](/docs/assets/new_app.png)

When you do this, you must also make the app a bot, you do this by going into "Bot" on the sidebar.

![Bot, pictured where the cursor is](/docs/assets/bot.png)

Click "Add Bot".

!["Add Bot"](/docs/assets/add_bot.png)

And confirm your choice with "Yes, do it!".

!["Yes, do it!"](/docs/assets/do_it.png)

Copy the Token by the username and profile picture, you can customize these later, by the way.

![Copy the token by the username and profile picture](/docs/assets/token.png)

And paste the token in between the quotes after ``{"token":``

![Put the token where the cursor is](/docs/assets/paste.png)

### Further Customization

To customize your bot further here are some definitions of the other variables.

```json
{
    "token":"",
    "id":"",
    "prefix":"t!",
    "autoTranslate":"false",
    "defaultLang":"en"
}
```

*The default config file, better stylized.*

``token`` - Your bot's token, do not share this with anybody. Nobody who is helping you would ask for it.

``id`` - The ID of your bot, this is automatically retrieved after your first run with the token in. This is required for the *invite* command and will help you along the process.

``prefix`` - This is what you put before the bot commands. For example if prefix would be set to ``"!"`` then the command to ping the bot would be ``!ping``.

``autoTranslate`` - The default option of automatically translating a message to the ``defaultLang`` variable (Must be ``"true"`` or ``"false"``).

``defaultLang`` - The default language of the TTS bot and for the ``autoTranslate`` variable. (Must be a valid language code surrounded by quotes, like ``"en"``)

**Note** - The ``autoTranslate`` and ``defaultLang`` variables can be set on a server by server basis using commands. You can change this yourself by editing the ``db.json`` file in your code, but it is reccomended to use server commands.

## Commands
Here is a list of commands for the bot. The default prefix for the bot is ``t!`` but this can be changed in the [configuration](#configuration).

``t!ping`` - A simple ping command to see if the bot is on.

``t!setChannelId <text channel id>`` - Setting the text channel ID that generates a MP3 file everytime a message is sent in there.

``t!languages`` - A list off all of the possible languages that can be used for the bot.

``t!setLanguage <language name/code>`` - Set the language for the server's commands.

``t!setTranslation <true|false>`` - Sets the auto-translation setting.

``t!info`` - Outputs a little blurb about the bot

``t!commands`` - Brings you here.