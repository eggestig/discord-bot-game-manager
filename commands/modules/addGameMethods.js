const { v4:uuidv4 } = require ('uuid');
const config = require('../../info/config.json');
const fs = require('fs');
const gameInfoLocation = 'info/gameInfo.json';
const gameInfo = require('../../' + gameInfoLocation);

async function createGameRole(interaction, name, color) {
	console.log(`Creating game role '${name}'...`);

	let role;
	await interaction.guild.roles.create({
		name: name,		
		permissions: [],
		color: color, //"BLUE"
		reason: "New game added."
	}).catch((error) => {
		console.error(error);
	}).then((res) => {
		console.log(`Game role '${name}' (${res.id}) created.`);
		role = res;
	});

	return role;
};

async function createGameCategory(interaction, name, roleId) {
	console.log(`Creating game category '${name}'...`);

	let category;
	await interaction.guild.channels.create(name, {
		type: 'GUILD_CATEGORY',
		permissionsOverwrites: [
			{
				'id': config.guildId, 
				'deny': ['CREATE_INSTANT_INVITE', 'VIEW_CHANNEL']
			},
			{
				'id': roleId, 
				'allow': ['VIEW_CHANNEL']
			},
			{
				'id': interaction.guild.me._roles[0], 
				'allow': ['VIEW_CHANNEL', 'MANAGE_CHANNELS']
			}
		]
	}).catch((error) => {
		console.error(error);
	}).then((res) => {
		console.log(`Game category '${name}' (${res.id}) created.`);
		category = res;
	});

	return category;
};

async function createGameVoiceChannel(interaction, name, roleId, parent) {
	console.log(`Creating game voice channel '${name}'...`);

	let voiceChannel;
	await interaction.guild.channels.create(name, {
		type: "GUILD_VOICE",
		permissionOverwrites: [
			{
				'id': config.guildId, 
				'deny': ['CREATE_INSTANT_INVITE', 'VIEW_CHANNEL', 'CONNECT']
			},
			{
				'id': roleId, 
				'allow': ['VIEW_CHANNEL', 'CONNECT']
			},
			{
				'id': interaction.guild.me._roles[0], 
				'allow': ['VIEW_CHANNEL', 'MANAGE_CHANNELS', 'CONNECT']
			}
		],
		"parent": parent
	}).catch((error) => {
		console.error(error);
	}).then((res) => {
		console.log(`Game voice channel '${name}' (${res.id}) created.`);
		voiceChannel = res;
	});

	return voiceChannel;
};

async function createGameTextChannel(interaction, name, roleId, parent) {
	console.log(`Creating game text channel '${name}'...`);

	let textChannel;
	await interaction.guild.channels.create(name, {
		"type": "GUILD_TEXT",
		"permissionOverwrites": [
			{
				'id': config.guildId, 
				'deny': ['CREATE_INSTANT_INVITE', 'VIEW_CHANNEL']
			},
			{
				'id': roleId, 
				'allow': ['VIEW_CHANNEL']
			},
			{
				'id': interaction.guild.me._roles[0], 
				'allow': ['VIEW_CHANNEL', 'MANAGE_CHANNELS']
			}
		],
		"parent": parent

	}).catch((error) => {
		console.error(error);
	}).then((res) => {
		console.log(`Game text channel '${name}' (${res.id}) created.`);
		textChannel = res;
	});

	return textChannel;
};

function writeToJson(title, fancyTitle, roleId, parentId, textId, voiceId) {
	console.log(`Writing new game '${fancyTitle}' (${parentId}) '${gameInfoLocation}'...`);

	gameInfo.games.push({
		"id": uuidv4(),
		"label": title,
		"fancyLabel": fancyTitle,
		"style": "SECONDARY",	
		"roleId": roleId,
		"parent": parentId,
		"textChannelId": textId,
		"voiceChannelId": voiceId
	});


	//Write .json change to file
	fs.writeFile(gameInfoLocation, JSON.stringify(gameInfo, null, 2), function writeJSON(err) {
		if (err) 
			return console.error(`Failed to write new game '${fancyTitle}' (${parentId}) in '${gameInfoLocation}' & Error: ${err}`);
		
		console.log(`Written new game '${fancyTitle}' (${parentId}) in '${gameInfoLocation}'`);
	});
};

//https://stackoverflow.com/questions/2116558/fastest-method-to-replace-all-instances-of-a-character-in-a-string/2116614
// - qwerty (Edited by Colorfully Monochrome)
String.prototype.replaceAll = function(str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

async function find(interaction, fancyTitle, title) {
	const roleCache = interaction.guild.roles.cache;
	const channelCache = interaction.guild.channels.cache;

	const role     = await roleCache.find(x => x.name == fancyTitle);
	const category = await channelCache.find(x => (x.name == title && x.type == "GUILD_CATEGORY"));
	const text     = await channelCache.find(x => (x.name == title && x.type == "GUILD_TEXT"));
	const voice    = await channelCache.find(x => (x.name == title && x.type == "GUILD_VOICE"));

	return {
		role: role, 
		category: category, 
		text: text, 
		voice: voice
	};
};

async function create(interaction, fancyTitle, title) {
	const createdRole     = await createGameRole(interaction, fancyTitle, "BLUE");
	const createdCategory = await createGameCategory(interaction, fancyTitle, createdRole.id);
	const createdText     = await createGameTextChannel(interaction, title, createdRole.id, createdCategory.id); 
	const createdVoice    = await createGameVoiceChannel(interaction, title, createdRole.id, createdCategory.id);

	return {createdRole, createdCategory, createdText, createdVoice};
};

async function addGame(interaction, fancyTitle, title) {

	//Get ID if the role/channel exists
	const {role, category, text, voice} = await find(interaction, fancyTitle, title);

	//Create role/channels if none of them already exists
	if(!role && !category && !text && !voice) {

		const {
			createdRole, 
			createdCategory, 
			createdText, 
			createdVoice
		} = await create(interaction, fancyTitle, title);
			
		if(!createdRole || !createdCategory || !createdText || !createdVoice) 
			return console.error("No game added: One of role/channels failed to be created.");

		//Add game to the array of games in the .json
		writeToJson(title, fancyTitle, createdRole.id, createdCategory.id, createdText.id, createdVoice.id);

		return true; 
	}
	return false; 
};

module.exports = {
	addGame
}