const updateStatus = require('../utils/updateStatus.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        updateStatus(client);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};