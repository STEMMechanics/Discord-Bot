const { SlashCommandBuilder } = require('discord.js');
const store = require("./../utils/store")
const countingGameJS = require("./../features/counting-game")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetcountinggame')
		.setDescription('Resets the counting game, this operation is not reversible.'),
	async execute(interaction) {
		store.load()
		store.set("last.user.game.one", "")
		store.set("last.user.game.two", "")
		store.save()
	},
};
