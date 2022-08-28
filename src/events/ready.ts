import { Client, Routes } from 'discord.js';
import { beta, commands } from '../index.js';
import { registerGuild } from '../handlers/database.js';

export const name = 'ready';
export const once = true;
export default async (client: Client<boolean>) => {
	console.log(client.user.username, 'online');
	client.guilds.fetch(beta ? '981639333549322262' : '632717913169854495').then((g) => registerGuild(g));
	// client.rest
	// 	.put(Routes.applicationGuildCommands(beta ? '996196343120928859' : '995370187626905611', beta ? '981639333549322262' : '632717913169854495'), { body: commands })
	// 	.then(() => console.log('Successfully registered application commands.'))
	// 	.catch(console.error);
};
