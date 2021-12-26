import { Run } from '../interfaces/evento'
import discord, { CommandInteraction } from 'discord.js'

export const name: string = 'interactionCreate';
export const run: Run = async (bot, interaction: CommandInteraction) => {
    if (!interaction.isCommand()) return;
    let cmd_name = interaction.commandName

    let cmd = bot.comandos.get(cmd_name)

    if(cmd) {
        cmd.run(bot, interaction)
    }
}