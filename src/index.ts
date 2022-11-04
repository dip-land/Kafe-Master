import { Client, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import 'dotenv/config';
import glob from 'glob';
import { EventFile } from './types/index.js';
import { platform } from 'os';
import ora from 'ora';
import { Command } from './structures/command.js';

export const beta = platform() === 'win32';

export const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildVoiceStates'],
});

client.cooldowns = new Collection();
client.legacyCommands = new Collection();
export const commands = [];

glob('./dist/commands/**/*.js', async (err: Error | null, paths: Array<string>) => {
	let loader = ora('Loading commands').start();
	let loadStart = Date.now();
	for (const path of paths) {
		try {
			const command: Command = (await import(path.replace('./dist', '.'))).default;
			client.legacyCommands.set(command.commandObject?.name, command);
			if (typeof command?.slashCommand === 'function') commands.push(command.applicationData as never);
			if (command.commandObject?.aliases) for (const alias of command.commandObject?.aliases) client.legacyCommands.set(alias, command);
		} catch (err) {
			loader.fail(`Command Loading Failed. ${Date.now() - loadStart}ms`);
			console.log(err);
		}
	}
	loader.succeed(`Commands Loaded. ${Date.now() - loadStart}ms`);
});

glob('./dist/events/**/*.js', async (err: Error | null, paths: Array<string>) => {
	let loader = ora('Loading Events').start();
	let loadStart = Date.now();
	for (const path of paths) {
		try {
			const event: EventFile = await import(path.replace('./dist', '.'));
			if (event.once) client.once(event.name, (...args) => event.default(...args));
			else client.on(event.name, (...args) => event.default(...args));
		} catch (err) {
			loader.fail(`Event Loading Failed. ${Date.now() - loadStart}ms`);
			console.log(err);
		}
	}
	loader.succeed(`Events Loaded. ${Date.now() - loadStart}ms`);
});

client.login(beta ? process.env.BETATOKEN : process.env.TOKEN);
client.rest = new REST({ version: '10' }).setToken(beta ? process.env.BETATOKEN as string : process.env.TOKEN as string);
