// const api = require('./api');
const http = require('http');
const { ActivityType } = require('discord.js');
const pluralize = require('pluralize');

module.exports = function (client) {
    var httpOptions = {
        host: uploadHost,
        port: uploadPort,
        headers: {
            'Authorization': 'Bearer ' + uploadToken
        },
        method: 'GET',
        path: 'server/query'
    };

    http.request(httpOptions, async (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }

        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', async () => {
            try {
                const parsedData = JSON.parse(rawData);

                client.user.setPresence({
                    activities: [{ name: `${parsedData.players} ${pluralize('player', players)}`, type: ActivityType.Watching }],
                    status: 'online',
                });
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', async (e) => {
        console.error(`Got error: ${e.message}`);
    });

    // api('online', 'GET').then((response) => {
    //     var players = 0;

    //     if (response.players) {
    //         players = count(response.players);
    //     }

    //     client.user.setPresence({
    //         activities: [{ name: `${players} ${pluralize('player', players)}`, type: ActivityType.Watching }],
    //         status: 'online',
    //     });
    // });
};