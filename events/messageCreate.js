const store = require('../utils/store');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (!message.author.bot) {
      // if (message.author.roles.cache.some(role => role.name === roleRunBotAdminCommands)) {
      //     if(message.content.starts)
      // }

      // var data = store.load();
      // objects.increment(data, message.author.id + '.messages');
      // store.save(data);

      store.increment(`${message.author.id}.messages`);

      // Is this in the Weekly-Challenge, remove Participant from all members

      // Is this in the Submit-challenge, download message and content, copy to the
      // admin channel and submit that the user has submitted
    }
  },
};
