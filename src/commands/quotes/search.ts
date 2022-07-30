import { Message, ChatInputApplicationCommandData, Client, CommandInteraction, CommandInteractionOption } from 'discord.js';
import { Quote } from '../../handlers/database';

export const data: ChatInputApplicationCommandData = {
	name: 'quotesearch',
	description: 'Search quote by ID or Keyword',
	options: [
		{
			type: 3,
			name: 'query',
			description: 'Keyword or ID you want to search',
			required: true,
		},
		{
			type: 5,
			name: 'hide',
			description: 'Hide the response',
		},
	],
};

export const extendedData = {
	aliases: ['qs', 'qsearch', 'qid'],
	category: 'quotes',
};

export default async (interaction: CommandInteraction, options: Array<CommandInteractionOption>) => {
	try {
		let query = options.find((option) => option.name === 'query')?.value;
		if (typeof query === 'number') {
			let quote = await Quote.findOne({ where: { query } });
			if (!quote) return interaction.editReply(`The quote #${query} jar is empty :3`);
			let createdBy = await interaction.client.users.fetch(quote.createdBy);
			interaction.editReply({
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
		} else {
			let quotes = await Quote.findAll({ where: { keyword: query } });
			let parsedQuotes = [];
			for (const quote of quotes) {
				parsedQuotes.push({
					label: `ID: ${quote.id} Text:${quote.text.substring(0, 45)}`,
					description: `${quote.text.substring(45, 145)}`,
					value: `${quote.id}`,
				});
			}
			let quote = quotes[0];
			if (!quote) return interaction.editReply(`This keyword has no quotes, sempai~`);
			let createdBy = await interaction.client.users.fetch(quote.createdBy);
			interaction.editReply({
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
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								custom_id: `${interaction.user.id}_qs_${interaction.id}`,
								options: parsedQuotes,
								placeholder: 'Select a quote',
							},
						],
					},
				],
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export async function legacy(message: Message, args: Array<string>, client: Client<boolean>) {
	if (!args[0]) return message.reply('Nyu keyword or id provided miyaaaa~!');
	let id = parseInt(args[0]);
	if (id) {
		let quote = await Quote.findOne({ where: { id } });
		if (!quote) return message.reply(`The quote #${id} jar is empty :3`);
		let createdBy = await client.users.fetch(quote.createdBy);
		message.reply({
			embeds: [
				{
					color: 0xfab6ec,
					title: `Quote #${quote.id}`,
					description: `**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${createdBy.id})\n**Created At:** <t:${Math.floor(
						quote.createdAt.getTime() / 1000
					)}:F>\n`,
					timestamp: new Date().toISOString(),
					footer: {
						text: `Requested by ${message.author.tag}`,
						icon_url: message.author.displayAvatarURL(),
					},
				},
			],
		});
	} else {
		let quotes = await Quote.findAll({ where: { keyword: args[0] } });
		let parsedQuotes = [];
		for (const quote of quotes) {
			parsedQuotes.push({
				label: `ID: ${quote.id} Text:${quote.text.substring(0, 45)}`,
				description: `${quote.text.substring(45, 145)}`,
				value: `${quote.id}`,
			});
		}
		let quote = quotes[0];
		if (!quote) return message.reply(`This keyword has no quotes, sempai~`);
		let createdBy = await client.users.fetch(quote.createdBy);
		message.reply({
			embeds: [
				{
					color: 0xfab6ec,
					title: `Quote #${quote.id}`,
					description: `**Keyword:** ${quote.keyword}\n**Text:** ${quote.text}\n**Created By:** ${createdBy.tag} (${createdBy.id})\n**Created At:** <t:${Math.floor(
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
							type: 3,
							custom_id: `${message.author.id}_qs_${message.id}`,
							options: parsedQuotes,
							placeholder: 'Select a quote',
						},
					],
				},
			],
		});
	}
}
