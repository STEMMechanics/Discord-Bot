module.exports = {
  events: [{
    name: 'ready',
    once: true,
    async execute() {
      process.stdout.write('Discordbot ready\n');
    },
  }],
};
