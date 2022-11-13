import type { Message } from 'discord.js';
import Counter from '../structures/database//counter.js';

//my testing channel, tearoom, and all the channels in massage parlor except basement
const channels: Array<string> = [
	'1002426028532174959',
	'690972955080917085',
	'973421960790954024',
	'632719361190395925',
	'870772556343443556',
	'817153208807981056',
	'821055344566468689',
	'819703387351285790',
	'861372174664073226',
	'821061080621121596',
];
const maxMessagesBeforeTrigger = 16;

export default async (message: Message<boolean>) => {
	if (!channels.includes(message.channelId)) return;
	if (message.channel.type !== 0) return;
	if (!message?.id) return;
	const massageParlor = message.channel.parentId === '683772220467838995';
	const counter = (await Counter.findOrCreate({ where: { id: message.channelId } }))[0];
	if (message.attachments.size > 0) {
		const checks: Array<number> = [];
		for (const [s, attachment] of message.attachments) {
			if (s) null;
			if (attachment.contentType?.match(/video\/|image\//g)) checks.push(1);
			else checks.push(0);
		}
		if (!checks.includes(0)) return finish(message, massageParlor, counter);
	}
	if (message.content) {
		const contents = message.content.split(' ');
		const checks: Array<number> = [];
		for (const content of contents) {
			if (content.startsWith('https://tenor.com/view/') || content.match(/^(https?:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/g) || content.startsWith('https://twitter.com/')) {
				checks.push(1);
			} else if (content.startsWith('http')) {
				const data = await fetch(content, { method: 'HEAD' }).catch();
				if (data) {
					const type = data.headers.get('content-type');
					if (type?.match(/video\/|image\//g)) checks.push(1);
					else checks.push(0);
				}
			}
		}
		if (!checks.includes(0) && checks.length > 0) return finish(message, massageParlor, counter);
		else {
			counter.count++;
			counter.save();
			if (counter.count >= maxMessagesBeforeTrigger) {
				const sendMessage = massageParlor ? "❕l-lewds.. w-where's the lewds >W> haahh, haaah~ ahhnn, post more lewds~!!" : "❕>w< w-where's the cute~?? Post more cute~!";
				message.channel.send(sendMessage).then((msg) => {
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

function finish(message: Message<boolean>, massageParlor: boolean, counter: Counter) {
	if (message.channel.type !== 0) return;
	if (!message?.id) return;
	counter.count = 0;
	counter.save();
	const emoji = massageParlor ? '<:lewdheart:1001948634859974746>' : '<a:akafeheart:1009602965616726026>';
	message.react(emoji).catch((e: Error) => console.log('error reacting to message:', e.message));
}
