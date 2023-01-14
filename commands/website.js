const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('website')
		.setDescription('Where is this website?'),
	async execute(interaction) {
		return interaction.reply('Thats a simple one, its **drustcraft.com.au**');
	},
};
