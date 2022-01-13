const { SlashCommandBuilder } = require('@discordjs/builders');
const { addGame } = require("./modules/addGameMethods.js");
const { displayGames } = require('./modules/displayGamesMethods.js');

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("addgame")
	  	.setDescription("Add a game")
	  	.addStringOption(option =>
			option
		  		.setName("title")
		  		.setDescription("Enter the title of a game to add")
		  		.setRequired(true)
	  	),
	async execute(interaction) {	
		const fancyTitle = interaction.options.getString("title"); // League of Legends
		const title = fancyTitle.replaceAll(' ', '-').toLowerCase(); // league-of-legends

		const added = await addGame(interaction, fancyTitle, title);

		if(added) {
			displayGames(interaction);
			return await interaction.reply(`Added game '${fancyTitle}'.`);
		}
			
		await interaction.reply(`Could not add game '${fancyTitle}', probably already added`);
	}
};