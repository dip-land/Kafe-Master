import { GuildMember } from 'discord.js';
import { client } from '../index';

export const name = 'guildMemberRemove';
export const once = false;
export default async (member: GuildMember) => {
	const channelID = member.guild.id === '632717913169854495' ? '1005657796802519192' : '1003983050692116550';
	const sendChannel = await client.channels.fetch(channelID);
	if (sendChannel.type !== 0) return;
	const created = Math.round(member.user.createdTimestamp / 1000);
	const left = Math.round(Date.now() / 1000);
	sendChannel.send({
		embeds: [
			{
				author: {
					name: `${member.user.tag} (${member.user.id})`,
					icon_url: member.user.displayAvatarURL(),
				},
				description: `• Username: <@${member.user.id}> - \`${member.user.tag}\` (${member.user.id})\n• Created: <t:${created}> (<t:${created}:R>)\n• Left: <t:${left}> (<t:${left}:R>)`,
				footer: {
					text: 'User Left',
				},
				timestamp: new Date(Date.now()).toISOString(),
			},
		],
	});
};
