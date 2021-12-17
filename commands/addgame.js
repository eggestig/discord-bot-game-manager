const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const info = require("../info.json");
const { v4:uuidv4 } = require ('uuid');
console.log(info);

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("addgame")
	  	.setDescription("List all games and pick roles(channels)")
	  	.addStringOption(option =>
			option
		  		.setName("title")
		  		.setDescription("Enter the title of a game")
		  		.setRequired(true)
	  	),
	async execute(interaction) {
		console.log(interaction.options);
		console.log(interaction.options.getString("title"));
		
		const title = interaction.options.getString("title");
		
		if(info.games.length >= 25)
			return await interaction.reply("Pong: Max games allotted, remove one to add a new one"); 
		
		const game = {
			"id": uuidv4(),
			"label": title,
			"style": "SECONDARY"
		};
		info.games.push(game);
		await interaction.reply("Pong: New game added: " + title);
	}
};