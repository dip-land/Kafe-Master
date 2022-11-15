import express from 'express';
import promClient from 'prom-client';
import Config from '../../structures/database/config.js';
import Queue from '../../structures/database/queue.js';
import Quote from '../../structures/database/quote.js';
import User from '../../structures/database/user.js';
import { beta, client } from '../../index.js';

const Registry = promClient.Registry;
const register = new Registry();

export const start = async () => {
	if (beta) return;
	const wsPing = new promClient.Gauge({
		name: 'beta_ws_ping',
		help: 'ws ping',
		async collect() {
			this.set(client.ws.ping);
		},
	});
	const users = new promClient.Gauge({
		name: 'beta_users',
		help: 'number of users',
		async collect() {
			this.set((await client.guilds.fetch('981639333549322262')).memberCount);
		},
	});
	const dbConfigs = new promClient.Gauge({
		name: 'beta_db_configs',
		help: 'number of configs',
		async collect() {
			this.set((await Config.findAll()).length);
		},
	});
	const dbQuotes = new promClient.Gauge({
		name: 'beta_db_quotes',
		help: 'number of quotes',
		async collect() {
			this.set((await Quote.findAll()).length);
		},
	});
	const dbUsers = new promClient.Gauge({
		name: 'beta_db_users',
		help: 'number of users',
		async collect() {
			this.set((await User.findAll()).length);
		},
	});
	const dbSongQueue = new promClient.Gauge({
		name: 'beta_db_songs',
		help: 'number of songs in queue',
		async collect() {
			this.set((await Queue.findAll()).length);
		},
	});

	register.registerMetric(wsPing);
	register.registerMetric(users);
	register.registerMetric(dbConfigs);
	register.registerMetric(dbQuotes);
	register.registerMetric(dbSongQueue);
	register.registerMetric(dbUsers);

	promClient.collectDefaultMetrics({ register });

	const app = express();

	app.get('/metrics', async (_req: any, res: any) => {
		try {
			res.set('Content-Type', register.contentType);
			res.end(await register.metrics());
		} catch (err) {
			console.log(err);
			res.status(500).end(err);
		}
	});

	app.listen(4001, '0.0.0.0');
};
