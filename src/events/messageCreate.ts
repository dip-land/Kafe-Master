import { Message } from 'discord.js';
import prefixCommand from '../handlers/prefixCommand.js';
import { beta } from '../index.js';
import Config from '../structures/database/config.js';
import channelManager from '../handlers/channelManagerV2.js';
import memeHandler from '../handlers/meme.js';
import idkWhatToCallThisHandler from '../handlers/idkWhatToCallThis.js';

export const name = 'messageCreate';
export const once = false;
export default async (message: Message<boolean>) => {
	if (message.author.bot) return;
	if (message.member?.displayName.toLowerCase().includes('mouse') && Math.ceil(Math.random() * 49) === 42) message.channel.send('🧀');
	if (beta) channelManager(message);
	memeHandler(message, message.channel);
	idkWhatToCallThisHandler(message);

	let prefixes = beta ? [] : ['.', '<@995370187626905611>'];
	const configPrefixes = beta ? await Config.findAll({ where: { type: 'prefix' } }) : [];
	for (const prefix of configPrefixes) {
		prefixes.push(prefix.data);
	}
	if (!prefixes[0]) prefixes.push('hm!');
	let prefix = prefixes.find((p) => message.content.startsWith(p));
	if (prefix === undefined) return;
	if (!beta && message.guildId !== '632717913169854495') return;
	prefixCommand(message, prefix, message.client);
};
