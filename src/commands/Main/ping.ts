import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

export const data = new SlashCommandBuilder().setName('ping').setDescription('Responds with pong!')
export function execute(interaction: CommandInteraction) {
    return interaction.reply(`Pong! 🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(interaction.client.ws.ping)}ms`)
}