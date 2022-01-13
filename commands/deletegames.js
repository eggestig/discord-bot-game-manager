const { SlashCommandBuilder } = require('@discordjs/builders');
const { deleteGames, logArray, writeToJson } = require('./modules/deleteGamesMethods');
const { displayGames } = require('./modules/displayGamesMethods.js');

module.exports = {
	data: new SlashCommandBuilder()
	    .setName("deletegames")
	    .setDescription("Remove all games after [index] and up to [length]. default is 0 and total games respectively")
	    .addStringOption(option =>
		    option
		        .setName("index")
		        .setDescription("[Optional] Remove only on and after given index.")
		        .setRequired(false),
        )
        .addStringOption(option =>
		    option
		        .setName("length")
		        .setDescription("[Optional] Remove only up to given length.")
		        .setRequired(false),
        ),
    async execute(interaction) {
        const uncleanIndex  = interaction.options.getString("index");
        const uncleanLength = interaction.options.getString("length");

        const result = await deleteGames(interaction, {uncleanIndex: uncleanIndex, uncleanLength: uncleanLength});
        
        writeToJson(result.deletedGames.length, result.deletedGames.length + result.nonDeletedGames.length);
		displayGames(interaction);

		logArray(result.deletedGames, "Deleted game");
		logArray(result.nonDeletedGames, "Non-deleted game");
		
        await interaction.reply(`Removed ${result.deletedGames.length}/${result.deletedGames.length + result.nonDeletedGames.length} game(s).`);      
    }
};