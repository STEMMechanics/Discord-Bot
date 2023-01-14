const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes, Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { clientId, guildId, token, webhookAddress, webhookPort, webhookSecret } = require('./config.json');
const http = require('http');
const qs = require('querystring');
const crypto = require('crypto');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Load commands
client.commands = new Collection();
const commands = []; 
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

// Send command list
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Load timers
client.on('ready', (client) => {
    const timersPath = path.join(__dirname, 'timers');
    const timerFiles = fs.readdirSync(timersPath).filter(file => file.endsWith('.js'));

    for (const file of timerFiles) {
        const filePath = path.join(timersPath, file);
        const timer = require(filePath);
                
        if (timer.once) {
            setTimeout(function() {
                timer.execute(client, timer.data)
            }, timer.delay * 1000);
        } else {
            timer.execute(client, timer.data);
            setInterval(function() {
                timer.execute(client, timer.data)
            }, timer.delay * 1000);
        }
    }
});

// Load webhooks
var webhooks = [];

const webhooksPath = path.join(__dirname, 'webhooks');
const webhookFiles = fs.readdirSync(webhooksPath).filter(file => file.endsWith('.js'));

for (const file of webhookFiles) {
    const filePath = path.join(webhooksPath, file);
    const webhook = require(filePath);

    webhooks[webhook.event] = webhook.execute;
}

client.on('ready', (client) => {
    const server = http.createServer(function(request, response) {
        if (request.method == 'POST') {
            const hmac = crypto.createHmac('sha256', webhookSecret);
            var body = '';

            if (request.headers["x-drustcraft-event"] && request.headers["x-drustcraft-signature"]) {
                request
                    .on('data', function (data) {
                    body += data;
                    hmac.update(data);
                    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                    if (body.length > 1e6) {
                        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                        request.destroy();
                    }
                });

                request.on('end', function () {
                    const hash = hmac.digest('hex');
                    if (hash === request.headers["x-drustcraft-signature"]) {
                        var post = {};
                        
                        try {
                            if (request.headers['content-type'] == 'application/json') {
                                post = JSON.parse(body);
                            } else if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
                                post = qs.parse(body);
                            } else {
                                response.writeHead(400, { "Content-Type": "text/plain" });
                                response.end("400 - Bad Request\n");
                                return;
                            }
                        } catch(error) {
                            console.log('cannot parse webhook body');
                            console.log(error);
                            response.writeHead(400, { "Content-Type": "text/plain" });
                            response.end("400 - Bad Request\n");
                            return;
                        }
                        
                        if (webhooks[request.headers["x-drustcraft-event"]]) {
                            const webhookResponse = webhooks[request.headers["x-drustcraft-event"]](client, request.headers, post);

                            if (webhookResponse && webhookResponse.json) {
                                response.writeHead(webhookResponse.status ? webhookResponse.status : 200, { "Content-Type": "application/json" });
                                response.end(JSON.stringify(webhookResponse.json));
                            } else {
                                response.writeHead(200, { "Content-Type": "application/json" });
                                response.end('{}');
                            }
                        } else {
                            response.writeHead(406, { "Content-Type": "text/plain" });
                            response.end("406 - Not Acceptable\n");
                        }
                    } else {
                        response.writeHead(400, { "Content-Type": "text/plain" });
                        response.end("400 - Bad Request\n");
                    }
                });
            } else {
                response.writeHead(400, { "Content-Type": "text/plain" });
                response.end("400 - Bad Request\n");
            }
        } else {
            response.writeHead(405, { "Content-Type": "text/plain" });
            response.end("405 - Method Not Allowed\n");
        }
    });

    server.listen(webhookPort, webhookAddress, () => {
        console.log(`Webhook server running at http://${webhookAddress}:${webhookPort}/`);
    });
});

client.login(token);
