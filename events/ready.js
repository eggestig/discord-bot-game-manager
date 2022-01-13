const setupInfo = require("../info/setupInfo.json");
const config    = require("../info/config.json");

async function setupCategory(guild) {
	let categoryId;
	let category = guild.channels.cache.find(c => 
		c.name == setupInfo.gameCategory.name && 
		c.type == setupInfo.gameCategory.type);
		
	if(category) {
		categoryId = category.id;
		console.log(`${setupInfo.gameCategory.name} already created`);
	} else {
		console.log("Creating category: '" + setupInfo.gameCategory.name + "'...");

		//Make category
		await guild.channels.create(setupInfo.gameCategory.name, {
			type: setupInfo.gameCategory.type
		}).catch((error) => {
			console.error(error);
		}).then((res) => {
			console.log("Category created. ID: " + res.id);
			categoryId = res.id;
		});
	}
	return categoryId;
};

async function setupGameChannel(guild, categoryId) {
	let pickChannel = guild.channels.cache.find(c => 
		c.name   == setupInfo.pickGamesChannel.name && 
		c.type   == setupInfo.pickGamesChannel.type &&
		c.parent == categoryId);

	if(pickChannel) {
		console.log(`${setupInfo.pickGamesChannel.name} already created and has the correct parent/category`);
	} else {
		console.log("Creating channel: '" + setupInfo.pickGamesChannel.name + "'...");

		//Make channel
		await guild.channels.create(setupInfo.pickGamesChannel.name, {
			type: setupInfo.pickGamesChannel.type,
			parent: categoryId,
			permissionOverwrites: [
			{
				'id': config.guildId, 
				'deny': ['SEND_MESSAGES']
			},
			{
				'id': guild.me._roles[0], 
				'allow': ['SEND_MESSAGES']
			}
		]
		}).catch((error) => {
			console.error(error);
		}).then((res) => {
			console.log("Channel created. ID: " + res.id);
		});
	}
};

async function setupBotChannel(guild, categoryId) {
	let botChannel = guild.channels.cache.find(c => 
		c.name   == setupInfo.botCommandsChannel.name && 
		c.type   == setupInfo.botCommandsChannel.type &&
		c.parent == categoryId);

	if(botChannel) {
		console.log(`${setupInfo.botCommandsChannel.name} already created and has the correct parent/category`);
	} else {
		console.log("Creating channel: '" + setupInfo.botCommandsChannel.name + "'...");

		//Make channel
		await guild.channels.create(setupInfo.botCommandsChannel.name, {
			type: setupInfo.botCommandsChannel.type,
			parent: categoryId
		}).catch((error) => {
			console.error(error);
		}).then((res) => {
			console.log("Channel created. ID: " + res.id);
		});
	}
};


async function setup(client) {
	console.log("Setting up...\n");

	const guild = await client.guilds.cache.get(config.guildId);
	if(!guild) 
		console.error("Please restart the bot, guild was not found from the ID: " + config.guildId);

	const categoryId = await setupCategory(guild);
	await setupGameChannel(guild, categoryId);
	await setupBotChannel(guild, categoryId);

	//Setup complete
	console.log(`Setup complete!\n`);
	
	//Bot is ready to use
	console.log(`Ready! Logged in as ${client.user.tag}\n`);
}
module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		setup(client);		
	}
};