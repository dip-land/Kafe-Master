import { Message, ChatInputApplicationCommandData, Client, CommandInteraction, CommandInteractionOption } from 'discord.js';
import { Quote } from '../../handlers/database.js';

export const data: ChatInputApplicationCommandData = {
	name: 'quotedelete',
	description: 'Delete a quote by its ID',
	options: [
		{
			type: 3,
			name: 'id',
			description: 'The quotes ID',
			required: true,
		},
	],
};

export const extendedData = {
	aliases: ['qd', 'qdelete', 'qdel'],
	category: 'quotes',
	cooldown: 10,
};

export default async (interaction: CommandInteraction, options: Array<CommandInteractionOption>) => {
	try {
		let id = options.find((option) => option.name === 'id')?.value;
		let quote = await Quote.findOne({ where: { id } });
		if (!quote) return interaction.editReply(`The quote #${id} jar is empty :3`);
		let createdBy = await interaction.client.users.fetch(quote.createdBy);
		if (!interaction.memberPermissions.has('Administrator') || interaction.user.id !== createdBy.id) return;
		interaction.editReply({
			embeds: [
				{
					color: 0xfab6ec,
					title: `Do you wanna compost this quote, myaa?`,
					description: `**ID:** ${quote.id}\n**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${createdBy.id})\n**Created At:** <t:${Math.floor(
						quote.createdAt.getTime() / 1000
					)}:F>\n`,
					timestamp: new Date().toISOString(),
					footer: {
						text: `Requested by ${interaction.user.tag}`,
						icon_url: interaction.user.displayAvatarURL(),
					},
				},
			],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							customId: `${interaction.user.id}_qd_${quote.id}_${interaction.id}`,
							label: 'Yes',
							style: 4,
						},
						{
							type: 2,
							customId: `${interaction.user.id}_cancel_${interaction.id}`,
							label: 'No',
							style: 2,
						},
					],
				},
			],
		});
	} catch (error) {
		console.log(error);
	}
};

export async function legacy(message: Message, args: Array<string>, client: Client<boolean>) {
	if (!args[0]) return message.reply('No ID was provided.');
	let id = parseInt(args[0]);
	if (!id) return;
	let quote = await Quote.findOne({ where: { id } });
	if (!quote) return message.reply(`The quote #${id} jar is empty :3`);
	let createdBy = await client.users.fetch(quote.createdBy);
	if (!message.member.permissions.has('Administrator') || message.author.id !== createdBy.id) return;
	message.reply({
		embeds: [
			{
				color: 0xfab6ec,
				title: `Do you wanna compost this quote, myaa?`,
				description: `**ID:** ${quote.id}\n**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${createdBy.id})\n**Created At:** <t:${Math.floor(
					quote.createdAt.getTime() / 1000
				)}:F>\n`,
				timestamp: new Date().toISOString(),
				footer: {
					text: `Requested by ${message.author.tag}`,
					icon_url: message.author.displayAvatarURL(),
				},
			},
		],
		components: [
			{
				type: 1,
				components: [
					{
						type: 2,
						customId: `${message.author.id}_qd_${quote.id}_${message.id}`,
						label: 'Yes',
						style: 4,
					},
					{
						type: 2,
						customId: `${message.author.id}_cancel_${message.id}`,
						label: 'No',
						style: 2,
					},
				],
			},
		],
	});
}
