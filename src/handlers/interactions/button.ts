import { ButtonInteraction } from 'discord.js';
import { Quote } from '../database';

export default async (interaction: ButtonInteraction) => {
	let args = interaction.customId.split('_');
	let cmd = args[1];
	let msg = args[args.length - 1];
	if (args[0] !== interaction.user.id) interaction.reply({ content: 'Only command initiator can use these buttons.', ephemeral: true });
	if (cmd === 'cancel') {
		interaction.reply({ content: 'Command canceled.', ephemeral: true });
		interaction.message.delete();
		(await interaction.channel.messages.fetch(msg)).delete();
	}
	if (cmd === 'qd') {
		let quote = await Quote.findOne({ where: { id: args[2] } });
		quote.destroy().then(async (q) => {
			interaction.reply({ content: 'Quote deleted.', ephemeral: true });
			interaction.message.delete();
			(await interaction.channel.messages.fetch(msg)).delete();
		});
	}
};
