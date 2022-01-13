const fs = require('fs');
const gameInfoLocation = 'info/gameInfo.json';
const gameInfo = require('../../' + gameInfoLocation);

async function find(interaction, fancyTitle, title) {
	const roleCache = interaction.guild.roles.cache;
	const channelCache = interaction.guild.channels.cache;

	const role     = await roleCache.find(x => x.name == fancyTitle);
	const category = await channelCache.find(x => (x.name == fancyTitle && x.type == "GUILD_CATEGORY"));
	const text     = await channelCache.find(x => (x.name == title && x.type == "GUILD_TEXT"));
	const voice    = await channelCache.find(x => (x.name == title && x.type == "GUILD_VOICE"));

	return {
		role: role, 
		category: category, 
		text: text, 
		voice: voice
	};
};

function deleteRoleOrChannel(roleOrChannel) {
	console.log(`Deleting '${roleOrChannel.name}'...`)

	if(roleOrChannel) {
		roleOrChannel.delete();
		return console.log(`Deleted '${roleOrChannel.name}'.`);
	}

	console.log(`No role or channel matching '${roleOrChannel.name}'`);
};

//https://stackoverflow.com/questions/2116558/fastest-method-to-replace-all-instances-of-a-character-in-a-string/2116614
// - qwerty (Edited by Colorfully Monochrome)
String.prototype.replaceAll = function(str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

function writeToJson(deletions, total) {
	console.log(`Deleting (${deletions}/${total}) games...`);

	//Write .json change to file
	fs.writeFile(gameInfoLocation, JSON.stringify(gameInfo, null, 2), function writeJSON(err) {
		if (err) {
			console.error(`Failed to write deletion to file.`);
			return false;
		}
		console.log(`Deleted (${deletions}/${total}) games.`);
		return true;
	});
};

async function deleteGame(interaction, fancyTitle, title) {
	const {role, category, text, voice} = await find(interaction, fancyTitle, title);

	for(let i = 0; i < gameInfo.games.length; i++) {
		if(gameInfo.games[i].label == title) {

			if(role)
				deleteRoleOrChannel(role);
			
			if(category)
				deleteRoleOrChannel(category);
			
			if(text)
				deleteRoleOrChannel(text);
			
			if(voice)
				deleteRoleOrChannel(voice);
			
			gameInfo.games.splice(i, 1);
			return {deleted: true, fancyTitle};

		}
	}

	return {deleted: true, fancyTitle};
};

function logArray(arr, prefix) {
	arr.forEach( (elem) => {
		console.log(`${prefix} '${elem.fancyTitle}'`);
	});
};

module.exports = {find, deleteRoleOrChannel, writeToJson, deleteGame, gameInfo, logArray};