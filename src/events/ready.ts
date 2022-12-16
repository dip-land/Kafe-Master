import { type Client, Routes } from 'discord.js';
import { check } from '../handlers/database/index.js';
import { commands } from '../handlers/bot.js';
import { beta } from '../index.js';

export const name = 'ready';
export const once = true;
export default async (client: Client<boolean>) => {
	console.log(client.user?.username, 'online');
	check();
	//client.guilds.fetch(beta ? '981639333549322262' : '632717913169854495').then((g) => registerGuild(g));
	if (beta) {
		client.rest
			.put(Routes.applicationGuildCommands('996196343120928859', '981639333549322262'), { body: commands })
			.then(() => console.log('Successfully registered guild application commands.'))
			.catch(console.error);
	} else {
		client.rest
			.put(Routes.applicationCommands('995370187626905611'), { body: commands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	}
};
