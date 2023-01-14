const updateStatus = require('../utils/updateStatus.js');

module.exports = {
    event: 'player-leave',
    execute(client, data) {
        updateStatus(client);
    },
};