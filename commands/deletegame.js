const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const info = require("../info.json");
const { v4:uuidv4 } = require ('uuid');
console.log(info);

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("deletegame")
	  	.setDescription("List all games and pick roles(channels)")
	  	.addStringOption(option =>
			option
		  		.setName("title")
		  		.setDescription("Enter the title of a game to")
		  		.setRequired(true)
	  	),
	async execute(interaction) {
		console.log(interaction.options);
		console.log(interaction.options.getString("title"));
		
		const title = interaction.options.getString("title");
		
		var removals = 0;
		for(var i = 0; i < info.games.length; i++) {
			if(info.games[i].label == title) {
				info.games.splice(i, 1);
				removals++;
			}
		}

		if(removals > 0) {
			return await interaction.reply("Pong: Removal of (" + removals + ") item(s) matching the title '" + title + "' completed"); 
		}

		await interaction.reply("Pong: No removal(s) were made due to no match found for the title '" + title + "'");
	}
};