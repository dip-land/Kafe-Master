import { Message } from 'discord.js';
import commandHandler from '../handlers/legacyCommand.js';
import memeHandler from '../handlers/meme.js';
import idkWhatToCallThisHandler from '../handlers/idkWhatToCallThis.js';
import { beta } from '../index.js';

export const name = 'messageCreate';
export const once = false;
export default async (message: Message<boolean>) => {
	if (message.author.bot) return;
	if (message.member.displayName.toLowerCase().includes('mouse') && Math.ceil(Math.random() * 49) === 42)
		message.channel.send('🧀');
	memeHandler(message, message.channel);
	idkWhatToCallThisHandler(message);
	let prefixes = beta ? ['.', '<@996196343120928859>'] : ['.', '<@995370187626905611>'];
	let prefix = prefixes.find((p) => message.content.startsWith(p));
	if (prefix === undefined) return;
	if (!beta && message.guildId !== '632717913169854495') return;
	commandHandler(message, prefix, message.client);
};
