import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import messageCreate from './events/messageCreate';
import os from 'os';
dotenv.config();

export const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
	console.log(client.user.username, 'online');
});

messageCreate();

//check if host is running on windows nt 10.0*
if (os.release().includes('10.0')) client.login(process.env.BETATOKEN);
else client.login(process.env.TOKEN);
