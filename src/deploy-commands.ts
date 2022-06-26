import { REST }  from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import config  from './config';
const fs = require('fs');

const rest = new REST({ version: '9' }).setToken(config.TOKEN);


const commands:string[] = [];

// Place your client and guild ids here
const clientId = config.CLIENT_ID;
const guildId = config.GUILD_ID;

fs.readdirSync(__dirname + '/commands').forEach((dir: string) => {
	if (fs.statSync(__dirname + `/commands/${dir}`).isDirectory()) {
		const commandFiles = fs.readdirSync(__dirname + `/commands/${dir}`).filter((file: string) => file.endsWith('.js'));
		for (const commandFile of commandFiles) {
			const command = require(__dirname + `/commands/${dir}/${commandFile}`);
			commands.push(command.data.toJSON());
		}
	}
});

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Registered all application commands successfully'))
	.catch(console.error);