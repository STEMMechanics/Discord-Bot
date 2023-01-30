const { SlashCommandBuilder } = require('discord.js');
const { buildNumber } = require('../build.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botversion')
		.setDescription('Lists the bot build version'),
	async execute(interaction) {
		return interaction.reply(`STEMMechanics Discord Bot build ${buildNumber}`);
	},
};
