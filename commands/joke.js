const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Tells you a joke'),
	async execute(interaction) {
		return interaction.reply(`I don't know any jokes yet.`);
	},
};
