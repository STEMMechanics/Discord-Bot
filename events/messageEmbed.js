const {
  EmbedBuilder,
} = require('discord.js');
const { announcementChannelId } = require('../config.json');
const { trimLines } = require('../utils/string');

module.exports = {
  events: [{
    name: 'messageCreate',
    async execute(message) {
      process.stdout.write('running handler for message\n');
      if (!message.content.endsWith('/embed')) {
        process.stdout.write('messages does not end with embed\n');
        return;
      }

      const trimmedContent = message.content.slice(0, -6);
      const lines = trimmedContent.content.split('\n');
      const title = lines.shift();
      const description = trimLines(lines);
      if (description.length === 0) {
        process.stdout.write('description length is 0\n');
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0x000000)
        .setTitle(title)
        .setDescription(description.join('\n'));

      const announcementChannel = message.client.channels.cache.get(announcementChannelId);
      if (announcementChannel && announcementChannel.isText()) {
        announcementChannel.send(embed);
      }

      message.delete();
    },
  }],
};
