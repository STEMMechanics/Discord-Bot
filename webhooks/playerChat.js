const { gameChatChannelId } = require('../config.json');

module.exports = {
    event: 'player.messages',
    execute(client, data) {
        if (gameChatChannelId) {
            try {
                console.log(data.playername);
                const channel = client.channels.cache.get(gameChatChannelId);
                channel.send(`${data.playername} » ${data.message}`);
            } catch(error) {
                console.error('Cannot log game chat to discord');
                console.error(error);
            }
        }
    },
};