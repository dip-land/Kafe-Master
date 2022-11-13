import type { GuildMember } from 'discord.js';

export const name = 'guildMemberUpdate';
export const once = false;
export default async (member: GuildMember, oldMember: GuildMember) => {
	if (oldMember.premiumSinceTimestamp !== member.premiumSinceTimestamp) console.log(member.premiumSinceTimestamp, oldMember.premiumSinceTimestamp, 'user boosted? triggered');
};
