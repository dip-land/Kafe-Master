import type { ButtonInteraction, CacheType, ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOption, Message, PermissionResolvable, SelectMenuInteraction } from 'discord.js';

export class Command {
	#name = '';
	#description: string = '';
	#options?: ChatInputApplicationCommandData['options'] = [];
	#aliases: Array<string> = [];
	#category: string = '';
	#cooldown?: number = 5;
	#disabled?: boolean = false;
	#permissions?: Array<PermissionResolvable> = [];
	#prefixCommand?: (message: Message, args: Array<string>) => Promise<any>;
	#slashCommand?: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<any>;
	#button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
	#selectMenu?: (interaction: SelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
	constructor(options: CommandOptions) {
		this.#name = options.name;
		this.#description = options.description;
		this.#options = options.options;
		this.#aliases = options.aliases;
		this.#category = options.category;
		this.#cooldown = options.cooldown;
		this.#disabled = options.disabled;
		this.#permissions = options.permissions;
		this.#prefixCommand = options.prefixCommand;
		this.#slashCommand = options.slashCommand;
		this.#button = options.button;
		this.#selectMenu = options.selectMenu;
	}

	public get applicationData(): ApplicationData {
		return {
			name: this.#name,
			description: this.#description,
			options: this.#options,
		};
	}

	public get commandObject(): CommandObject {
		return {
			name: this.#name,
			description: this.#description,
			options: this.#options,
			aliases: this.#aliases,
			category: this.#category,
			cooldown: this.#cooldown,
			disabled: this.#disabled,
			permissions: this.#permissions,
			prefixCommand: this.#prefixCommand,
			slashCommand: this.#slashCommand,
			button: this.#button,
			selectMenu: this.#selectMenu,
		};
	}

	public get prefixCommand(): (message: Message, args: Array<string>) => Promise<any> {
		return this.#prefixCommand as (message: Message<boolean>, args: string[]) => Promise<any>;
	}
	public get slashCommand(): (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<any> {
		return this.#slashCommand as (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<any>;
	}
	public get button(): (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<any> {
		return this.#button as (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
	}
	public get selectMenu(): (interaction: SelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<any> {
		return this.#selectMenu as (interaction: SelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
	}
}

export class CommandOptions {
	name: string = '';
	description: string = '';
	options?: ChatInputApplicationCommandData['options'] = [];
	aliases: Array<string> = [];
	category: string = '';
	cooldown?: number = 5;
	disabled?: boolean = false;
	permissions?: Array<PermissionResolvable> = [];
	prefixCommand?: (message: Message, args: Array<string>) => Promise<any>;
	slashCommand?: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<any>;
	button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
	selectMenu?: (interaction: SelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
}

export class ApplicationData {
	name!: string;
	description!: string;
	options: ChatInputApplicationCommandData['options'];
}

export class CommandObject {
	name!: string;
	description!: string;
	options: ChatInputApplicationCommandData['options'];
	aliases!: Array<string>;
	category!: string;
	cooldown?: number;
	disabled?: boolean;
	permissions?: Array<PermissionResolvable>;
	prefixCommand?: (message: Message, args: Array<string>) => Promise<any>;
	slashCommand?: (interaction: CommandInteraction, options: readonly CommandInteractionOption<CacheType>[]) => Promise<any>;
	button?: (interaction: ButtonInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
	selectMenu?: (interaction: SelectMenuInteraction, message: undefined | Message, args: Array<string>) => Promise<any>;
}
