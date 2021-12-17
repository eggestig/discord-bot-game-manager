const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const info = require("../info.json");
const { v4:uuidv4 } = require ('uuid');
console.log(info);

module.exports = {
	data: new SlashCommandBuilder()
	    .setName("deletegames")
	    .setDescription("Remove all games. [Optional]: 'index' and 'length' for more control")
	    .addStringOption(option =>
		    option
		        .setName("index")
		        .setDescription("[Optional] Remove only on and after given index. (If not valid, set to 0)")
		        .setRequired(false),
        )
        .addStringOption(option =>
		    option
		        .setName("length")
		        .setDescription("[Optional] Remove only up to given length. (If not valid, set to amount of games currently listed)")
		        .setRequired(false),
        ),
	    async execute(interaction) {

        // https://stackoverflow.com/questions/37271445/convert-string-to-number-node-js
        // - tejp124
        function cleanInt(x) {
            x = Number(x);
            return x >= 0 ? Math.floor(x) : Math.ceil(x);
        }
        var index = 0;
        var length = 0;

        //Check that both inputs are not null and are integers between 0 and not leading to out-of-bounds issues
        index = cleanInt(interaction.options.getString("index"));
        if(!(index != null && index > 0 && index <= info.games.length))
            index = 0;

        length = cleanInt(interaction.options.getString("length"));
        if(!(length != null && length > 0 && index + length <= info.games.length))
            length = info.games.length - index;

        info.games.splice(index, length);
		
        console.log(index + " " + length);

		if(length > 0) {
			return await interaction.reply("Pong: Removal of (" + length + ") item(s) starting at index '" + index + "' completed"); 
		}

		await interaction.reply("Pong: No removal(s) were made from given arugments, or there are no more games to delete");
	}
};