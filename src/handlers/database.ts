import { Guild } from 'discord.js';
import { DataTypes, Sequelize, Model } from 'sequelize';
import { beta, client } from '../';
import { existsSync, readFile, writeFile, unlinkSync } from 'node:fs';
const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: './data/db.sqlite',
});

//Config
export class Config extends Model {
	declare id: string;
	declare prefix: string;
	
}

//Quotes
export class Quote extends Model {
	declare id: number;
	declare keyword: string;
	declare text: string;
	declare createdBy: string;
	declare createdAt: Date;
	declare updatedAt: Date;
}
Quote.init(
	{
		keyword: DataTypes.STRING,
		text: DataTypes.STRING,
		createdBy: DataTypes.STRING,
	},
	{ sequelize, modelName: 'Quotes', timestamps: true }
);

Quote.afterCreate('s', async (quote) => {
	const channelID = beta ? '1002785897005199480' : '1004144428019097600';
	const channel = await client.channels.fetch(channelID).catch((e) => {});
	let createdBy = await client.users.fetch(quote.createdBy);
	if (channel && channel?.isTextBased()) {
		channel.send({ content: `\`Quote #${quote.id}  Keyword: ${quote.keyword}\` ${quote.text}\n\n<t:${Math.floor(quote.createdAt.getTime() / 1000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})` });
	}
});

Quote.afterDestroy('s', async (quote) => {
	const channelID = beta ? '1002785897005199480' : '1004144428019097600';
	const channel = await client.channels.fetch(channelID).catch((e) => {});
	let createdBy = await client.users.fetch(quote.createdBy);
	if (channel && channel?.isTextBased()) {
		channel.send({ content: `\`Quote #${quote.id} Deleted\` ${quote.text}\n\n<t:${Math.floor(Date.now() / 1000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})` });
	}
});

//Couunters
export class Counter extends Model {
	declare id: string;
	declare count: number;
}
Counter.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		count: DataTypes.INTEGER,
	},
	{ sequelize, modelName: 'Counters', timestamps: false }
);

//Song Queue
export class Queue extends Model {
	declare id: string;
	declare url: string;
	declare platform: string;
	declare duration: string;
}
Queue.init(
	{
		url: DataTypes.STRING,
		platform: DataTypes.STRING,
		duration: DataTypes.STRING,
	},
	{ sequelize, modelName: 'Song_Queue' }
);

//Users (Experminetal not in production use)
export class User extends Model {
	declare id: string;
	declare xp: number;
	declare level: number;
	declare money: number;
	getXpToNextLevel() {
		return this.xp;
	}
	levelUp() {
		this.level++;
		this.save();
		return this.level;
	}
}
User.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			unique: true,
		},
		xp: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		money: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{ sequelize, modelName: 'Users', timestamps: false }
);
export async function registerGuild(guild: Guild) {
	await Queue.sync({ force: true });
	await sequelize.sync({ alter: true });
	const members = await guild.members.fetch();
	for (const [memberID] of members) {
		if (!(await User.findOne({ where: { id: memberID } }))) {
			new User({ id: memberID }).save();
		}
	}
}

sequelize.beforeSync('', () => {
	readFile('./data/db.sqlite', (error, data) => {
		if (existsSync(`./data/backups/db_${Math.floor(Date.now() / 10000)}.sqlite`) || error) return;
		writeFile(`./data/backups/db_${Math.floor(Date.now() / 10000)}.sqlite`, data.toString(), (error) => {
			if (error) console.log(error);
			console.log(`Backup ${Math.floor(Date.now() / 10000)} created.`);
			importData('quotes.txt', './data/imports/', true);
			importData('counters.txt', './data/imports/', true);
			importData('song_queues.txt', './data/imports/', true);
			importData('users.txt', './data/imports/', true);
		});
	});
});

function importData(name: string, basePath: string, deleteImport: boolean) {
	readFile(`${basePath}${name}`, (error, data) => {
		if (!data || error) return;
		let splitData = data.toString().split(/\r\n/);
		for (const d of splitData) {
			let data = d.split(':|:');
			try {
				if (name.includes('quotes')) new Quote({ keyword: data[0], text: data[1], createdBy: data[2] }).save();
				else if (name.includes('counters')) new Counter({ id: data[0], count: data[1] }).save();
				else if (name.includes('song_queues')) new Queue({ id: data[0], platform: data[1], duration: data[2] }).save();
				else if (name.includes('users')) new User({ id: data[0], xp: data[1], level: data[2], money: data[2] }).save();
			} catch (error) {}
		}
		if (deleteImport) unlinkSync(`${basePath}${name}`);
	});
}
