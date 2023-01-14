const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tips')
		.setDescription('Tips on playing Drustcraft'),
	async execute(interaction) {
		const responses = [
			'If you get sick of dying, use `/creative` to play something a little more simple.',
			'This is a community server, want to see something, tell someone!',
			'Vendors don\'t all sell the same things, even if they sell the same type of items.',
			'Mobs drop more loot during the Long night event.',
			'Want to help built a new chapter of the server? Join in a workshop and help out.',
			'Take on an Elite in survival, they are generally not that good and will be killed if they run away from a PVP.',
			'There are teleporters in every major city.',
			'Press E to open your inventory',
			'Jumping off high things without an elytra is generally not a good idea',
		];

		return interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
	},
};
