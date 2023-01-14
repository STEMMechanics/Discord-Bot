const objectutils = require('js-object-utilities'); 
const { gameChatChannelId } = require('../config.json');
const api = require('../utils/api.js');
const store = require('../utils/store.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (!message.author.bot) {
            if (gameChatChannelId && message.channelId == gameChatChannelId) {
                api('chat', 'POST', {
                    'playername': message.author.username,
                    'message': message.content
                }).then((response) => {
                    // console.log(`here, response: ${response.status}, data: ${JSON.stringify(response.json)}`);
                });
            }

            // var data = store.load();
            // objects.increment(data, message.author.id + '.messages');
            // store.save(data);

            store.increment(message.author.id + '.messages')
        }
    },
};
