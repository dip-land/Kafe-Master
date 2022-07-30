import { CommandInteraction } from 'discord.js';
import { CommandFile } from 'src';

export default async (interaction: CommandInteraction) => {
	const command: CommandFile = interaction.client.legacyCommands.get(interaction.commandName);
	const hidden: boolean = !!interaction.options.data.find((option) => option.name === 'hide')?.value;
	await interaction.deferReply({ephemeral: hidden});
	try {
		command.default(interaction, interaction.options.data);
	} catch (error) {
		console.log(error);
	}
};
