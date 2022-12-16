import { platform } from 'os';
export const beta = platform() === 'win32';

import { ShardingManager } from 'discord.js';
import 'dotenv/config';

const manager = new ShardingManager('./dist/handlers/bot.js', { token: beta ? (process.env.BETATOKEN as string) : (process.env.TOKEN as string) });

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn().catch((e) => {
	console.log(e);
});
