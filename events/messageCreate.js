const objectutils = require('js-object-utilities'); 
const { gameChatChannelId, roleRunBotAdminCommands } = require('../config.json');
const store = require('../utils/store.js');

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

            store.increment(message.author.id + '.messages')

			if (message.channelId == gameChatChannelId) {
				let toDelete = false
				
				if (message.author.id == store.get("last.user.game.one")) {
					toDelete = true
				} else if (message.author.id == store.get("last.user.game.two")) {
					toDelete = true
				}
				

				// i am NOT going to implement OCR (optical character recognition) thank you very much

				if (toDelete) {
					message.delete()
				} else {
					store.load()
					store.set("last.user.game.two", store.get("last.user.game.one"))
					store.set("last.user.game.one", message.author.id)
					store.save()
				}
			}

            // Is this in the Weekly-Challenge, remove Participant from all members

            // Is this in the Submit-challenge, download message and content, copy to the admin channel and submit that the user has submitted
            
        }
    },
};
