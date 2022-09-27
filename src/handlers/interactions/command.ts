import { CommandInteraction } from 'discord.js';
import { CommandFile } from '../../types/index.js';

export default async (interaction: CommandInteraction) => {
	const command: CommandFile = interaction.client.legacyCommands.get(interaction.commandName);
	const hidden: boolean = !!interaction.options.data.find((option) => option.name === 'hide')?.value;
	await interaction.deferReply({ ephemeral: hidden });
	if (command.extendedData.permissions) {
		for (const permission of command.extendedData.permissions) {
			if (!(await interaction.guild.members.fetch(interaction.user.id)).permissions.has(permission)) return interaction.editReply('You seem to be missing permissions to use this command.');
		}
	}
	try {
		command.default(interaction, interaction.options.data);
	} catch (error) {
		console.log(error);
	}
};
