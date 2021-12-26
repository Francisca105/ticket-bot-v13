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


export const run: Run = async (bot, interaction) => {

}