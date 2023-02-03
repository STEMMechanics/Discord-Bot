module.exports = {
  timers: [{
    delay: 10,
    execute(client) {
      const activities = [{
        type: 'PLAYING',
        text: 'with fire',
      }, {
        type: 'PLAYING',
        text: 'with Stop Motion',
      }, {
        type: 'PLAYING',
        text: 'with Green Screens',
      }, {
        type: 'PLAYING',
        text: 'Minecraft',
      },
      ];

      const activity = activities[Math.floor(Math.random() * activities.length)];
      process.stdout.write(`Name: ${activity.text} Type: ${activity.type}\n`);
      // Set the client user's presence
      client.user.setPresence({ activities: [{ name: 'with discord.js' }], status: 'idle' });
      // client.user.setPresence({ activity: { name: activity.text, type: activity.type },
      // status: 'online' });
      // client.user.setActivity(activity.text, { type: activity.type });
    },
  }],
};
