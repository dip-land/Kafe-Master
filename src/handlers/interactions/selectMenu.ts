import { SelectMenuInteraction } from 'discord.js';
import { Quote } from '../database';

export default async (interaction: SelectMenuInteraction) => {
	let args = interaction.customId.split('_');
	let cmd = args[1];
	let msg = args[args.length - 1];
	if (args[0] !== interaction.user.id) interaction.reply({ content: 'Only command initiator can use this select menu.', ephemeral: true });
	if (cmd === 'qs') {
		interaction.deferUpdate();
		let quote = await Quote.findOne({ where: { id: interaction.values[0] } });
		let createdBy = await interaction.client.users.fetch(quote.createdBy);
		interaction.message.edit({
			embeds: [
				{
					color: 0xfab6ec,
					title: `Quote #${quote.id}`,
					description: `**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${createdBy.id})\n**Created At:** <t:${Math.floor(
						quote.createdAt.getTime() / 1000
					)}:F>\n`,
					timestamp: new Date().toISOString(),
					footer: {
						text: `Requested by ${interaction.user.tag}`,
						icon_url: interaction.user.displayAvatarURL(),
					},
				},
			],
		});
	}
};
