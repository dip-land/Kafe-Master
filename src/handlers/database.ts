import { Guild } from 'discord.js';
import { DataTypes, Sequelize, Model } from 'sequelize';
import { client } from '../index';
const sequelize = new Sequelize({
	dialect: 'sqlite',
	logging: false,
	storage: './data/db.sqlite',
});

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

const logChannels = ['1002785897005199480', ''];

Quote.afterCreate('s', async (quote) => {
	const channel = await client.channels.fetch(logChannels[0]).catch((e) => {});
	let createdBy = await client.users.fetch(quote.createdBy);
	if (channel && channel?.isTextBased()) {
		channel.send({ content: `\`Quote #${quote.id}  Keyword: ${quote.keyword}\` ${quote.text}\n\n<t:${Math.floor(quote.createdAt.getTime() / 1000)}:F>\nCreated by ${createdBy.tag} (${createdBy.id})` });
	}
});

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

// class Game extends Model {
// 	declare id: number;
// 	declare dealerCards: string;
// 	declare player1: string;
// 	declare player1Bet: string;
// 	declare player1Cards: string;
// 	declare player2: string;
// 	declare player2Bet: string;
// 	declare player2Cards: string;
// 	declare player3: string;
// 	declare player3Bet: string;
// 	declare player3Cards: string;
// 	declare player4: string;
// 	declare player4Bet: string;
// 	declare player4Cards: string;
// 	declare player5: string;
// 	declare player5Bet: string;
// 	declare player5Cards: string;
// 	declare player6: string;
// 	declare player6Bet: string;
// 	declare player6Cards: string;
// 	declare player7: string;
// 	declare player7Bet: string;
// 	declare player7Cards: string;
// }
// Game.init(
// 	{
// 		id: {
// 			type: DataTypes.INTEGER,
// 			primaryKey: true,
// 			autoIncrement: true,
// 		},
// 		dealerCards: DataTypes.STRING,
// 		player1: DataTypes.STRING,
// 		player1Bet: DataTypes.STRING,
// 		player1Cards: DataTypes.STRING,
// 		player2: DataTypes.STRING,
// 		player2Bet: DataTypes.STRING,
// 		player2Cards: DataTypes.STRING,
// 		player3: DataTypes.STRING,
// 		player3Bet: DataTypes.STRING,
// 		player3Cards: DataTypes.STRING,
// 		player4: DataTypes.STRING,
// 		player4Bet: DataTypes.STRING,
// 		player4Cards: DataTypes.STRING,
// 		player5: DataTypes.STRING,
// 		player5Bet: DataTypes.STRING,
// 		player5Cards: DataTypes.STRING,
// 		player6: DataTypes.STRING,
// 		player6Bet: DataTypes.STRING,
// 		player6Cards: DataTypes.STRING,
// 		player7: DataTypes.STRING,
// 		player7Bet: DataTypes.STRING,
// 		player7Cards: DataTypes.STRING,
// 	},
// 	{ sequelize, modelName: 'Games', timestamps: false }
// );

// export async function createGame(dealerCards: Array<number>, players: Array<Array<unknown>>) {
// 	await sequelize.sync();
// 	const values = [];
// 	values.push(`"dealerCards": "${dealerCards}"`);
// 	for (const i in players) {
// 		const player = players[i];
// 		const index = +i + 1;
// 		const endValue = `"player${index}": "${player[0]}", "player${index}Bet": "${player[1]}", "player${index}Cards": "${player[2]}"`
// 		values.push(endValue);
// 	}
// 	return new Game(JSON.parse(`{${values.toString()}}`));
// }
// createGame([11,10], [['1', 1, [1,1]], ['2', 2, [2,2]], ['3', 3, [3,3]]]);

// export declare type player = {
// 	id: string;
// 	bet: number;
// 	cards: Array<number>;
// };
