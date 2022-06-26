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



client.once('ready', () => {
    console.log('Logged in as ' + client.user?.tag + '\nVersion: ' + client.version)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return console.log(interaction.client.commands);

    try {
        await command.execute(interaction)
    }
    catch {
        console.error;
    }
});

client.login(config.TOKEN)