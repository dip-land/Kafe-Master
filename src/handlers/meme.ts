import type { DMChannel, Message, NewsChannel, PartialDMChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel, VoiceChannel } from 'discord.js';

//                               memes                 testing
const channels: Array<string> = ['960560813637255189', '995368611822706708'];

export default async (message: Message<boolean>, channel: Channel) => {
	if (!channels.includes(message.channelId)) return;
	if (message.content.includes('\\')) deleteMessage(message, channel, 5);
	if (message.stickers.size > 0) deleteMessage(message, channel, 5);
	if (message.attachments.size > 0) {
		const checks: Array<number> = [];
		for (const [s, attachment] of message.attachments) {
			if (s) null;
			if (attachment.contentType?.match(/video\/|image\//g)) checks.push(1);
			else checks.push(0);
		}
		if (checks.includes(0)) return deleteMessage(message, channel, 5);
		else return finish(message);
	}
	if (message.content) {
		const contents = message.content.split(/[\n\r\s]+/);
		const checks: Array<number> = [];
		for (const content of contents) {
			if (
				content.startsWith('https://tenor.com/view/') ||
				content.startsWith('https://www.reddit.com/') ||
				content.startsWith('https://twitter.com/') ||
				content.startsWith('https://vxtwitter.com/') ||
				content.match(/^(https?:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/g)
			) {
				checks.push(1);
			} else {
				const data = await fetch(content, { method: 'HEAD' }).catch((e) => {});
				if (data) {
					const type = data.headers.get('content-type');
					if (type?.match(/video\/|image\/|webm/g)) checks.push(1);
					else checks.push(0);
				}
			}
		}
		if (checks.includes(0) || checks.length === 0) return deleteMessage(message, channel, 5);
		else return finish(message);
	}
};

function finish(message: Message<boolean>) {
	const emojis =
		message.channelId === channels[1]
			? ['<:a_:996202740202090557>', '<:b_:996202722699264000>']
			: ['<a:akafeheart:1009602965616726026>', '<:cocsmile:960630832219971624>', '<:chopain:960614470940504075>', '<:cindizzy:960630695464669214>', '<:mapmad:960614761349935134>'];
	for (const emoji of emojis) {
		message.react(emoji).catch((e) => console.log('error reacting to a message'));
	}
}

function deleteMessage(message: Message<boolean>, channel: Channel, minutes: number) {
	const messages: Array<string> = ['Nyuuu~ no tyext in the meme channel~! >w<', 'Bakaa customer~, read the channel descwiption~! >w>', 'Nyaaa~! Memes only means memes onlyy~ >w>'];
	message
		.delete()
		.then(() => {
			channel.send(messages[Math.floor(Math.random() * messages.length)]).then((deleteMessage: Message<boolean>) => {
				setTimeout(() => {
					deleteMessage.delete().catch((e) => {
						setTimeout(() => {
							deleteMessage.delete().catch((e) => {
								console.log('error deleting delete message:', e);
							});
						}, 10000);
					});
				}, minutes * 60000);
			});
		})
		.catch((e) => {
			setTimeout(() => {
				message.delete().catch((e) => {
					console.log('error deleting message:', e);
				});
			}, 10000);
		});
}

declare type Channel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | PublicThreadChannel | PrivateThreadChannel | VoiceChannel;
