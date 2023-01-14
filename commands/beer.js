const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beer')
		.setDescription('A boares drink...'),
	async execute(interaction) {
		return interaction.reply('Beer?!? Look you wild boare, its called ale round these parts');
	},
};
