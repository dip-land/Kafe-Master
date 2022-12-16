import type { GuildBan } from 'discord.js';
import { client } from '../handlers/bot.js';

export const name = 'guildBanAdd';
export const once = false;
export default async (ban: GuildBan) => {
	const channelID = ban.guild.id === '632717913169854495' ? '1005657796802519192' : '1003983050692116550';
	const sendChannel = await client.channels.fetch(channelID);
	if (sendChannel?.type !== 0) return;
	const created = Math.round(ban.user.createdTimestamp / 1000);
	const left = Math.round(Date.now() / 1000);
	sendChannel.send({
		embeds: [
			{
				author: {
					name: `${ban.user.tag} (${ban.user.id}) Left >~<`,
					icon_url: ban.user.displayAvatarURL(),
				},
				description: `♡ Created: <t:${created}> (<t:${created}:R>)\n\n<t:${left}> (<t:${left}:R>)`,
			},
		],
	});
};
