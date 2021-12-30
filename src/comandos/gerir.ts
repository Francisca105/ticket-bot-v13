export const name = 'gerir';
export const description = 'Gere as pessoas de um ticket';
export const options = [
{
    type: 'SUB_COMMAND',
    name: 'add',
    description: 'Adiciona um membro ao ticket.',
    options: [{
        type: 'USER',
        name: 'user',
        description: 'Menciona quem pretendes adicionar ao ticket',
        required: true
    }]
},
{
    type: 'SUB_COMMAND',
    name: 'remove',
    description: 'Remove um membro do ticket.',
    options: [{
        type: 'USER',
        name: 'user',
        description: 'Menciona quem pretendes retirar do ticket',
        required: true
    }]
},
];
export const permissions = [
    {
        id: require('../config.json').ticket.manager_role,
        type: 'ROLE',
        permission: true,
    }
]
export const guild = true

import { Run } from '../interfaces/comando'

import {TicketsModel} from '../models/tickets'


export const run: Run = async (bot, interaction) => {
    let canal = interaction.channel
    let sub = interaction.options._subcommand
    let opt = interaction.options._hoistedOptions

    let Ticket = await TicketsModel.findOne({canal: canal.id, closed: false});
    if(!Ticket) return interaction.reply({content: 'Este canal não é um ticket.', ephemeral: true})
    
    let _u = opt[0]
    let user = _u.value

    switch(sub) {
        case 'add':
            canal.permissionOverwrites.create(user, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true });
            return interaction.reply(`${_u.user.username} foi adicionado ao ticket.`)
            break;
        case 'remove':
            canal.permissionOverwrites.delete(user);
            return interaction.reply(`${_u.user.username} foi removido do ticket.`)
            break;
    }

}
