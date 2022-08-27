import { Client, Collection, Message } from 'discord.js';
import { CommandFile } from '../types';

export default (message: Message, prefix: string, client: Client<boolean>) => {
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command: CommandFile = client.legacyCommands.get(commandName);

	if (!command) return;

	if (command.extendedData.disabled) return message.reply('This command is currently disabled.');
	if (!client.cooldowns.has(commandName)) {
		client.cooldowns.set(commandName, new Collection());
	}
	const now = Date.now();
	const timestamps = client.cooldowns.get(commandName);
	const cooldownAmount = (command.extendedData.cooldown || 2.5) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			return message.reply(`Please wait ${((expirationTime - now) / 1000).toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.legacy(message, args, client);
	} catch (error) {
		console.log(error);
	}
};
