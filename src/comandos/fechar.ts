import {TicketsModel} from '../models/tickets'
import {ticket} from '../config.json'

export const name = 'fechar';
export const description = 'Fecha um ticket';
export const options = [];

export const permissions = []
export const guild = true

import { Run } from '../interfaces/comando'


export const run: Run = async (bot, interaction) => {
    const fs = require('fs')
    const moment = require('moment')

    let check = await TicketsModel.find({canal: interaction.channel.id, closed: false});
    if(check.length == 0) return interaction.reply({content: 'Este canal não é um ticket!', ephemeral: true})
    
    check[0].closed = true
    await check[0].save()

    let array = []
    
    let c = interaction.channel
    let fetch = await c.messages.fetch({ limit: 100 })
    fetch.map(async msg => {
        if(msg.content.length == 0 ) return;
        array.push({
            "content": msg.content,
            "author": msg.author.id,
            "time": msg.createdTimestamp
        })
    })

    array.reverse()

    const resultado = []

    array.map(elemento => {
        let time = elemento.time,
            autor = elemento.author,
            content = elemento.content
    
        resultado.push(`[ ${moment(time).format('l')} às ${moment(time).format('LTS')} : ${autor} ] -> ${content}`)
    })

    let conteudo = resultado.join('<br>\n')

    let txt_nome = c.name

    fs.writeFile(`./src/tickets/${txt_nome}.html`, conteudo, function (err) {
        if (err) throw err;
    });

    bot.channels.cache.get(ticket.logs).send({
        files: [{
          attachment: `./src/tickets/${txt_nome}.html`,
          name: `${txt_nome}.html`
        }]
    })

    c.delete()

}