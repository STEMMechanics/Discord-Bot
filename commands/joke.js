const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  commands: [{
    data: new SlashCommandBuilder()
      .setName('joke')
      .setDescription('Tells you a joke'),
    async execute(interaction) {
      return interaction.reply("What's brown and sticky? A brown stick");
    },
  }],
};
