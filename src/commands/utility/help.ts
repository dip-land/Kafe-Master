import { Command } from '../../structures/command.js';

export default new Command({
	name: 'help',
	description: 'Get some help :3',
	options: [
		{
			type: 3,
			name: 'query',
			description: 'Command or Category you want to search',
		},
		{
			type: 5,
			name: 'hide',
			description: 'Hide the response',
		},
	],
	aliases: ['commands', 'cmds'],
	category: 'utility',
	async slashCommand(interaction, options) {
		interaction.editReply('Command not avaliable.');
	},
	async prefixCommand(message, args) {
		message.reply('Command not avaliable.');
	},
});
