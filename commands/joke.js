const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('I can tell you an awesome joke'),
	async execute(interaction) {
		const responses = [
			'A plateau is the highest form of flattery',
			'Time flies like an arrow, fruit flies like a banana',
			'A soldier survived mustard gas in battle, and then pepper spray by the police. He\'s now a seasoned veteran',
			'I hate Russian dolls...so full of themselves',
			'A Buddhist walks up to a hotdog stand and says, "Make me one with everything."',
			'I\'m addicted to brake fluid, but I can stop whenever I want',
			'Two fish are sitting in a tank. One looks over at the other and says: "Hey, do you know how to drive this thing?"',
			'I told my doctor that I broke my arm in two places. He told me to stop going to those places',
			'What\'s orange and sounds like a parrot ? A carrot',
			'How do you keep an idiot in suspense?',
			'What\'s E.T.short for? Because he\'s only got little legs',
			'What do you call a magic dog? A labracadabrador',
			'My granddad has the heart of a lion and a lifetime ban from the Taronga Zoo',
			'I went on a once in a lifetime holiday. Never again'
		];
		

		return interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
	},
};
