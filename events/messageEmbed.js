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

        process.stderr.write(lines.join('\n'));
        process.stderr.write(description.join('\n'));

        const embed = new EmbedBuilder()
          .setColor(0x000000)
          .setTitle(title)
          .setDescription(description.join('\n'));

        const announcementChannel = message.client.channels.cache.get(announcementChannelId);
        if (announcementChannel && announcementChannel.isTextBased()) {
          announcementChannel.send(embed);
        }

        message.delete();
      } catch (error) {
        process.stderr.write(`${error}\n`);
      }
    },
  }],
};
