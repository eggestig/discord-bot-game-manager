const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const info = require("../info.json");

console.log(info);

module.exports = {
	data: new SlashCommandBuilder()
	  	.setName("displaygames")
	  	.setDescription("List all games and pick roles(channels)"),
	async execute(interaction) {
		function msgBtn(id, label, style) {
			return new MessageButton()
				.setCustomId(id)
				.setLabel(label)
				.setStyle(style);
		}

		//Base card embed
		const base = new MessageEmbed()
		.setTitle(info.gameEmbed.title)
		.setColor(0xffd1dc)
		.setDescription(info.gameEmbed.subTitle)
		.setImage(info.gameEmbed.image);

		//Create buttons
		var matrix = new Array(5);
		var len = info.games.length;
		var rowElems = 5;
		var rowsFilled = 0;
		var debug_iterator = 0;

		while(0 < len) {
			rowElems = (len - 5 < 0 ) ? len : 5;
			console.log("loop 0");
			var arr = new Array(rowElems);

			for(var i = 0; i < rowElems; i++) {
				debug_iterator++
				console.log(i + " " + rowElems);
				var game = info.games[i + (5*rowsFilled)];
				arr[i] = msgBtn(game.id, game.label, game.style); // Add up to 5 buttons
			}
			matrix[rowsFilled++] = new MessageActionRow().addComponents(arr); // Add buttons to row
			len -= rowElems;	
		}
		matrix.length = rowsFilled;

		await interaction.reply({ embeds: [base], components: matrix }); // Add rows to columns and 
	  
		
	}
};