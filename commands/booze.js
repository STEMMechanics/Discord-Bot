const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('booze')
		.setDescription('....'),
	async execute(interaction) {
		return interaction.reply('We don\'t serve you drunks ere');
	},
};
