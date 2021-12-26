import {TicketsModel} from '../models/tickets'

import { Run } from '../interfaces/evento'

import {ticket, guild} from '../config.json'
import discord, { CommandInteraction, GuildApplicationCommandManager, MessageActionRow, MessageButton, Permissions } from 'discord.js'

export const name: string = 'interactionCreate';
export const run: Run = async (bot, interaction: CommandInteraction) => {
    if (!interaction.isButton()) return;
    if(interaction.customId !== 'ticket') return 

    let abertos = await TicketsModel.find({user: interaction.user.id, closed: false});

    if(abertos.length > 0) return interaction.reply({content: 'Já tens um ticket aberto!', ephemeral: true})

    let id = Math.floor(Math.random() * 5000 + 1)

    let canal = await interaction.guild.channels.create(`ticket-${id}`, {
        parent: ticket.categoria,
        permissionOverwrites: [
            {
                id: guild,
                deny: Permissions.ALL
            },
            {
                id: interaction.user.id,
                deny: Permissions.DEFAULT
            }
        ]
    })

    const dados = new TicketsModel({
        id,
        user: interaction.user.id,
        canal: canal.id
    });

    await dados.save();  

    interaction.reply({
        content: `Ticket ${canal} criado`,
        ephemeral: true
    })

    interface Form {
        q:string,
        a: Array<string>
    }

    let form = ticket.questions
    let respostas = []

    let G_msg = await canal.send({
        embeds: [
            bot.embed()
            .setDescription(`Vamos começar as perguntas...`)
        ]
    })

    QA(0)
    
    function QA (i:number ) {
        let buttons = []

        form[i].a.forEach((e, i) => {
            return buttons.push(new MessageButton()
            .setLabel(e)
            .setStyle('PRIMARY')        
            .setCustomId(String(i)))
        })

        const row = new MessageActionRow()
                .addComponents(
                    buttons
                );


        G_msg.edit({
            embeds: [
                bot.embed()
                .setDescription(form[i].q)
            ], components: [row]
        })

        

        G_msg.createMessageComponentCollector({filter: m=> {return m.user.id === interaction.user.id}, componentType: 'BUTTON', max: 1 })
        .on('collect', c => {
            c.deferReply({ ephemeral: true });

            if (c.user.id !== interaction.user.id) return;
            let id = c.customId
            console.log(`**${form[i].q}**\n> ${form[i].a[Number(id)]}`)
            respostas.push(`**${form[i].q}**\n> ${form[i].a[Number(id)]}`)


            if((form.length-1) === i) {
                console.log(respostas)
            return G_msg.edit({
                embeds: [
                    bot.embed()
                    .setDescription(respostas.join('\n'))
                ], components: []
            })
        }

            i++
            return QA(i)
        });

    }
}