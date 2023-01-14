const { apiToken } = require('../config.json');
const got = require('got');

module.exports = async function (path, method = 'GET', json = {}) {
    try {
        var options = {
            url: `https://api.drustcraft.com.au/${path}`,
            throwHttpErrors: false,
            method: method,
            responseType: 'json',
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        };

        if (method && method != 'GET') {
            options['json'] = json;
        }

        const response = await got(options);

        return {
            status: response.statusCode,
            json: response.body
        }
    } catch (error) {
        console.error(`error calling api path ${path} using ${method}`);
        console.error(error);

        return {
            status: 500,
            json: {}
        }
    }
};