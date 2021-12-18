const fs = require('fs');
const { Collection } = require('discord.js');
const info = require('../info.json');
const { clientId, guildId } = require('../config.json');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isButton()) {
			console.log("not a button");
			return;
		} 
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an button. ID: ${interaction.customId}`);
		
		var buttonID = interaction.customId;
		
		
		

		console.log("Command executing... - " + interaction.commandName);
		
		for(var i = 0; i < info.games.length; i++) {
			if(info.games[i].id == buttonID) {
				var fancyLabel = info.games[i].fancyLabel;
				console.log("Button pressed: " + fancyLabel);

				//Remove or add role, depending on if the currently have it or not
				if (interaction.member.roles.cache.some(role => role.name === fancyLabel)) {
					var role = await interaction.guild.roles.cache.find(role => role.name === fancyLabel);
					interaction.member.roles.remove(role);
					await interaction.reply({ content: "Removed the '" + fancyLabel + "' role", ephemeral: true }); // Add rows to columns and 

				} else {
					var role = await interaction.guild.roles.cache.find(role => role.name === fancyLabel);
					interaction.member.roles.add(role);
					await interaction.reply({ content: "Added the '" + fancyLabel + "' role", ephemeral: true }); // Add rows to columns and 
				}

			}
		}
		//Check if user has role
		//add role to user if they don't have role
		//var guild = bot.guilds.cache.get('907259574342537236')
		//let role = await message.guild.roles.cache.find(role => role.name === )
		
		//message.member.roles.add(role)
		
		console.log("Command completed!   - " + interaction.commandName);
		
	
	}
};