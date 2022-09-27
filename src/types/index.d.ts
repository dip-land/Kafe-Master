import type { CacheType, ChatInputApplicationCommandData, Client, Collection, CommandInteraction, CommandInteractionOption, Message, PermissionResolvable } from 'discord.js';
declare module 'discord.js' {
	interface Client {
		cooldowns: Collection<string, any>;
		legacyCommands: Collection<string, CommandFile>;
	}

	interface APIInteractionGuildMember {
		voice: VoiceState;
	}
}

export type CommandFileExtendedData = {
	aliases?: Array<string>;
	category: string;
	cooldown?: number;
	disabled?: boolean;
	permissions?: Array<PermissionResolvable>;
};

export type CommandFile = {
	data: ChatInputApplicationCommandData;
	extendedData: CommandFileExtendedData;
	default: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => void;
	legacy: (message: Message, args: Array<string>, client?: Client) => void;
};

export type EventFile = {
	name: string;
	once: boolean;
	default: (...args: Array<any>) => void;
};

export type channelConfigData = {
	emojis: Array<string>;
	allowedURLs: Array<string>;
	attachmentOnlyMode: string;
	maxMessages: string;
	bypassUserImage: string;
	bypassUserMaxMessages: string;
};
