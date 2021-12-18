const fs = require('fs');
const { Collection } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		interaction.client.commands = new Collection();
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			interaction.client.commands.set(command.data.name, command);
		}

		if (!interaction.isCommand()) return;
		
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a slash command. `);
		console.log("Command executing... - " + interaction.commandName);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		console.log("Command completed!   - " + interaction.commandName);
	
	}
};