import { Client, Routes } from "discord.js";
import { beta, commands } from "../index";
import { registerGuild } from '../handlers/database';

export const name = 'ready';
export const once = true;
export default async (client: Client<boolean>) => {
	console.log(client.user.username, 'online');
	if (beta) {
		client.guilds.fetch('981639333549322262').then((g) => registerGuild(g));
		client.rest
			.put(Routes.applicationGuildCommands('996196343120928859', '981639333549322262'), { body: commands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	} else {
		client.guilds.fetch('632717913169854495').then((g) => registerGuild(g));
	}
};
