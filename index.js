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

// load modules
client.commands = new Collection();
const commands = [];
let timers = [];
const moduleDirectories = [
  'commands',
  'events',
  'features',
];

moduleDirectories.forEach((directory) => {
  const dirPath = path.join(__dirname, directory);
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.js'));

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    // nomadjimbob: files in dir are unknown pre runtime
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const module = require(filePath);

    if ('commands' in module) {
      module.commands.forEach((command) => {
        client.commands.set(command.data.name, command);
        process.stdout.write('set command joke\n');
        commands.push(command.data.toJSON());
      });
    }

    if ('events' in module) {
      module.events.forEach((event) => {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      });
    }

    if ('timers' in module) {
      timers = timers.concat(module.timers);
    }
  });
});

// Send command list
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });
  } catch (error) {
    /* empty */
  }
})();

// Ready
client.on('ready', (bot) => {
  if (timers.length > 0) {
    timers.forEach((timer) => {
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
  }
});

client.login(token);
