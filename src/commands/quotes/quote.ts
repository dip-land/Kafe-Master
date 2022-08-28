import { Message, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOption } from 'discord.js';
import { Quote } from '../../handlers/database.js';

export const data: ChatInputApplicationCommandData = {
	name: 'quote',
	description: 'Just some quotes',
	options: [
		{
			type: 3,
			name: 'keyword',
			description: 'The quotes keyword',
			required: true,
		},
	],
};

export const extendedData = {
	aliases: ['q'],
	category: 'quotes',
};

export default async (interaction: CommandInteraction, options: Array<CommandInteractionOption>) => {
	try {
		let keyword = options.find((option) => option.name === 'keyword')?.value;
		let quotes = await Quote.findAll({ where: { keyword: keyword } });
		let chosen = quotes[Math.floor(Math.random() * quotes.length)];
		interaction.editReply(chosen?.text || 'This keyword has no quotes, sempai~');
	} catch (error) {
		console.log(error);
	}
};

export async function legacy(message: Message, args: Array<string>) {
	if (!args[0]) return message.reply('You nyeed the keyword, desu~');
	let quotes = await Quote.findAll({ where: { keyword: args[0] } });
	let chosen = quotes[Math.floor(Math.random() * quotes.length)];
	message.channel.send(chosen?.text || 'This keyword has no quotes, sempai~');
}
