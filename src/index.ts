import { CacheType, ChatInputApplicationCommandData, Client, Collection, CommandInteraction, CommandInteractionOption, Message } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'dotenv/config';
import { glob } from 'glob';

import os from 'os';
export const beta = os.release().includes('10.0');

export const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers'],
});
client.cooldowns = new Collection();
client.legacyCommands = new Collection();
export const commands = [];

glob('./dist/commands/**/*.js', (err: Error, paths: Array<string>) => {
	for (const path of paths) {
		try {
			const command: CommandFile = require(path.replace('./dist', '.'));
			client.legacyCommands.set(command.data?.name, command);
			commands.push(command.data);
			if (!command.extendedData?.aliases) return;
			for (const alias of command.extendedData?.aliases) {
				client.legacyCommands.set(alias, command);
			}
		} catch (err) {
			console.log(err);
		}
	}
});

glob('./dist/events/**/*.js', (err: Error, paths: Array<string>) => {
	for (const path of paths) {
		try {
			const event: EventFile = require(path.replace('./dist', '.'));
			if (event.once) {
				client.once(event.name, (...args) => event.default(...args));
			} else {
				client.on(event.name, (...args) => event.default(...args));
			}
		} catch (err) {
			console.log(err);
		}
	}
});

if (beta) {
	client.login(process.env.BETATOKEN);
	client.rest = new REST({ version: '10' }).setToken(process.env.BETATOKEN);
} else {
	client.login(process.env.TOKEN);
	//client.rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
	os.setPriority(-20);
}

//types
declare module 'discord.js' {
	interface Client {
		cooldowns: Map<any, any>;
		legacyCommands: Map<string, CommandFile>;
	}
}

export type CommandFile = {
	data: ChatInputApplicationCommandData;
	extendedData: {
		aliases?: Array<string>;
		category: string;
		cooldown?: number;
		disabled?: boolean;
	};
	default: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => void;
	legacy: (message: Message, args: Array<string>, client?: Client) => void;
};

export type EventFile = {
	name: string;
	once: boolean;
	default: (...args: Array<any>) => void;
};
