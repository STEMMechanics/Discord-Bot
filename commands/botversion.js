const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botversion')
		.setDescription('Lists the bot version'),
	async execute(interaction) {
		return interaction.reply('1.0');
	},
};
