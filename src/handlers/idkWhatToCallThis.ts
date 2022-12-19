import type { Message } from 'discord.js';
import Counter from '../structures/database//counter.js';

export type Channels = [{ channel: string; emojis: Array<string>; msg: string; t: number }];

const channels = [
	{ channel: '690972955080917085', emojis: ['<a:akafeheart:1009602965616726026>'], msg: "❕>w< w-where's the cute~?? Post more cute~!", t: 8 }, //tearoom
	{ channel: '1054475329776926830', emojis: ['💕'], msg: "❕>w< w-where's the cute~?? Post more cute~!", t: 10 }, //extra-cute
	{ channel: '1054471487119179886', emojis: ['💖'], msg: "❕>w< w-where's the cute~?? Post more cute~!", t: 10 }, //super-cute
	{ channel: '995368611822706708', emojis: ['💖'], msg: '>:(', t: 3 }, //msgblocktest
];

//my testing channel, tearoom, and all the channels in massage parlor except basement
// const channels: Array<string> = [
// 	'1002426028532174959',
// 	'690972955080917085',
// 	'973421960790954024',
// 	'632719361190395925',
// 	'870772556343443556',
// 	'817153208807981056',
// 	'821055344566468689',
// 	'819703387351285790',
// 	'861372174664073226',
// 	'821061080621121596',
// 	'1054475329776926830',
// ];

export default async (message: Message<boolean>) => {
	const channel = channels.find(({ channel }) => channel === message.channelId);
	if (!channel || message.channel.type !== 0 || !message?.id) return;
	const counter = (await Counter.findOrCreate({ where: { id: message.channelId } }))[0];
	if (message.attachments.size > 0) {
		const checks: Array<number> = [];
		for (const [s, attachment] of message.attachments) {
			if (attachment.contentType?.match(/video\/|image\//g)) checks.push(1);
			else checks.push(0);
		}
		if (!checks.includes(0)) return finish(message, counter, channel);
	}
	if (message.content) {
		const contents = message.content.split(' ');
		const checks: Array<number> = [];
		for (const content of contents) {
			if (content.startsWith('https://tenor.com/view/') || content.match(/^(https?:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/g) || content.startsWith('https://twitter.com/')) {
				checks.push(1);
			} else if (content.startsWith('http')) {
				const data = await fetch(content, { method: 'HEAD' }).catch((e) => {});
				if (data) {
					const type = data.headers.get('content-type');
					if (type?.match(/video\/|image\//g)) checks.push(1);
					else checks.push(0);
				}
			}
		}
		if (!checks.includes(0) && checks.length > 0) return finish(message, counter, channel);
		else {
			counter.count++;
			counter.save();
			if (counter.count >= channel.t) {
				message.channel.send(channel.msg).then((msg) => {
					setTimeout(() => {
						msg.delete().catch(() =>
							setTimeout(() => {
								msg.delete().catch(() =>
									setTimeout(() => {
										msg.delete().catch((e) => console.log(e));
									}, 60000 * 2)
								);
							}, 60000)
						);
					}, 30000);
				});
			}
		}
	}
};

function finish(message: Message<boolean>, counter: Counter, channel: Channels[0]) {
	if (message.channel.type !== 0) return;
	if (!message?.id) return;
	counter.count = 0;
	counter.save();
	for (const emoji of channel.emojis) {
		message.react(emoji).catch((e: Error) => console.log('error reacting to a message'));
	}
}
