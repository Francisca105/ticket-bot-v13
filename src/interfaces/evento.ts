import {bot} from '../index'

export interface Run {
    (client: bot, ...args: any[]): Promise<void>
}

export interface Evento {
    name: string,
    run: Run
}