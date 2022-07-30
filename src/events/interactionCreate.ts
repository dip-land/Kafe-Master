import command from '../handlers/interactions/command';
import button from '../handlers/interactions/button';
import selectMenu from '../handlers/interactions/selectMenu';
import { Interaction } from 'discord.js';

export const name = 'interactionCreate';
export const once = false;
export default (interaction: Interaction) => {
	if(!interaction?.id) return;
	if (interaction?.isButton()) return button(interaction);
	if (interaction?.isChatInputCommand()) return command(interaction);
	if (interaction?.isSelectMenu()) return selectMenu(interaction);
};
