import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays all commands!')
    .addStringOption(option => option
        .setName('command')
        .setDescription('What command???'))
export async function execute(interaction: CommandInteraction) {
    const embed = new MessageEmbed()
    .setTitle('Help')
    .setColor('WHITE')
    .setFields(interaction.client.help)
    

    return await interaction.reply({ embeds: [embed] })
}