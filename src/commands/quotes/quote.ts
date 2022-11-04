import { Command } from '../../structures/command.js';
import Quote from '../../structures/database/quote.js';

export default new Command({
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
	aliases: ['q'],
	category: 'quotes',
	async slashCommand(interaction, options) {
		try {
			let keyword = `${options.find((option) => option.name === 'keyword')?.value}`.toLowerCase();
			let quotes = await Quote.findAll({ where: { keyword: keyword } });
			let chosen = quotes[Math.floor(Math.random() * quotes.length)];
			interaction.editReply(chosen?.text || 'This keyword has no quotes, sempai~');
		} catch (error) {
			console.log(error);
		}
	},
	async prefixCommand(message, args) {
		if (!args[0]) return message.reply('You nyeed the keyword, desu~');
		let quotes = await Quote.findAll({ where: { keyword: args[0].toLowerCase() } });
		let chosen = quotes[Math.floor(Math.random() * quotes.length)];
		message.channel.send(chosen?.text || 'This keyword has no quotes, sempai~');
	},
});
