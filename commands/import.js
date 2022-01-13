const { SlashCommandBuilder } = require('@discordjs/builders');
const { addGame } = require("./modules/addGameMethods.js");
const { deleteGame } = require("./modules/deleteGameMethods.js");
const { displayGames } = require('./modules/displayGamesMethods.js');
const setup = require("../info/setupInfo.json");
const importGames = require('../info/importGames.json');
const gameInfo = require('../info/gameInfo.json');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("import")
	  	.setDescription("Create the role and channels in the gameInfo.json file"),
	async execute(interaction) {	
		//Fill the imported file with the games
		await interaction.deferReply().then(() => {

			// Add all new games
			importGames.games.forEach( async (game) => {
				await addGame(interaction, game.fancyLabel, game.label);
			});

			//Write new games to file
			fs.writeFile(setup.importGames.location, JSON.stringify(setup.importGames.content, null, 2), async function writeJSON(err) {
				if (err) 
					return console.error(`Failed to import games | ${err}`);
				
				console.log(`Imported games in '${setup.importGames.location}'`);

				await interaction.followUp(`Imported ${importGames.games.length}, refreshing display in 30 seconds...`);
				await new Promise(resolve => setTimeout(resolve, 30000));
				console.log("Refreshing display...");
				await displayGames(interaction);
			});
		}); 
			
	}
};