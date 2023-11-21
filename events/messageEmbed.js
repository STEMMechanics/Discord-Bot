const {
  EmbedBuilder,
} = require('discord.js');
const { announcementChannelId } = require('../config.json');
const { trimLines } = require('../utils/string');

module.exports = {
  events: [{
    name: 'messageCreate',
    async execute(message) {
      try {
        if (!message.content.endsWith('/embed')) {
          return;
        }

        const trimmedContent = message.content.slice(0, -6);
        const lines = trimmedContent.split('\n');
        const title = lines.shift();
        const description = trimLines(lines);
        if (description.length === 0) {
          return;
        }

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description.join('\n'));

        const announcementChannel = message.client.channels.cache.get(announcementChannelId);
        if (announcementChannel && announcementChannel.isTextBased()) {
          announcementChannel.send({ embeds: [embed] });
        }

        message.delete();
      } catch (error) {
        process.stderr.write(`${error}\n`);
      }
    },
  }],
};
