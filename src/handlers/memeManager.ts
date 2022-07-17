import { DMChannel, Message, NewsChannel, PartialDMChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel, VoiceChannel } from 'discord.js';

//                               memes                 testing
const channels: Array<string> = ['960560813637255189', '995368611822706708'];

export default (message: Message<boolean>, channel: Channel) => {
	if (!channels.includes(message.channelId)) return;
	if (message.content.includes('\\')) deleteMessage(message, channel, 5);
	if (message.stickers.size > 1) deleteMessage(message, channel, 5);
	if (message.attachments.size > 0) {
		let checks: Array<boolean> = [];
		for (const [s, attachment] of message.attachments) {
			if (attachment.contentType.startsWith('image/') || attachment.contentType.startsWith('video/')) checks.push(true);
			else checks.push(false);
		}
		if (checks.includes(false)) return deleteMessage(message, channel, 5);
		else return finish(message);
	}
	if (message.content) {
		let contents = message.content.split(' ');
		let checks: Array<boolean> = [];
		for (const content of contents) {
			if (isValidUrl(content)) {
				fetch(content, { method: 'HEAD' })
					.then((data) => {
						let type = data.headers.get('content-type');
						if (content.startsWith('https://tenor.com/view/') || type.startsWith('video/') || type.startsWith('image/')) checks.push(true);
						else checks.push(false);
					})
					.catch((e) => console.log(e));
			}
		}
		if (checks.includes(false) || (message.attachments.size === 0 && !message.content.includes('http'))) return deleteMessage(message, channel, 5);
		else return finish(message);
	}
};

function isValidUrl(url: string) {
	try {
		return Boolean(new URL(url));
	} catch (e) {
		return false;
	}
}

function finish(message: Message<boolean>) {
	const emojis =
		message.channelId === channels[1]
			? ['<:a_:996202740202090557>', '<:b_:996202722699264000>']
			: [
					'<:kafeheart:973325129914396712>',
					'<:cocsmile:960630832219971624>',
					'<:choowo:960614566121865277>',
					'<:vanpain:960600793789108304>',
					'<:cindizzy:960630695464669214>',
					'<:mapmad:960614761349935134>',
					'<:azustare:960630527356977212>',
					'<:shicool:960662630723375114>',
			  ];
	for (const emoji of emojis) {
		message.react(emoji).catch((e) => {
			console.log('error reacting to message:', e);
		});
	}
}

function deleteMessage(message: Message<boolean>, channel: Channel, minutes: number) {
	const messages: Array<string> = ['Nyuuu~ no tyext in the meme channel~! >w<', 'Bakaa customer~, read the channel descwiption~! >w>', 'Nyaaa~! Memes only means memes onlyy~ >w>'];
	message
		.delete()
		.then(() => {
			channel.send(messages[Math.floor(Math.random() * messages.length)]).then((message: Message<boolean>) => {
				setTimeout(() => {
					message.delete().catch((e) => {
						console.log('error deleting delete message:', e);
						setTimeout(() => {
							message.delete().catch((e) => {
								console.log('error deleting delete message:', e);
							});
						}, 10000);
					});
				}, minutes * 60000);
			});
		})
		.catch((e) => {
			console.log('error deleting message:', e);
			setTimeout(() => {
				message.delete().catch((e) => {
					console.log('error deleting message:', e);
				});
			}, 10000);
		});
}

declare type Channel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | PublicThreadChannel | PrivateThreadChannel | VoiceChannel;
