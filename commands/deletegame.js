const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteGame, logArray, writeToJson } = require("./modules/deleteGameMethods");
const { displayGames } = require('./modules/displayGamesMethods.js');

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("deletegame")
	  	.setDescription("Remove a game (Use the name of the role or the button text in /displaygames)")
	  	.addStringOption(option =>
			option
		  		.setName("title")
		  		.setDescription("Enter the title of a game to delete")
		  		.setRequired(true)
	  	),
	async execute(interaction) {
		const fancyTitle = interaction.options.getString("title");
		const title = fancyTitle.replaceAll(' ', '-').toLowerCase();
		
		const result = await deleteGame(interaction, fancyTitle, title);


		if(result.deleted) {
			writeToJson(1, 1);
			displayGames(interaction);
			logArray([result], "Deleted game");
			return await interaction.reply(`Deleted the game '${title}'.`);
		}

		writeToJson(0, 1);
		logArray([result], "Non-deleted game");
		await interaction.reply(`No game matching '${title}', no deletion was made.`);
	}
};