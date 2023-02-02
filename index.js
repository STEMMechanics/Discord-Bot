const fs = require('node:fs');
const path = require('node:path');
const {
  REST,
  Routes,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require('discord.js');

// nomadjimbob: config only exists in prod
// eslint-disable-next-line import/no-unresolved
const { clientId, guildId, token } = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Load commands
client.commands = new Collection();
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  const filePath = path.join(commandsPath, file);

  // nomadjimbob: files in dir are unknown pre runtime
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(token);

// Send command list
(async () => {
  try {
    // console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    // console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    // console.error(error);
  }
})();

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

eventFiles.forEach((file) => {
  const filePath = path.join(eventsPath, file);

  // nomadjimbob: files in dir are unknown pre runtime
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// Load timers
client.on('ready', (bot) => {
  const timersPath = path.join(__dirname, 'timers');
  const timerFiles = fs
    .readdirSync(timersPath)
    .filter((file) => file.endsWith('.js'));

  timerFiles.forEach((file) => {
    const filePath = path.join(timersPath, file);

    // nomadjimbob: files in dir are unknown pre runtime
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const timer = require(filePath);

    if (timer.once) {
      setTimeout(() => {
        timer.execute(bot, timer.data);
      }, timer.delay * 1000);
    } else {
      timer.execute(bot, timer.data);
      setInterval(() => {
        timer.execute(bot, timer.data);
      }, timer.delay * 1000);
    }
  });
});

client.login(token);
