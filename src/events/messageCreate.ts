import { Message } from "discord.js";
import spamFilter from "../scripts/spam-filter";

const spamMap = new Map()

export = {
    name: 'messageCreate',
	async execute(message: Message) {
        if (message.author.id === message.client.user?.id || !message.inGuild() || message.channel.id != '855306892497387541') return
        // await spamFilter.execute(message)
        if (message.content === '!p') message.channel.bulkDelete(10, true)

        // check is spamMap has userID
        if (spamMap.has(message.author.id)) {
            // get the user from the map
            const user = spamMap.get(message.author.id)
            const { lastMessage, timer } = user;
            let msgCount = user.counter;

            // get difference of both messages (map and runtime)
            const timeDiff =  message.createdTimestamp - lastMessage.createdTimestamp
            
            if (timeDiff > 2000) {
                clearTimeout(timer);

                ++msgCount

                spamMap.set(message.author.id, {
                    lastMessage: message,
                    counter: msgCount,
                    timer: timer,
                    allMessage: {...lastMessage, new: message}

                })

                message.channel.bulkDelete(msgCount).catch(() => {return})
                return message.client.channels.cache.get(message.channel.id)?.send('Warning: Spamming in this channel is forbidden.');              
            }
        }

        else {
            // insert stuff into the map: message, count, timer
            const timer = setTimeout(() => spamMap.delete(message.author.id), 3000);
            spamMap.set(message.author.id, {
                lastMessage: message,
                counter: 1,
                timer: timer
            });
        }         
    }
}

