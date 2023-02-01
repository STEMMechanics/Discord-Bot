const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } = require('discord.js')
const { countingGameChatChannelId, gameChatChannelId } = require("./../config.json")
const store = require("./../utils/store")
const countingGameJS = require("./../features/counting-game")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetcountinggame')
		.setDescription('Resets the counting game, this operation is not reversible.')
		.addIntegerOption(new SlashCommandIntegerOption()
			.setName("highscore")
			.setDescription("The highscore reached in this session of the counting game."))
			.setRequired(true)
		.addStringOption(new SlashCommandStringOption()
			.setName("reason")
			.setDescription("Why did the chain end here?"))
			.setRequired(true)
		.addStringOption(new SlashCommandStringOption()
			.setName("data")
			.setDescription("PLEASE PLEASE PLEASE PLEASE FORMAT AS DD/MM/YYYY I DON'T HAVE A WAY TO CHECK"))
			.setRequired(true),
	async execute(interaction) {
		store.load()
		store.set("last.user.game.one", "")
		store.set("last.user.game.two", "")
		store.save()
		interaction.edit("Counting chain reset.")
	},
};
