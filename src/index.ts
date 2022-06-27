import discord from "discord.js";
import config from "./config"
import fs from 'node:fs'

const client = new discord.Client({
	ws: { properties: { browser: 'Discord iOS' } },
	intents: [
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_MESSAGES,
		discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		discord.Intents.FLAGS.GUILD_MEMBERS,
		discord.Intents.FLAGS.DIRECT_MESSAGES,
		discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	],
});
declare module "discord.js" {
    export interface Client {
      commands: discord.Collection<unknown, any>,
      description: string,
      version: string,
      help: Array<{name: string, value: string}>
    }
}

client.description = 'A growing discord bot which provides inter-server chat!';
client.commands = new discord.Collection();
client.version = require('../package.json').version;
client.help = [];

export {discord, client}

fs.readdirSync(__dirname + '/commands').forEach((dir) => {  
	if (fs.statSync(__dirname + `/commands/${dir}`).isDirectory()) {
		const commandFiles = fs.readdirSync(__dirname + `/commands/${dir}`).filter(file => file.endsWith('.js'));
		for (const commandFile of commandFiles) {
			
			const command = require(__dirname + `/commands/${dir}/${commandFile}`);			

			client.commands.set(command.data.name, command);
		}

		if (dir === 'private' || dir === 'Testing') return;


		const cmds = commandFiles.map((command) => {
			const file = (require(__dirname + `/commands/${dir}/${command}`));
			if (!file.data.name) return 'No name';

			const name = file.data.name.replace('.ts', '');

			return `\`${name}\``;
		});
		const data = {
			name: dir,
			value: cmds.length === 0 ? 'No commands' : cmds.join(', '),
		};
		client.help.push(data);
	}
});


const eventFiles = fs.readdirSync(__dirname + '/events').filter((file) => file.endsWith('.js'));

for (const eventFile of eventFiles) {
	const event = require(__dirname + `/events/${eventFile}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(config.TOKEN)