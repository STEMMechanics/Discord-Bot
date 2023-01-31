const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Tells you a joke'),
	async execute(interaction) {
		return interaction.reply(`Have you looked in the mirror?`);
	},
};
