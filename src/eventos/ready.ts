import {MessageActionRow, MessageButton} from 'discord.js'

import { Run } from '../interfaces/evento'

import * as Configs from '../config.json'
const fs = require('fs')

export const name: string = 'ready';
export const run: Run = async (bot) => {
    console.log(`${bot.user.username} (${bot.user.id}) está agora online.`)
    console.log(`\n\x1b[4mInvite link:\x1b[0m\n${Configs.bot.link.replace('{{BOT_ID}}', bot.user.id)}\n`)

    bot.user.setActivity(Configs.bot.status)

    let guild = bot.guilds.cache.get(Configs.guild)

    fs.readdir("./src/comandos/", (err, files) => {
        if (err) console.error(err);

        let tsfiles = files.filter(f => f.split(".").pop() === "ts");
        if (tsfiles.length <= 0) return;

        async function addPerm(args: void):Promise<any> {
            let cmds = await guild.commands.fetch()
            
            cmds.forEach(cmd => {
                if(bot.comandos.has(cmd.name)) {
                let props = require(`../comandos/`+cmd.name+'.ts')
                let permissions = props.permissions

                if(permissions && permissions.length > 0) {
                    permissions.push({
                        id: guild.id,
                        type: 'ROLE',
                        permission: false,
                    })

                    guild.commands.permissions.add({
                        command: cmd.id,
                        permissions
                    });
                }} else if(Configs.bot.delete) {
                    return cmd.delete()
                }
            })

            return;
        }

        tsfiles.forEach(async (f, i) => {
            let {name, description, options, permissions} = require(`../comandos/${f}`);

            guild.commands.create({
                name, description, options
            }).catch(e => {
                console.log(e)
            })
            if(permissions.length > 0) return setTimeout(async () => {
                await addPerm()
            }, 1500)

        });
    });

    const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setLabel('Suporte')
                    .setStyle('PRIMARY')
                    .setEmoji('🎫')
                    .setCustomId(`ticket`)
                );

    let canal = guild.channels.cache.get(Configs.ticket.canal)

    canal.send({
        embeds: [
            bot.embed()
            .setDescription(`Abrir ticket`)
        ], components: [row]
    })


}