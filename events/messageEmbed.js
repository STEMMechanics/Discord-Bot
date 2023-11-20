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
        process.stderr.write('running handler for message\n');
        if (!message.content.endsWith('/embed')) {
          process.stderr.write('messages does not end with embed\n');
          return;
        }

        const trimmedContent = message.content.slice(0, -6);
        const lines = trimmedContent.split('\n');
        const title = lines.shift();
        const description = lines;// trimLines(lines);
        if (description.length === 0) {
          process.stderr.write('description length is 0\n');
          return;
        }

        const embed = new EmbedBuilder()
          .setColor(0x000000)
          .setTitle(title)
          .setDescription(description.join('\n'));

        const announcementChannel = message.client.channels.cache.get(announcementChannelId);
        if (announcementChannel && announcementChannel.isText()) {
          announcementChannel.send(embed);
        } else {
          process.stderr.write('announcementChannel null\n');
        }

        message.delete();
        process.stderr.write('complete\n');
      } catch (error) {
        process.stderr.write(`${error}\n`);
      }
    },
  }],
};
