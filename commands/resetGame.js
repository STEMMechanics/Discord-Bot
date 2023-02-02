const { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } = require('discord.js');
const store = require('../utils/store');
const { gameEmbed } = require('../features/counting-game');
// nomadjimbob: config only exists in prod
// eslint-disable-next-line import/no-unresolved
const { countingGameRulesChannelId } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resetcountinggame')
    .setDescription('Resets the counting game, this operation is not reversible.')
    .addIntegerOption(new SlashCommandIntegerOption()
      .setName('highscore')
      .setDescription('The highscore reached in this session of the counting game.')
      .setRequired(true))
    .addStringOption(new SlashCommandStringOption()
      .setName('reason')
      .setDescription('Why did the chain end here?')
      .setRequired(true))
    .addStringOption(new SlashCommandStringOption()
      .setName('date')
      .setDescription("PLEASE PLEASE PLEASE PLEASE FORMAT AS DD/MM/YYYY I DON'T HAVE A WAY TO CHECK")
      .setRequired(true)),
  async execute(interaction) {
    gameEmbed(
      interaction.options.getInteger('highscore'),
      interaction.options.getString('date'),
      interaction.options.getString('reason'),
      interaction.guild.channels.cache[countingGameRulesChannelId],
    );
    store.load();
    store.set('last.user.game.one', '');
    store.set('last.user.game.two', '');
    store.save();
    return interaction.reply('Counting chain reset.');
  },
};
