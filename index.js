const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes, Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
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

client.login(token);
