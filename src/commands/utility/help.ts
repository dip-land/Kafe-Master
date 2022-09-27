import { Message, ChatInputApplicationCommandData, Client, CommandInteraction, CommandInteractionOption } from 'discord.js';
import { CommandFileExtendedData } from 'src/types/index.js';

export const data: ChatInputApplicationCommandData = {
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
};

export const extendedData: CommandFileExtendedData = {
	aliases: ['commands', 'cmds'],
	category: 'utility',
};

export default (interaction: CommandInteraction, options: Array<CommandInteractionOption>) => {
	try {
		let query = options.find((option) => option.name === 'query')?.value;
		let title: string;
		const description: Array<string> = [];
		for (const [name, command] of interaction.client.legacyCommands) {
			if (command.extendedData.category === query && !command.extendedData?.aliases?.includes(name)) {
				title = `${query[0].toUpperCase() + query.slice(1)} Commands`;
				description.push(`**${name}** - ${command.data.description}`);
			} else if (query === name) {
				title = `${query[0].toUpperCase() + query.slice(1)} Command`;
				description.push(
					`**Name:** ${command.data.name}\n**Description:** ${command.data.description}\n**Aliases:** ${
						command.extendedData.aliases?.length > 0 ? command.extendedData.aliases.join(', ') : 'none'
					}\n**Category:** ${command.extendedData.category}\n**Cooldown:** ${command.extendedData.cooldown ? command.extendedData.cooldown : 2.5} second(s)`
				);
			} else if (!query) {
				description.push(`**${command.extendedData.category}**`);
			}
		}
		if (!query) {
			return interaction.editReply({
				embeds: [
					{
						color: 0xfab6ec,
						title: `Avaliable Command Categories`,
						description: [...new Set(description)].join('\n'),
						timestamp: new Date().toISOString(),
						footer: {
							text: `Requested by ${interaction.user.tag}`,
							icon_url: interaction.user.displayAvatarURL(),
						},
					},
				],
			});
		}
		if (title && description[0]) {
			return interaction.editReply({
				embeds: [
					{
						color: 0xfab6ec,
						title: title,
						description: description.join('\n'),
						timestamp: new Date().toISOString(),
						footer: {
							text: `Requested by ${interaction.user.tag}`,
							icon_url: interaction.user.displayAvatarURL(),
						},
					},
				],
			});
		} else {
			return interaction.editReply({
				embeds: [
					{
						color: 0xfab6ec,
						title: `Category or Command Error`,
						description: `The category or command \`${query}\` does not exist, or there was an error with this command.`,
						timestamp: new Date().toISOString(),
						footer: {
							text: `Requested by ${interaction.user.tag}`,
							icon_url: interaction.user.displayAvatarURL(),
						},
					},
				],
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export function legacy(message: Message, args: Array<string>, client: Client) {
	let title: string;
	const description: Array<string> = [];
	for (const [name, command] of client.legacyCommands) {
		if (command.extendedData.category === args[0] && !command.extendedData?.aliases?.includes(name)) {
			title = `${args[0][0].toUpperCase() + args[0].slice(1)} Commands`;
			description.push(`**${name}** - ${command.data.description}`);
		} else if (args[0] === name) {
			title = `${args[0][0].toUpperCase() + args[0].slice(1)} Command`;
			description.push(
				`**Name:** ${command.data.name}\n**Description:** ${command.data.description}\n**Aliases:** ${
					command.extendedData.aliases?.length > 0 ? command.extendedData.aliases.join(', ') : 'none'
				}\n**Category:** ${command.extendedData.category}\n**Cooldown:** ${command.extendedData.cooldown ? command.extendedData.cooldown : 2.5} second(s)`
			);
		} else if (!args[0]) {
			description.push(`**${command.extendedData.category}**`);
		}
	}
	if (!args[0]) {
		return message.reply({
			embeds: [
				{
					color: 0xfab6ec,
					title: `Avaliable Command Categories`,
					description: [...new Set(description)].join('\n'),
					timestamp: new Date().toISOString(),
					footer: {
						text: `Requested by ${message.author.tag}`,
						icon_url: message.author.displayAvatarURL(),
					},
				},
			],
		});
	}
	if (title && description[0]) {
		return message.reply({
			embeds: [
				{
					color: 0xfab6ec,
					title: title,
					description: description.join('\n'),
					timestamp: new Date().toISOString(),
					footer: {
						text: `Requested by ${message.author.tag}`,
						icon_url: message.author.displayAvatarURL(),
					},
				},
			],
		});
	} else {
		return message.reply({
			embeds: [
				{
					color: 0xfab6ec,
					title: `Category or Command Error`,
					description: `The category or command \`${args[0]}\` does not exist, or there was an error with this command.`,
					timestamp: new Date().toISOString(),
					footer: {
						text: `Requested by ${message.author.tag}`,
						icon_url: message.author.displayAvatarURL(),
					},
				},
			],
		});
	}
}
