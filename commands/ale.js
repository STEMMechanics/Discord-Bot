const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ale')
		.setDescription('Gives you a refreshing ale!'),
	async execute(interaction) {
		const responses = [
			'Here ya go friend :beer:',
			'Have an ale on the house :beer:',
			'Ima give you one and one for ya friend :beers:',
			'You be looking like you had enough',
		];

		return interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
	},
};
