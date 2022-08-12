import type { CacheType, ChatInputApplicationCommandData, Client, Collection, CommandInteraction, CommandInteractionOption, Message } from 'discord.js';
declare module 'discord.js' {
	interface Client {
		cooldowns: Collection<string, any>;
		legacyCommands: Collection<string, CommandFile>;
	}

	interface APIInteractionGuildMember {
		voice: VoiceState;
	}
}

export type CommandFile = {
	data: ChatInputApplicationCommandData;
	extendedData: {
		aliases?: Array<string>;
		category: string;
		cooldown?: number;
		disabled?: boolean;
	};
	default: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => void;
	legacy: (message: Message, args: Array<string>, client?: Client) => void;
};

export type EventFile = {
	name: string;
	once: boolean;
	default: (...args: Array<any>) => void;
};
