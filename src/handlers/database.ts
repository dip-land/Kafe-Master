import { Guild } from 'discord.js';
import { DataTypes, Sequelize, Model } from 'sequelize';
import { beta, client } from '../index';
import { readFile, writeFile } from 'node:fs';
const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: './data/db.sqlite',
});

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
export class Song extends Model {
	declare id: string;
	declare platform: string;
	declare duration: string;
}
Song.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
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
			defaultValue: 1000,
		},
	},
	{ sequelize, modelName: 'Users', timestamps: false }
);
export async function registerGuild(guild: Guild) {
	await sequelize.sync({ alter: true });
	const members = await guild.members.fetch();
	for (const [memberID] of members) {
		if (!(await User.findOne({ where: { id: memberID } }))) {
			new User({ id: memberID }).save();
		}
	}
}

sequelize.afterCreate('', () => {
	sequelize.sync({ alter: true });
});

sequelize.beforeSync('', () => {
	readFile('./data/db.sqlite', (err, data) => {
		if (err) console.log(err);
		if (data)
			writeFile(`./data/backups/db_${Date.now()}.sqlite`, data.toString(), (err) => {
				if (err) console.log(err);
				console.log(`Backup ${Date.now()} created.`);
			});
	});
});

setInterval(() => {
	readFile('./data/db.sqlite', (err, data) => {
		if (err) console.log(err);
		if (data)
			writeFile(`./data/backups/db_${Date.now()}.sqlite`, data.toString(), (err) => {
				if (err) console.log(err);
				console.log(`Backup ${Date.now()} created.`);
			});
	});
}, 60 * 60000);
