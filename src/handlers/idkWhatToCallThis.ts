import { Message } from 'discord.js';
import { Counter } from './database';

//my testing channel, tearoom, and all the channels in massage parlor
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
	'870773421049516122',
	'821061080621121596',
];
const maxMessagesBeforeTrigger = 8;

export default async (message: Message<boolean>) => {
	if (!channels.includes(message.channelId)) return;
	if (message.channel.type !== 0) return;
	const massageParlor = message.channel.parentId === '683772220467838995';
	const counter = (await Counter.findOrCreate({ where: { id: message.channelId } }))[0];
	if (message.attachments.size > 0) {
		let checks: Array<number> = [];
		for (const [s, attachment] of message.attachments) {
			if (attachment.contentType.match(/video\/|image\//g)) checks.push(1);
			else checks.push(0);
		}
		if (!checks.includes(0)) return finish(message, massageParlor, counter);
	}
	if (message.content) {
		let contents = message.content.split(' ');
		let checks: Array<number> = [];
		for (const content of contents) {
			if (content.startsWith('https://tenor.com/view/') || content.match(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/g) || content.startsWith('https://cdn.discordapp.com/attachments/')) {
				checks.push(1);
			} else if (content.startsWith('http')) {
				let data = await fetch(content, { method: 'HEAD' }).catch((e) => {});
				if (data) {
					let type = data.headers.get('content-type');
					if (type.match(/video\/|image\//g)) checks.push(1);
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
				message.channel.send(sendMessage).then(msg => {
					setTimeout(() => {
						msg.delete().catch((e) => console.log(e))
					}, 30000)
				});
			}
		}
	}
};

function finish(message: Message<boolean>, massageParlor: boolean, counter: Counter) {
	if (message.channel.type !== 0) return;
	counter.count = 0;
	counter.save();
	const emoji = massageParlor ? '<:lewdheart:1001948634859974746>' : '<:kafeheart:973325129914396712>';
	message.react(emoji).catch((e) => console.log('error reacting to message:', e));
}
