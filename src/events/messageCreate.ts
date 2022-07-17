import memeManager from '../handlers/memeManager';
import { client } from '../index';

export default () => {
	client.on('messageCreate', async (message) => {
		if (message.author.bot) return;
		memeManager(message, message.channel);
	});
};
