import { GuildMember } from 'discord.js';
import { client } from '../';

export const name = 'guildMemberUpdate';
export const once = false;
export default async (member: GuildMember, oldMember: GuildMember) => {
	console.log(member.premiumSinceTimestamp, oldMember.premiumSinceTimestamp, "guildMemberUpdate triggered")
};
