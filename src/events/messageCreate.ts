import { Message } from "discord.js";

export = {
    name: 'messageCreate',
	async execute(message: Message) {
        if (message.author.id === message.client.user?.id || !message.inGuild() || message.channel.id != '855306892497387541') return

        if (message.content === '!p') message.channel.bulkDelete(10, true)
    }
}