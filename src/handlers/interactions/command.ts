import { CommandInteraction } from 'discord.js';
import { Command } from '../../structures/command.js';

export default async (interaction: CommandInteraction) => {
	const command = interaction.client.legacyCommands.get(interaction.commandName) as Command;
	const hidden: boolean = !!interaction.options.data.find((option) => option.name === 'hide')?.value;
	await interaction.deferReply({ ephemeral: hidden });
	//permissions check
	if (command.commandObject.permissions) {
		for (const permission of command.commandObject?.permissions) {
			if (!(await interaction.guild!.members.fetch(interaction.user.id)).permissions.has(permission)) return interaction.editReply('You seem to be missing permissions to use this command.');
		}
	}

	if (command.commandObject?.disabled) return interaction.editReply("This command is currently disabled.")
	
	try {
		command.slashCommand(interaction, interaction.options.data);
	} catch (error) {
		console.log(error);
	}
};
