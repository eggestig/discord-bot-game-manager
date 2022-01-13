const { SlashCommandBuilder } = require('@discordjs/builders');
const { displayGames } = require('./modules/displayGamesMethods.js');

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("refresh")
	  	.setDescription("Refresh the display of games."),
	async execute(interaction) {
		displayGames(interaction);	
		await interaction.reply("Refreshed display!");
	}
};