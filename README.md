# Discord Bot - Game-manager

A very, **very** simple and bareback bot for creating channels (text and voice) for individual games and assigning (or unassigning) yourself to them via roles by pressing buttons.

## Commands
The bot currently covers (5) commands. (Parameter types: `[REQUIRED]` and `[optional]`):
* `/import` - Add all roles, categories/text/voice channels, and overwrites the current `info/gameInfo.json` with the games in `info/importGames.json`.
* `/refresh` - Refreshes the `#pick-games` display with games in case changes were made to the games and aren't displaying correctly. 
* `/addgame [TITLE]` - Add a game (up to 25 games are currently supported).
* `/deletegame [TITLE]` - Remove a game (Use the name of the role or the button text in /displaygames).
* `/delete game [index] [length]` - Remove all games after `[index]` and up to `[length]`. If no parameters are given: `[index] = 0` & `[length] = info.games.length` (where info.games is where all the games are stored).

## Events
The bot currently covers (1) event (disregarding the command and ready event)
* `buttonClick` - When a button is clicked in the server.


## Setup
Since you want the bot running on your own server, you need to complete a few tasks beforehand.

1. You need to install nodejs and all the requiring modules (I don't know exactly which ones you need to manually install, haven't tried this on a fresh install)
2. You need to run `node firstRuns.js` to create the `info/config.json` and `info/gameInfo.json`.
3. Fill the `info/config.json` with your config values:
```
{
    "token": "",
    "clientId": "",
    "guildId": ""
}
```
You can find your guild ID by just rightclicking your server and copying the ID. The token ID and client ID respectively can be found in your discord developer dashboard as followed:  
<img src="https://raw.githubusercontent.com/eggestig/discord-bot-game-manager/main/tokenID.png"
     alt="Discord developer dashboard, green arrow pointing towards the token ID">  
  
<img src="https://raw.githubusercontent.com/eggestig/discord-bot-game-manager/main/applicationID.png"
     alt="Discord developer dashboard, green arrow pointing towards the application ID">  
  
3. You may also need to change your bot's permissions, the ones that I currently use are the following:
<img src="https://raw.githubusercontent.com/eggestig/discord-bot-game-manager/main/permissions.PNG"
     alt="Discord developer dashboard, permissions">  
  
4. To run the bot, you just have to type the command `node index.js`.
