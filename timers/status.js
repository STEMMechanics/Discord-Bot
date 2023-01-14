const updateStatus = require('../utils/updateStatus.js');

module.exports = {
    delay: 1800,
    // data : {counter: 1},
    execute(client, data) {
        updateStatus(client);
    },
};
