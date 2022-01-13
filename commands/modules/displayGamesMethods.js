const { SlashCommandBuilder } = require('@discordjs/builders');
const { Collection, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const embedInfo = require("../../info/embedInfo.json");
const gameInfo  = require("../../info/gameInfo.json");
const setupInfo = require("../../info/setupInfo.json");

//Return a message button object with given parameters
function msgBtn(id, fancyLabel, style) {
	return new MessageButton()
		.setCustomId(id)
		.setLabel(fancyLabel)
		.setStyle(style);
}

function createButtons(offset, len) {
	//Create buttons
	var matrix = new Array(5);
	var rowElems = 5;
	var rowsFilled = 0;

	//Loop as long as there are more games to display
	while(0 < len) {

		//Set rowElems to be between 0 and 5 (inclusive)
		rowElems = (len - 5 < 0 ) ? len : 5;
		var arr = new Array(rowElems);

		//Add buttons to a row
		for(var i = 0; i < rowElems; i++) {
			var game = gameInfo.games[i + (5*rowsFilled) + offset];
			arr[i] = msgBtn(game.id, game.fancyLabel, game.style); // Add up to 5 buttons
		}

		//Append the row
		matrix[rowsFilled++] = new MessageActionRow().addComponents(arr); // Add buttons to row

		//remove the used elements
		len -= rowElems;	
	}

	//shrink matrix if unused rows exist
	matrix.length = rowsFilled;
	return matrix;
};

function createMessageEmbed(title, color, description, image) {
	const messageEmbed = new MessageEmbed();

	if(title)
		messageEmbed.setTitle(title);
	if(color)
		messageEmbed.setColor(color);
	if(description)
		messageEmbed.setDescription(description);
	if(image)
		messageEmbed.setImage(image);

	return messageEmbed;
};

//limit boundary: [0, 100]
async function deleteMessages(channel, limit) {
	console.log(`Deleting ${limit} message(s) in '${channel.name}' (${channel.id})...`);

	if(channel) {
		const messages = await channel.messages.fetch({ limit: limit });	
		if(messages) {
			messages.forEach((message) => {
				message.delete();
			})
		}	
	}
	console.log(`Messages deleted!`)
};

function initialCard(initialEmbed) {
	const initial = createMessageEmbed(
		initialEmbed.title, 
		initialEmbed.color, 
		initialEmbed.subTitle,
		initialEmbed.image);
	return {embeds: [initial]};
}

function gameCard(gameEmbed, index, length) {
	const initial = createMessageEmbed(
		`Displaying games [${index + 1} - ${index + length}]`, 
		gameEmbed.color);
	return {embeds: [initial], components: createButtons(index, length)};
}

async function displayGames(interaction) {
	console.log("Displaying games...");
	let pickGamesChannel = interaction.guild.channels.cache.find(c => 
		c.name == setupInfo.pickGamesChannel.name && 
		c.type == setupInfo.pickGamesChannel.type);

	if(!pickGamesChannel) {
		console.log(`Channel ${setupInfo.pickGamesChannel.name} does not exist, no change was made.`);
		return;
	}

	//Delete previous game choice display
	await deleteMessages(pickGamesChannel, 100);

	//Send initial card embed
	await pickGamesChannel.send(initialCard(embedInfo.initialEmbed));
	
	//Send game card embed(s)
	let games 	  = gameInfo.games.length;
	let offset    = 0;
	let length    = 25;

	while(games - offset > 0) {
		if((games - offset) < 25)
			length = games - offset;

		await pickGamesChannel.send(gameCard(embedInfo.gameEmbed, offset, length));
		offset += 25;
	}
	
	

	console.log("Displayed games!");
};

module.exports = {
	displayGames
};