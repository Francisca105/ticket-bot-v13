import { Run } from '../interfaces/evento'

import {ticket} from '../config.json'
import {TicketsModel} from '../models/tickets'

export const name: string = 'messageCreate';
export const run: Run = async (bot, message) => {
    let canal = message.channelId

    if(!message.member.roles.cache.get(ticket.manager_role)) return;

    let Ticket = await TicketsModel.findOne({canal, closed: false});
    if(!Ticket) return;

    setTimeout(async () => {
        let last = await message.channel.messages.fetch({ limit: 1 })
        let msg = last.first()
        if(!msg.member.roles.cache.get(ticket.manager_role)) return;
        msg.channel.send(`<@${Ticket.user}>`).then(m => {
            if(m.deletable) return m.delete()
        })
    }, 5 * 60 * 1000)
}