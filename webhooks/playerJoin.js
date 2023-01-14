const updateStatus = require('../utils/updateStatus.js');

module.exports = {
    event: 'player.session',
    execute(client, headers, data) {
        console.log(headers);
        console.log(data);

        // updateStatus(client);
    },
};