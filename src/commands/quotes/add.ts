import { Message, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOption } from 'discord.js';
import { Quote } from '../../handlers/database.js';

export const data: ChatInputApplicationCommandData = {
	name: 'quoteadd',
	description: 'Create a quote',
	options: [
		{
			type: 3,
			name: 'keyword',
			description: 'The quotes keyword',
			required: true,
		},
		{
			type: 3,
			name: 'text',
			description: 'The quotes content',
			required: true,
		},
	],
};

export const extendedData = {
	aliases: ['qa', 'qadd'],
	category: 'quotes',
	cooldown: 10,
};

export default (interaction: CommandInteraction, options: Array<CommandInteractionOption>) => {
	try {
		let keyword = options.find((option) => option.name === 'keyword')?.value;
		let text = options.find((option) => option.name === 'text')?.value;
		new Quote({ keyword: keyword, text: text, createdBy: interaction.user.id }).save().then((q) => {
			interaction.editReply(`Quote #${q.id} cweated :3`);
		});
	} catch (error) {
		console.log(error);
	}
};

export async function legacy(message: Message, args: Array<string>) {
	if (!args[0]) return message.reply('Nyu keyword or text provided miyaaaa~!');
	let keyword = args.shift();
	if (!args[0]) return message.reply('Nyow add the text desu~!');
	new Quote({ keyword: keyword, text: args.join(' '), createdBy: message.author.id }).save().then((q) => {
		message.reply(`Quote #${q.id} cweated :3`);
	});
}
