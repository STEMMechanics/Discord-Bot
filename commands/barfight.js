const util = require('util');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('barfight')
		.setDescription('....'),
	async execute(interaction) {
		var attacks = null;

		interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
			const onlineMembers = fetchedMembers.filter(member => member.presence?.status === 'online' && member.user.bot === false);

			while(attacks == null || attacks.id == interaction.member.id) {
				attacks = onlineMembers.random();
			}

			const responses = [
				'%s tries to throw a swing at %s but ends up on the floor instead',
				'%s acts all tough, but is just standing their drooling at %s',
				'%s starts a scuffle with %s and they run away',
				'%s screams and %s wets their pants',
				'%s screams and %s screams back',
				'%s throws their drink at %s then starts licking the floor'
			];

			return interaction.reply(util.format(responses[Math.floor(Math.random() * responses.length)], interaction.member.user.username, attacks.user.username));
		});
	},
};
