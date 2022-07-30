import { Message } from 'discord.js';
import commandHandler from '../handlers/legacyCommand';
import memeHandler from '../handlers/meme';
import idkWhatToCallThisHandler from '../handlers/idkWhatToCallThis';

export const name = 'messageCreate';
export const once = false;
export default async (message: Message<boolean>) => {
	if (message.author.bot) return;
	memeHandler(message, message.channel);
	idkWhatToCallThisHandler(message);
	let prefix = ['.', '<@996196343120928859>'].find((p) => message.content.startsWith(p));
	if (prefix === undefined) return;
	commandHandler(message, prefix, message.client);
};
