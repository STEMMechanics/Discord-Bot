const { SlashCommandBuilder } = require('discord.js');
const { version } = require('../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botversion')
		.setDescription('Lists the bot version'),
	async execute(interaction) {
		return interaction.reply(`I am version ${version}`);
	},
};
