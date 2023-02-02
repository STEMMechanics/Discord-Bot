const {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandStringOption,
  SlashCommandChannelOption,
} = require('discord.js');
const parseDate = require('../utils/date');
const store = require('../utils/store');

// nomadjimbob: config only exists in prod
// eslint-disable-next-line import/no-unresolved
const { roleManageGames } = require('../config.json');

const displayCountingChainInfo = async (channelMgr) => {
  let high = {};
  let last = {};

  store.load();
  const game = store.get('counting-chain', {});

  game.rounds.forEach((round) => {
    last = round;
    if ('highscore' in high === false || round.highscore > high.highscore) {
      high = round;
    }
  });

  const fields = [
    {
      name: 'Rule #1',
      value: "The chain will be made up of GIFs. If there isn't a GIF for the number, you may use a picture.",
    },
    {
      name: 'Rule #2',
      value: 'The next number must be 1 higher than the previous number.',
    },
    {
      name: 'Rule #3',
      value: 'All GIFs / Pictures **must comply** with the rules the server already has. (See #rules)',
    },
    {
      name: 'Rule #4',
      value: 'In order to prevent a 1-user or 2-user game, you can only send your message **once** every 3 messages.\n(E.G. User #1 -> User #2 -> User #3 -> User #1)',
    },
    {
      name: 'When does the chain break?',
      value: "Just when the rules laid above aren't followed, when the chain breaks, simply start the chain again.",
    },
    {
      name: 'Additional information',
      value: `Please don't reply to the previous number, to avoid pinging the user. If you have any questions, ask in <#${game['help-channel']}>`,
    },
    {
      name: 'And best of all...',
      value: 'Have fun!',
    },
  ];

  if ('high' in high) {
    fields.push({
      name: 'Current Highscore',
      value: `${high.highscore} (As of ${high.date}. Game was reset cause ${high.reason})`,
    });
  }

  if ('high' in last) {
    fields.push({
      name: 'Last round',
      value: `${last.highscore} (As of ${last.date}. Game was reset cause ${last.reason})`,
    });
  }

  const embed = new EmbedBuilder()
    .setColor('#80FFFF')
    .setTitle('Counting Chain Game')
    .setDescription('The goal is to get to the highest number we can!')
    .addFields(fields);

  if ('status-message' in game && game['status-message'].length > 0) {
    try {
      const message = channelMgr.cache.get(game['info-channel']).fetchMessages({ around: game['status-message'], limit: 1 });
      message.first().edit({ embeds: [embed] });
      return;
    } catch (error) {
      /* empty */
    }
  }

  const message = await channelMgr.cache.get(game['info-channel']).send({ embeds: [embed] });
  game['status-message'] = message.id;
  store.set('counting-chain', game);
};

module.exports = {
  commands: [{
    /* /countingchainsetup */
    data: new SlashCommandBuilder()
      .setName('countingchainsetup')
      .setDescription('Setup a counting chain game. This will reset any current game.')
      .addChannelOption(new SlashCommandChannelOption()
        .setName('info-channel')
        .setDescription('The info channel to use.')
        .setRequired(true))
      .addChannelOption(new SlashCommandChannelOption()
        .setName('game-channel')
        .setDescription('The game channel to use.')
        .setRequired(true))
      .addChannelOption(new SlashCommandChannelOption()
        .setName('help-channel')
        .setDescription('The help channel for questions.')
        .setRequired(true)),
    async execute(interaction) {
      if (interaction.member.roles.cache.has(roleManageGames)) {
        const game = {
          'info-channel': interaction.options.get('info-channel').value,
          'game-channel': interaction.options.get('game-channel').value,
          'help-channel': interaction.options.get('help-channel').value,
          'status-message': '',
          rounds: [],
        };

        store.load();
        store.set('counting-chain', game);
        store.save();

        displayCountingChainInfo(interaction.guild.channels);
        return interaction.reply(':white_check_mark: Counting chain game has been setup');
      }

      return interaction.reply(':no_entry_sign: You don\'t have permission to do that!');
    },
  }, {
    /* /countingchainreset */
    data: new SlashCommandBuilder()
      .setName('countingchainreset')
      .setDescription('Resets the counting chain game.')
      .addIntegerOption(new SlashCommandIntegerOption()
        .setName('highscore')
        .setDescription('The highscore reached in this round.')
        .setRequired(true))
      .addStringOption(new SlashCommandStringOption()
        .setName('reason')
        .setDescription('Why is the chain being reset?')
        .setRequired(true))
      .addStringOption(new SlashCommandStringOption()
        .setName('date')
        .setDescription('The date the chain was broken.')
        .setRequired(true)),
    async execute(interaction) {
      if (interaction.member.roles.cache.has(roleManageGames)) {
        try {
          const roundDate = parseDate(interaction.options.get('date').value);

          store.load();
          const game = store.get('counting-chain', {});
          if ('info-channel' in game) {
            game.rounds.push({
              date: roundDate,
              highscore: interaction.options.get('highscore').value,
              reason: interaction.options.get('reason').value,
            });

            store.set('counting-chain', game);
            store.save();

            displayCountingChainInfo(game, interaction.guild.channels.cache.get(game['info-channel']));
            return interaction.reply(':white_check_mark: Counting chain game has been reset');
          }

          return interaction.reply(':no_entry_sign: The counting chain game has not been setup by me yet');
        } catch (error) {
          return interaction.reply(':interrobang: The date you entered seems invalid');
        }
      }

      return interaction.reply(':no_entry_sign: You don\'t have permission to do that!');
    },
  }],
  events: [{
    name: 'messageCreate',
    async execute(message) {
      if (!message.author.bot) {
        store.load();
        const game = store.get('counting-chain', {});
        if ('game-channel' in game) {
          if (toString(message.channelId) === game['game-channel']) {
            const messages = message.channel.messages.fetch({ limit: 2 });
            messages.forEach((inspectMessage) => {
              if (inspectMessage.author.id === message.author.id) {
                message.channel.send(`<&${roleManageGames}> it appears that ${message.author.name} has posted twice within 2 messages!`);
              }
            });
          }
        }
      }
    },
  }],
};
