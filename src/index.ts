import { Client, Message } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client(
    {
        intents: ['Guilds', 'GuildMessages', 'MessageContent']
    }
);
//testing            memes
//995368611822706708 960560813637255189
const target = '995368611822706708';
const emojis = [
    //Production Emojis
    // "<:kafeheart:973325129914396712>",
    // "<:cocsmile:960630832219971624>",
    // "<:choowo:960614566121865277>",
    // "<:vanpain:960600793789108304>",
    // "<:cindizzy:960630695464669214>",
    // "<:mapmad:960614761349935134>",
    // "<:azustare:960630527356977212>", 
    // "<:shicool:960662630723375114>"

    //Testing Emojis
    "<:a_:996202740202090557>",
    "<:b_:996202722699264000>"
]

client.on('ready', () => {
    console.log('online');
});

client.on('messageCreate', async message => {
    if (message.channelId !== target) return;
    if (message.author.bot) return;
    const channel = message.channel;
    if (message.content.includes('\\')) deleteMessage(message, channel, 5);
    if (message.attachments.size > 0) {
        let checks: Array<boolean> = [];
        for (const [string, attachment] of message.attachments) {
            if (attachment.contentType.startsWith('image/')) checks.push(true);
            else if (attachment.contentType.startsWith('video/')) checks.push(true);
            else checks.push(false);
        }
        if (checks.includes(false)) return deleteMessage(message, channel, 5);
        else return finish(message);
    }
    if (message.content) {
        let contents = message.content.split(' ');
        let checks: Array<boolean> = [];
        for (let i = 0; i < contents.length; i++) {
            let content = contents[i];
            if (isValidUrl(content)) {
                let type = (await fetch(content, { method: 'HEAD' })).headers.get('content-type');
                if (content.startsWith('https://tenor.com/view/')) checks.push(true);
                else if (type.startsWith('video/')) checks.push(true);
                else if (type.startsWith('image/')) checks.push(true);
                else checks.push(false);
            };
        }
        if (checks.includes(false)) return deleteMessage(message, channel, 5);
        if (message.attachments.size === 0 && !message.content.includes('http')) deleteMessage(message, channel, 5);
        else return finish(message);
    }
});

function isValidUrl(url: string) { try { return Boolean(new URL(url)) } catch (e) { return false } }
function finish(message: Message<boolean>) {
    for (const emoji of emojis) {
        message.react(emoji).catch(e => { console.log('error reacting to message:', e) });
    }
}
function deleteMessage(message: Message<boolean>, channel: any, minutes: number) {
    message.delete().then(() => { channel.send('[Message Deleted]').then(message => { setTimeout(() => { message.delete() }, minutes * 60000) }) });
}

client.login(process.env.BETATOKEN);