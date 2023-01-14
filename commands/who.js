const { SlashCommandBuilder } = require('discord.js');
const api = require('../utils/api.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('who')
		.setDescription('Who are you?')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to lookup')
				.setRequired(true)),
	async execute(interaction) {
		const discordUser = interaction.options.getUser('user');

		api(`user?discord_id=${discordUser.id}`, 'POST', {}).then((response) => {
			if (response.status == 200 && (response.json.hasOwnProperty('players'))) {
				return interaction.reply(`${discordUser.username} is known as ${response.json.players[0].name}`);
			} else {
				const responses = [
					'No idea bud',
					'Never seen them playing',
					'Stranger round those parts',
					'Hides themselves well in game'
				];

				return interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
			}
		});
	},
};
