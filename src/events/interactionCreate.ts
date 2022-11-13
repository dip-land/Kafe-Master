import command from '../handlers/interactions/command.js';
import button from '../handlers/interactions/button.js';
//import modal from '../handlers/interactions/modal.js';
import selectMenu from '../handlers/interactions/selectMenu.js';
import type { Interaction } from 'discord.js';

export const name = 'interactionCreate';
export const once = false;
export default (interaction: Interaction) => {
	if (!interaction?.id) return;
	if (interaction.isButton()) return button(interaction);
	if (interaction.isChatInputCommand()) return command(interaction);
	//if (interaction.isModalSubmit()) return modal(interaction);
	if (interaction.isSelectMenu()) return selectMenu(interaction);
};
