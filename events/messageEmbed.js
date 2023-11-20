const {
  EmbedBuilder,
} = require('discord.js');
const { announcementChannelId } = require('../config.json');
const { trimLines } = require('../utils/string');

module.exports = {
  events: [{
    name: 'message',
    async execute(message) {
      if (!message.content.endsWith('/embed')) return;

      const trimmedContent = message.content.slice(0, -6).trim();
      const lines = trimmedContent.content.split('\n');
      const title = lines.shift();
      const description = trimLines(lines);
      if (description.length === 0) {
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
