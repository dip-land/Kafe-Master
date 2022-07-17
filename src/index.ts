import { Client } from 'discord.js';
import * as dotenv from 'dotenv';
import messageCreate from './events/messageCreate';
import os from 'os';
dotenv.config();

export const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});

export const beta = os.release().includes('10.0');

client.on('ready', () => {
	console.log(client.user.username, 'online');
});

messageCreate();

if (beta) client.login(process.env.BETATOKEN);
else client.login(process.env.TOKEN);
