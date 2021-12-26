import {Client, Collection, MessageEmbed} from 'discord.js'
import * as fs from 'fs'
import * as configuracoes from './config.json'

import { Comando } from './interfaces/comando'
import { Evento } from './interfaces/evento'

import DatabaseClient from './db'

DatabaseClient.init()

class bot extends Client {
    public comandos: Collection<string, Comando> = new Collection();
    public eventos: Collection<string, Evento> = new Collection();
    public constructor() {
        super({intents: [configuracoes.bot.intents]})
    }
    public start (): Promise<void> {
        this.login(configuracoes.bot.token)

        fs.readdir("./src/comandos/", (err, files) => {
            if (err) console.error(err);
            let jsfiles = files.filter(f => f.split(".").pop() === "ts");
    
            if (jsfiles.length <= 0) return;
    
            jsfiles.forEach((f) => {
                let props = require(`./comandos/${f}`);
                this.comandos.set(f.substring(0, f.length-3), props);
            });
        });

        fs.readdir("./src/eventos/", (err, files) => {
            if (err) console.error(err);
            let jsfiles = files.filter(f => f.split(".").pop() === "ts");

            if (jsfiles.length <= 0) return;
            jsfiles.forEach((f, i) => {
                let evento = require(`./eventos/${f}`);
                this.eventos.set(f, evento);
                this.on(evento.name, evento.run.bind(null, this))
            });
        });
        return;
    }
    public embed () {
        return new MessageEmbed()
        .setColor('RANDOM')
        .setFooter(`${this.user.username}`, this.user.displayAvatarURL())
        
    }
}

new bot().start()

export {bot}