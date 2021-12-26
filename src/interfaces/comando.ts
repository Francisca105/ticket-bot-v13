import {bot} from '../index'
import {CommandInteraction} from 'discord.js'

export interface Run {
    (client: bot, interaction: CommandInteraction): Promise<void>
}

export interface Comando {
    name: string,
    description: string,
    options: Array<any>,
    permissions: Array<string | void>,
    guild: boolean,
    run: Run
}