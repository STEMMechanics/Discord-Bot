const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('How to join the server'),
	async execute(interaction) {
		const responses = [
			'But don\'t expect to live long, you dont look like a strong person',
			'Take this :milk:, you look like you need it',
			'I advise you when you login to run, run as far as you can',
			'When you log on, dig down, keep digging, until you fall to your death. It\'ll be quicker for you',
			'Head to Ironport and stay there. I don\'t reckon you will survive for long in the wilderness',
			'Maybe stay away from any minigames. You don\'t look like you can shoot a bow straight',
		];

		return interaction.reply('Point your Java Minecraft client to **play.drustcraft.com.au**. Version 1.19.2 is required and you need to enable resource packs\n\n' + responses[Math.floor(Math.random() * responses.length)]);
	},
};
